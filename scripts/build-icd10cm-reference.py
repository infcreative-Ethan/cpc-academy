#!/usr/bin/env python3
"""Generate optional offline ICD-10-CM FY2027 description catalog.

Official CDC/CMS order files are public government classification data.
This list is for *lookup and orientation only*, not code assignment:
it does not contain the full Alphabetic Index or Tabular notes.
"""
from __future__ import annotations

import hashlib
import io
import json
import re
import sys
import time
import urllib.request
import zipfile
from pathlib import Path

SOURCES = [
    "https://ftp.cdc.gov/pub/health_statistics/nchs/Publications/ICD10CM/2027/icd10cm-code-descriptions-2027.zip",
    "https://www.cms.gov/files/zip/2027-code-descriptions-tabular-order.zip",
]

OUTPUT = Path("public/icd10cm-fy2027.json")
SOURCE_LABEL = "CDC/NCHS and CMS ICD-10-CM FY2027 official order file"
EXPECTED_DATE_START = "2026-10-01"
EXPECTED_DATE_END = "2027-09-30"


def parse_order_file(data: bytes):
    results = []
    rejected = []
    total_candidates = 0
    for raw in data.decode("latin-1").splitlines():
        if len(raw) < 78:
            continue
        order = raw[0:5].strip()
        code = raw[6:13].strip().upper()
        billable = raw[14:15]
        long_description = raw[77:].strip()
        if not re.fullmatch(r"[0-9]{1,5}", order):
            continue
        total_candidates += 1
        if not re.fullmatch(r"[A-Z][0-9][A-Z0-9][A-Z0-9]{0,4}", code):
            rejected.append(("code", repr(raw[:80])))
            continue
        if billable not in ("0", "1") or not long_description:
            rejected.append(("flag_or_description", repr(raw[:90])))
            continue
        shown_code = code if len(code) == 3 else code[:3] + "." + code[3:]
        results.append([shown_code, long_description, 1 if billable == "1" else 0])
    print(f"ICD order file parsing: candidates={total_candidates}, accepted={len(results)}, rejected={len(rejected)}, samples={rejected[:15]}", flush=True)
    return results


def download_order_file():
    errors = []
    for url in SOURCES:
        for attempt in range(2):
            try:
                req = urllib.request.Request(
                    url, headers={"User-Agent": "CPC-Academy-Offline-Reference/1.0"}
                )
                with urllib.request.urlopen(req, timeout=60) as response:
                    content = response.read()
                with zipfile.ZipFile(io.BytesIO(content)) as archive:
                    names = [
                        x for x in archive.namelist()
                        if re.search(r"order.*2027.*\.txt$", x, re.IGNORECASE)
                        and "addenda" not in x.lower()
                        and not x.startswith("__MACOSX")
                    ]
                    if not names:
                        names = [
                            x for x in archive.namelist()
                            if "order" in x.lower()
                            and x.lower().endswith(".txt")
                            and "addenda" not in x.lower()
                        ]
                    if not names:
                        raise ValueError("No ICD-10-CM tabular order text file in archive: " + ", ".join(archive.namelist()[:20]))
                    file_name = sorted(names, key=len)[0]
                    raw = archive.read(file_name)
                codes = parse_order_file(raw)
                if len(codes) < 90000 or sum(row[2] for row in codes) < 60000:
                    raise ValueError("Order file parse produced suspiciously few records: " + str(len(codes)))
                return codes, url, file_name, hashlib.sha256(raw).hexdigest()
            except Exception as exc:
                errors.append(f"{url}: {exc}")
                if attempt == 0:
                    time.sleep(1)
    return None, None, None, "\n".join(errors)


def main():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    codes, source, file_name, hash_or_error = download_order_file()
    if codes is None:
        print("WARNING: official ICD-10-CM reference unavailable; catalog will be visibly disabled.", file=sys.stderr)
        print(hash_or_error[:1600], file=sys.stderr)
        result = {
            "metadata": {
                "available": False,
                "fiscalYear": 2027,
                "effectiveFrom": EXPECTED_DATE_START,
                "effectiveUntil": EXPECTED_DATE_END,
                "source": SOURCE_LABEL,
                "sourceUrl": SOURCES[0],
                "count": 0,
                "billableCount": 0,
                "notice": "Official source fetch unsuccessful; no ICD-10-CM catalog is provided. Use the CDC/CMS official files.",
            },
            "codes": [],
        }
    else:
        result = {
            "metadata": {
                "available": True,
                "fiscalYear": 2027,
                "effectiveFrom": EXPECTED_DATE_START,
                "effectiveUntil": EXPECTED_DATE_END,
                "source": SOURCE_LABEL,
                "sourceUrl": source,
                "sourceFile": file_name,
                "sha256": hash_or_error,
                "count": len(codes),
                "billableCount": sum(row[2] for row in codes),
                "notice": "Descriptions and billable flags only. Verify Index, Tabular notes, sequencing, documentation, and date of service before actual use.",
            },
            "codes": codes,
        }
    OUTPUT.write_text(json.dumps(result, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"ICD-10-CM FY2027 catalog: available={result['metadata']['available']} "
          f"codes={result['metadata']['count']} billable={result['metadata']['billableCount']} "
          f"output_bytes={OUTPUT.stat().st_size}")


if __name__ == "__main__":
    main()
