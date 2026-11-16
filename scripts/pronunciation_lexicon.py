"""Verified phoneme overrides for medical terms that default TTS may mispronounce.

Piper 1.4.2 accepts raw eSpeak phonemes via [[ <phonemes> ]] markup.
Keep the text displayed to users unchanged. Add only externally verified
phoneme corrections and review them individually.
"""
from __future__ import annotations

import json
import re
from pathlib import Path

LEXICON_PATH = Path(__file__).with_name("pronunciation-overrides.json")


def load_pronunciation_overrides(path: Path = LEXICON_PATH) -> dict[str, str]:
    entries = json.loads(path.read_text(encoding="utf-8"))["entries"]
    result: dict[str, str] = {}
    for entry in entries:
        term = entry["term"].strip().lower()
        phonemes = entry["espeak_phonemes"].strip()
        if not re.fullmatch(r"[a-z][a-z -]*", term):
            raise ValueError(f"Invalid pronunciation term {term!r}")
        if not phonemes or any(ch in phonemes for ch in "[]<>\n\r"):
            raise ValueError(f"Invalid phoneme override for {term!r}")
        if term in result:
            raise ValueError(f"Duplicate pronunciation override {term!r}")
        result[term] = phonemes
    return result


def apply_pronunciation_overrides(text: str, overrides: dict[str, str]) -> str:
    for term, phonemes in sorted(overrides.items(), key=lambda item: len(item[0]), reverse=True):
        # Alphabetic boundaries ensure terms within longer words are not altered.
        pattern = r"(?<![A-Za-z])" + re.escape(term) + r"(?![A-Za-z])"
        text = re.sub(pattern, lambda _: "[[ " + phonemes + " ]]", text, flags=re.IGNORECASE)
    return text
