#!/usr/bin/env python3
"""Regression check for escaped English-Chinese dictionary lines."""
import runpy

module=runpy.run_path("scripts/enrich-chinese.py")
clean=module["clean_translation"]
source=r"n. 生物学\n[化] 生物; 生物学"
actual=clean(source)
assert "\\n" not in actual, actual
assert actual.startswith("生物学；"), actual
assert "n." not in actual, actual
assert clean("皮肤\n炎症")=="皮肤；炎症"
print("Chinese translation newline regression checks passed")
