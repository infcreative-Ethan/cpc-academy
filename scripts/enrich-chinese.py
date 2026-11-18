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
DICTIONARY_PATH = Path("public/english-dictionary.json")
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
    normalized = (value or "").replace(r"\r\n", "\n").replace(r"\n", "\n").replace(r"\r", "\n")
    for raw in normalized.splitlines():
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
    # The preceding build step creates a broad, filtered offline ECDICT file.
    # Reuse it here instead of downloading the full CSV a second time.
    if DICTIONARY_PATH.exists():
        try:
            saved = json.loads(DICTIONARY_PATH.read_text(encoding="utf-8"))
            result = {
                normalize(source): (clean_translation(target), "english-chinese-dictionary")
                for source, target in saved.items()
                if source and target and has_chinese(target) and normalize(source)
            }
            if result:
                print(f"Loaded prebuilt offline ECDICT dictionary: {len(result)} entries", flush=True)
                return result
        except Exception as error:
            print(f"WARNING: could not read prebuilt offline dictionary: {error}", flush=True)

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
    ecdict: dict[str, tuple[str, str]] = {}
    for label, url in (("curated", SOURCES["curated"]), ("medical_cc0", SOURCES["medical_cc0"]), ("aix_medical", SOURCES["aix_medical"])):
        try:
            dictionaries.append(load_tsv(url, label) if label != "aix_medical" else load_aix(url))
            print(f"Loaded {label}: {len(dictionaries[-1])} entries", flush=True)
        except Exception as error:
            print(f"WARNING: could not load {label}: {error}", flush=True)

    try:
        ecdict = load_ecdict(SOURCES["ecdict"])
        dictionaries.append(ecdict)
        print(f"Loaded ECDICT: {len(ecdict)} entries", flush=True)
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

    parts = data.get("parts", [])
    for part in parts:
        if has_chinese(part.get("meaningZh", "")):
            continue
        match = ecdict.get(normalize(part.get("meaning", ""))) or ecdict.get(normalize(part.get("part", "")))
        if match:
            part["meaningZh"] = match[0]

    CACHE_PATH.parent.mkdir(parents=True, exist_ok=True)
    try:
        cache = json.loads(CACHE_PATH.read_text(encoding="utf-8"))
    except Exception:
        cache = {}

    tasks: list[tuple[str, int, str, str]] = []
    if not args.skip_google:
        for index, item in enumerate(terms):
            term = item.get("term", "").strip()
            definition = item.get("definition", "").strip()
            if term and not (item.get("meaning") and has_chinese(item["meaning"])):
                cache_key = "term:" + term
                if cache_key not in cache:
                    tasks.append((cache_key, index, term, "term"))
            if definition and not (item.get("definitionZh") and has_chinese(item["definitionZh"])):
                cache_key = "definition:" + term
                if cache_key not in cache:
                    tasks.append((cache_key, index, definition, "definition"))

        for index, part in enumerate(parts):
            meaning = part.get("meaning", "").strip()
            if meaning and not has_chinese(part.get("meaningZh", "")):
                cache_key = "part:" + part.get("part", "")
                if cache_key not in cache:
                    tasks.append((cache_key, index, meaning, "part"))

        print(f"Machine-translation fallback: {len(tasks)} requests", flush=True)
        completed = 0
        failures = 0
        with concurrent.futures.ThreadPoolExecutor(max_workers=8) as executor:
            future_map = {executor.submit(google_translate, text): (key, index, kind) for key, index, text, kind in tasks}
            for future in concurrent.futures.as_completed(future_map):
                key, index, kind = future_map[future]
                try:
                    translated = future.result()
                    if has_chinese(translated):
                        cache[key] = translated
                        if kind == "term" and not terms[index].get("meaning"):
                            terms[index]["meaning"] = translated
                            terms[index]["meaningSource"] = "machine-translation"
                        elif kind == "definition":
                            terms[index]["definitionZh"] = translated
                        elif kind == "part":
                            parts[index]["meaningZh"] = translated
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

    for part in parts:
        if not has_chinese(part.get("meaningZh", "")) and cache.get("part:" + part.get("part", "")):
            part["meaningZh"] = cache["part:" + part.get("part", "")]
    missing_parts = [part.get("part", "") for part in parts if not has_chinese(part.get("meaningZh", ""))]

    # Build a compact offline English-Chinese lookup for every English word
    # appearing in the built-in medical terms, definitions, and word-part descriptions.
    token_pattern = re.compile(r"[A-Za-z]+(?:[-'][A-Za-z]+)*")
    dictionary_texts = []
    for item in terms:
        dictionary_texts.extend([item.get("term", ""), item.get("definition", "")])
    for part in parts:
        dictionary_texts.extend([part.get("part", ""), part.get("meaning", "")])
    tokens = sorted({normalize(token) for value in dictionary_texts for token in token_pattern.findall(value) if normalize(token)})
    # Preserve the broad offline dictionary built earlier in the workflow.
    # The book-token pass below adds/overrides terminology-specific translations;
    # it must not shrink the app's general English lookup back to book-only words.
    word_dictionary: dict[str, str] = {}
    if DICTIONARY_PATH.exists():
        try:
            saved_dictionary = json.loads(DICTIONARY_PATH.read_text(encoding="utf-8"))
            for source, target in saved_dictionary.items():
                key = normalize(source)
                if key and has_chinese(target):
                    word_dictionary.setdefault(key, target)
        except Exception as error:
            print(f"WARNING: could not preserve existing offline dictionary: {error}", flush=True)
    missing_tokens: list[str] = []
    for token in tokens:
        match = ecdict.get(token)
        cached = cache.get("word:" + token, "")
        translation = match[0] if match else cached
        if has_chinese(translation):
            word_dictionary[token] = translation
        else:
            missing_tokens.append(token)

    if not args.skip_google and missing_tokens:
        print(f"Translating {len(missing_tokens)} remaining dictionary words…", flush=True)
        failures = 0
        completed = 0
        with concurrent.futures.ThreadPoolExecutor(max_workers=8) as executor:
            future_map = {executor.submit(google_translate, token): token for token in missing_tokens}
            for future in concurrent.futures.as_completed(future_map):
                token = future_map[future]
                try:
                    translated = future.result()
                    if has_chinese(translated):
                        cache["word:" + token] = translated
                        word_dictionary[token] = translated
                except Exception as error:
                    failures += 1
                    if failures <= 10:
                        print(f"WARNING: dictionary word {token} not translated: {error}", flush=True)
                completed += 1
                if completed % 100 == 0 or completed == len(missing_tokens):
                    CACHE_PATH.write_text(json.dumps(cache, ensure_ascii=False), encoding="utf-8")
                    print(f"Dictionary translated {completed}/{len(missing_tokens)}; failures={failures}", flush=True)
                if failures >= 16:
                    print("Stopping dictionary translation after repeated service errors; ECDICT entries remain available.", flush=True)
                    for pending in future_map:
                        if not pending.done():
                            pending.cancel()
                    break

    DICTIONARY_PATH.parent.mkdir(parents=True, exist_ok=True)
    DICTIONARY_PATH.write_text(json.dumps(word_dictionary, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")

    missing_meanings = [item["term"] for item in terms if not has_chinese(item.get("meaning", ""))]
    missing_definitions = [item["term"] for item in terms if not has_chinese(item.get("definitionZh", ""))]
    data["terms"] = terms
    data["parts"] = parts
    VOCAB_PATH.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "terms": len(terms),
        "with_chinese_meaning": len(terms) - len(missing_meanings),
        "missing_meaning": len(missing_meanings),
        "with_chinese_definition": len(terms) - len(missing_definitions),
        "missing_definition": len(missing_definitions),
        "parts": len(parts),
        "parts_with_chinese": len(parts) - len(missing_parts),
        "missing_parts": missing_parts[:30],
        "offline_dictionary_words": len(word_dictionary),
        "missing_meaning_examples": missing_meanings[:30],
    }, ensure_ascii=False, indent=2), flush=True)


if __name__ == "__main__":
    main()
