#!/usr/bin/env python3
"""Generate offline US-English MP3 assets for CPC Academy using Piper."""
from __future__ import annotations

import argparse
import json
import re
import subprocess
import tempfile
import unicodedata
import wave
from pathlib import Path

from piper import PiperVoice


def slug(value: str) -> str:
    normalized = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode("ascii")
    result = re.sub(r"[^a-z0-9]+", "-", normalized.lower()).strip("-")
    return result or "audio"


def unescape_ts_string(value: str) -> str:
    return json.loads('"' + value + '"')


def speech_text(value: str) -> str:
    # Expand common glossary punctuation without changing the displayed term.
    value = re.sub(r";\s*pl\.?", ", plural", value, flags=re.IGNORECASE)
    value = value.replace(";", ",")
    return re.sub(r"\s+", " ", value).strip()


def synthesize_mp3(voice: PiperVoice, text: str, destination: Path, temp_dir: Path) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    wav_path = temp_dir / f"{destination.stem}.wav"
    with wave.open(str(wav_path), "wb") as wav_file:
        voice.synthesize_wav(text, wav_file)
    subprocess.run(
        [
            "ffmpeg", "-y", "-hide_banner", "-loglevel", "error",
            "-i", str(wav_path),
            "-codec:a", "libmp3lame", "-b:a", "48k",
            "-ar", "22050", "-ac", "1",
            str(destination),
        ],
        check=True,
    )
    wav_path.unlink(missing_ok=True)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--model", required=True, help="Path to the en_US Piper ONNX voice model")
    parser.add_argument("--vocabulary", default="lib/book-vocabulary.json")
    parser.add_argument("--starter-words", default="lib/words.ts")
    parser.add_argument("--output-dir", default="out/audio")
    args = parser.parse_args()

    vocabulary = json.loads(Path(args.vocabulary).read_text(encoding="utf-8"))
    starter_source = Path(args.starter_words).read_text(encoding="utf-8")
    terms = list(vocabulary["terms"])

    # Match lib/book-words.ts: book terms first, then any starter terms not in the book list.
    included = {item["term"].lower() for item in terms}
    starter_words_section = starter_source.split("export const words: MedicalWord[] = [", 1)[1].split("\n];", 1)[0]
    starter_examples: list[tuple[str, str]] = []
    for line in starter_words_section.splitlines():
        if 'id:"med-' not in line:
            continue
        term_match = re.search(r'term:"((?:\\.|[^"\\])*)"', line)
        if not term_match:
            continue
        term = unescape_ts_string(term_match.group(1))
        example_match = re.search(r'example:"((?:\\.|[^"\\])*)"', line)
        if term.lower() not in included:
            terms.append({"term": term})
            included.add(term.lower())
        if example_match:
            example = unescape_ts_string(example_match.group(1))
            if example.strip():
                starter_examples.append((term, example))

    # Match lib/book-words.ts: glossary parts first, then any starter-only parts.
    parts = list(vocabulary["parts"])
    part_section = starter_source.split("export const wordParts: WordPart[] = [", 1)[1].split("];", 1)[0]
    part_seen = {item["part"].lower() for item in parts}
    for raw_part in re.findall(r'part: "((?:\\.|[^"\\])*)"', part_section):
        part = unescape_ts_string(raw_part)
        if part.lower() not in part_seen:
            parts.append({"part": part})
            part_seen.add(part.lower())

    output_dir = Path(args.output_dir)
    words_dir = output_dir / "words"
    parts_dir = output_dir / "parts"
    examples_dir = output_dir / "examples"
    for folder in (words_dir, parts_dir, examples_dir):
        folder.mkdir(parents=True, exist_ok=True)

    voice = PiperVoice.load(args.model)
    generated = {"words": 0, "parts": 0, "examples": 0}
    failures: list[str] = []

    with tempfile.TemporaryDirectory(prefix="cpc-audio-") as temp:
        temp_dir = Path(temp)
        total = len(terms) + len(parts) + len(starter_examples)
        current = 0

        def make(text: str, path: Path, label: str, bucket: str) -> None:
            nonlocal current
            current += 1
            try:
                if not path.exists() or path.stat().st_size == 0:
                    synthesize_mp3(voice, speech_text(text), path, temp_dir)
                generated[bucket] += 1
            except Exception as error:  # fail the build after reporting all failed entries
                failures.append(f"{label}: {error}")
            if current % 100 == 0 or current == total:
                print(f"Generated {current}/{total} audio files")

        for index, item in enumerate(terms, start=1):
            term = item["term"]
            path = words_dir / f"{index:04d}-{slug(term)}.mp3"
            make(term, path, f"word {term}", "words")

        for index, item in enumerate(parts, start=1):
            part = item["part"]
            spoken = re.sub(r"[/,;]", " ", part).replace("-", " ")
            path = parts_dir / f"{index:04d}-{slug(part)}.mp3"
            make(spoken, path, f"word part {part}", "parts")

        seen_examples: set[str] = set()
        for term, example in starter_examples:
            key = slug(term)
            if key in seen_examples:
                continue
            seen_examples.add(key)
            path = examples_dir / f"{key}.mp3"
            make(example, path, f"example for {term}", "examples")

    manifest = {
        "voice": "en_US-kristin-medium",
        "accent": "en-US",
        "format": "MP3, 22050 Hz, mono, 48 kbps",
        "offline": True,
        "counts": generated,
        "total": sum(generated.values()),
    }
    (output_dir / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(manifest, ensure_ascii=False, indent=2))
    if failures:
        print("Audio generation failures:")
        print("\n".join(failures))
        raise SystemExit(1)


if __name__ == "__main__":
    main()
