#!/usr/bin/env python3
"""Build a compact offline English-Chinese dictionary from the MIT-licensed ECDICT source."""

import csv
import io
import json
import re
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE_URL = "https://raw.githubusercontent.com/skywind3000/ECDICT/master/ecdict.csv"
OUTPUT = ROOT / "public" / "english-dictionary.json"
BOOK_DATA = ROOT / "lib" / "book-vocabulary.json"
MAX_FREQUENCY_RANK = 50000
WORD_RE = re.compile(r"^[A-Za-z][A-Za-z'-]{0,35}$")


def rank_is_useful(value: str) -> bool:
    try:
        rank = int(value)
        return 0 < rank <= MAX_FREQUENCY_RANK
    except (TypeError, ValueError):
        return False


def load_book_terms() -> set[str]:
    if not BOOK_DATA.exists():
        return set()
    data = json.loads(BOOK_DATA.read_text(encoding="utf-8"))
    return {
        item.get("term", "").strip().lower()
        for item in data.get("terms", [])
        if item.get("term")
    }


def main() -> None:
    book_terms = load_book_terms()
    dictionary: dict[str, str] = {}
    request = urllib.request.Request(
        SOURCE_URL,
        headers={"User-Agent": "CPC-Academy-offline-dictionary-builder/1.0"},
    )
    print("Downloading ECDICT source for offline dictionary build...")
    with urllib.request.urlopen(request, timeout=180) as response:
        stream = io.TextIOWrapper(response, encoding="utf-8", newline="")
        reader = csv.DictReader(stream)
        csv.field_size_limit(2**20)
        for row in reader:
            word = (row.get("word") or "").strip()
            translation = (row.get("translation") or "").strip()
            if not word or not translation or not WORD_RE.fullmatch(word):
                continue
            lower = word.lower()
            useful_rank = rank_is_useful(row.get("frq", "")) or rank_is_useful(row.get("bnc", ""))
            if not useful_rank and lower not in book_terms:
                continue
            # Keep dictionary entries compact for offline mobile use.
            clean_translation = re.sub(r"\n{3,}", "\n\n", translation)
            dictionary.setdefault(lower, clean_translation[:600])

    if not dictionary:
        raise RuntimeError("ECDICT returned no usable bilingual entries; refusing to build an empty dictionary.")

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(
        json.dumps(dictionary, ensure_ascii=False, separators=(",", ":")),
        encoding="utf-8",
    )
    print(f"Offline dictionary ready: {len(dictionary):,} single-word entries -> {OUTPUT}")


if __name__ == "__main__":
    main()
