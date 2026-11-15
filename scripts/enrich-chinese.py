#!/usr/bin/env python3
"""Enrich CPC Academy's medical vocabulary with Chinese reference meanings.

Dictionary matches are preferred over machine translation. Machine-translated
fallbacks are marked so the app can distinguish them from existing glossary
translations. This script runs before the Next.js static build.
"""
from __future__ import annotations

import argparse
import concurrent.futures
import csv
import io
import json
import re
import time
import unicodedata
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

VOCAB_PATH = Path("lib/book-vocabulary.json")
CACHE_PATH = Path(".cache/chinese-translations.json")
SOURCES = {
    "curated": "https://raw.githubusercontent.com/yimmy23/medical-en-zh-glossary/main/references/glossary.tsv",
    "medical_cc0": "https://raw.githubusercontent.com/yimmy23/medical-en-zh-glossary/main/references/external-medical-translator.tsv",
    "aix_medical": "https://huggingface.co/datasets/AIX-Text/TerminologyDataset/resolve/main/Medical.csv",
    "ecdict": "https://raw.githubusercontent.com/skywind3000/ECDICT/master/ecdict.csv",
}


def fetch_text(url: str, timeout: int = 90) -> str:
    request = urllib.request.Request(url, headers={"User-Agent": "CPC-Academy/0.2.3 vocabulary-enrichment"})
    with urllib.request.urlopen(request, timeout=timeout) as response:
        return response.read().decode("utf-8-sig", errors="replace")


def normalize(value: str) -> str:
    value = unicodedata.normalize("NFKC", value).lower()
    value = value.replace("’", "'").replace("‘", "'").replace("–", "-").replace("—", "-")
    value = re.sub(r"[^\w]+", " ", value, flags=re.UNICODE)
    return " ".join(value.split())


def has_chinese(value: str) -> bool:
    return bool(re.search(r"[\u3400-\u9fff]", value or ""))


def clean_translation(value: str) -> str:
    candidates = []
    for raw in (value or "").splitlines():
        line = raw.strip()
        if not line:
            continue
        line = re.sub(r"^\s*(?:\[[^]]+\]\s*)+", "", line)
        line = re.sub(r"^(?:(?:n|v|vt|vi|adj|adv|a|s|prep|pron|conj|int)\.\s*)+", "", line, flags=re.I)
        line = re.sub(r"\s*\[[^]]+\]\s*", " ", line)
        line = re.sub(r"\s+", " ", line).strip(" ;；,，")
        if has_chinese(line):
            candidates.append(line)
    return "；".join(candidates[:2])[:120]


def load_tsv(url: str, source_name: str) -> dict[str, tuple[str, str]]:
    text = fetch_text(url)
    reader = csv.DictReader(io.StringIO(text), delimiter="\t")
    result: dict[str, tuple[str, str]] = {}
    for row in reader:
        source = (row.get("source") or "").strip()
        target = (row.get("target") or "").strip()
        if source and target and has_chinese(target):
            result.setdefault(normalize(source), (target, source_name))
    return result


def load_aix(url: str) -> dict[str, tuple[str, str]]:
    text = fetch_text(url)
    reader = csv.DictReader(io.StringIO(text))
    result: dict[str, tuple[str, str]] = {}
    for row in reader:
        source = (row.get("原文") or "").strip()
        target = (row.get("译文") or "").strip()
        if source and target and has_chinese(target):
            result.setdefault(normalize(source), (target, "medical-dataset"))
    return result


def load_ecdict(url: str) -> dict[str, tuple[str, str]]:
    print("Downloading ECDICT English-Chinese dictionary…", flush=True)
    text = fetch_text(url, timeout=180)
    result: dict[str, tuple[str, str]] = {}
    reader = csv.DictReader(io.StringIO(text))
    for row in reader:
        source = (row.get("word") or "").strip()
        target = clean_translation(row.get("translation") or "")
        if source and target:
            result.setdefault(normalize(source), (target, "english-chinese-dictionary"))
    return result


def google_translate(text: str) -> str:
    query = urllib.parse.urlencode({
        "client": "gtx",
        "sl": "en",
        "tl": "zh-CN",
        "dt": "t",
        "q": text,
    })
    url = "https://translate.googleapis.com/translate_a/single?" + query
    last_error: Exception | None = None
    for attempt in range(2):
        try:
            request = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 CPC-Academy"})
            with urllib.request.urlopen(request, timeout=12) as response:
                payload = json.loads(response.read().decode("utf-8"))
            return "".join(part[0] for part in (payload[0] or []) if part and part[0]).strip()
        except Exception as error:
            last_error = error
            time.sleep(0.5)
    raise RuntimeError(f"Google translation failed: {last_error}")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--skip-google", action="store_true", help="Use dictionary matches only")
    args = parser.parse_args()

    data = json.loads(VOCAB_PATH.read_text(encoding="utf-8"))
    terms = data.get("terms", [])
    print(f"Enriching {len(terms)} medical terms…", flush=True)

    dictionaries: list[dict[str, tuple[str, str]]] = []
    for label, url in (("curated", SOURCES["curated"]), ("medical_cc0", SOURCES["medical_cc0"]), ("aix_medical", SOURCES["aix_medical"])):
        try:
            dictionaries.append(load_tsv(url, label) if label != "aix_medical" else load_aix(url))
            print(f"Loaded {label}: {len(dictionaries[-1])} entries", flush=True)
        except Exception as error:
            print(f"WARNING: could not load {label}: {error}", flush=True)

    try:
        dictionaries.append(load_ecdict(SOURCES["ecdict"]))
        print(f"Loaded ECDICT: {len(dictionaries[-1])} entries", flush=True)
    except Exception as error:
        print(f"WARNING: could not load ECDICT: {error}", flush=True)

    for item in terms:
        key = normalize(item.get("term", ""))
        if item.get("meaning") and has_chinese(item["meaning"]):
            item.setdefault("meaningSource", "existing")
            continue
        for dictionary in dictionaries:
            match = dictionary.get(key)
            if match:
                item["meaning"], item["meaningSource"] = match
                break

    CACHE_PATH.parent.mkdir(parents=True, exist_ok=True)
    try:
        cache = json.loads(CACHE_PATH.read_text(encoding="utf-8"))
    except Exception:
        cache = {}

    tasks: list[tuple[str, int, str]] = []
    if not args.skip_google:
        for index, item in enumerate(terms):
            term = item.get("term", "").strip()
            definition = item.get("definition", "").strip()
            if term and not (item.get("meaning") and has_chinese(item["meaning"])):
                cache_key = "term:" + term
                if cache_key not in cache:
                    tasks.append((cache_key, index, term))
            if definition and not (item.get("definitionZh") and has_chinese(item["definitionZh"])):
                cache_key = "definition:" + term
                if cache_key not in cache:
                    tasks.append((cache_key, index, definition))

        print(f"Machine-translation fallback: {len(tasks)} requests", flush=True)
        completed = 0
        failures = 0
        with concurrent.futures.ThreadPoolExecutor(max_workers=8) as executor:
            future_map = {executor.submit(google_translate, text): (key, index) for key, index, text in tasks}
            for future in concurrent.futures.as_completed(future_map):
                key, index = future_map[future]
                try:
                    translated = future.result()
                    if has_chinese(translated):
                        cache[key] = translated
                        if key.startswith("term:") and not terms[index].get("meaning"):
                            terms[index]["meaning"] = translated
                            terms[index]["meaningSource"] = "machine-translation"
                        elif key.startswith("definition:"):
                            terms[index]["definitionZh"] = translated
                except Exception as error:
                    failures += 1
                    if failures <= 10:
                        print(f"WARNING: {key} not translated: {error}", flush=True)
                completed += 1
                if completed % 100 == 0 or completed == len(tasks):
                    CACHE_PATH.write_text(json.dumps(cache, ensure_ascii=False), encoding="utf-8")
                    print(f"Translated {completed}/{len(tasks)}; failures={failures}", flush=True)
                if failures >= 16:
                    print("Stopping machine-translation fallback after repeated service errors; dictionary matches will still be retained.", flush=True)
                    for pending in future_map:
                        if not pending.done():
                            pending.cancel()
                    break

    # Reapply cached translations to items whose exact dictionary match is absent.
    for item in terms:
        term = item.get("term", "")
        if not item.get("meaning") and cache.get("term:" + term) and has_chinese(cache["term:" + term]):
            item["meaning"] = cache["term:" + term]
            item["meaningSource"] = "machine-translation"
        if not item.get("definitionZh") and cache.get("definition:" + term) and has_chinese(cache["definition:" + term]):
            item["definitionZh"] = cache["definition:" + term]

    missing_meanings = [item["term"] for item in terms if not has_chinese(item.get("meaning", ""))]
    missing_definitions = [item["term"] for item in terms if not has_chinese(item.get("definitionZh", ""))]
    data["terms"] = terms
    VOCAB_PATH.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "terms": len(terms),
        "with_chinese_meaning": len(terms) - len(missing_meanings),
        "missing_meaning": len(missing_meanings),
        "with_chinese_definition": len(terms) - len(missing_definitions),
        "missing_definition": len(missing_definitions),
        "missing_meaning_examples": missing_meanings[:30],
    }, ensure_ascii=False, indent=2), flush=True)


if __name__ == "__main__":
    main()
