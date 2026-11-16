#!/usr/bin/env python3
"""Pronunciation regression test, no Piper model download required."""
import json
from pathlib import Path
from pronunciation_lexicon import load_pronunciation_overrides, apply_pronunciation_overrides

rules = load_pronunciation_overrides()
assert "thoracic" in rules
ph = rules["thoracic"]
assert ph == "θəɹˈæsɪk"
for term in ["thoracic", "Thoracic", "Thoracic cavity", "thoracic duct", "thoracic vertebrae"]:
    out = apply_pronunciation_overrides(term, rules)
    assert "[[ " + ph + " ]]" in out, (term, out)
assert apply_pronunciation_overrides("thoracoscopy", rules) == "thoracoscopy"
assert apply_pronunciation_overrides("nonthoracic", rules) == "nonthoracic"
assert apply_pronunciation_overrides("thoracics", rules) == "thoracics"
book = json.loads(Path("lib/book-vocabulary.json").read_text(encoding="utf-8"))
matched = [term["term"] for term in book["terms"] if "thoracic" in term["term"].lower()]
assert any(term.lower()=="thoracic" for term in matched)
assert len(matched)>=2
print(f"PASS pronunciation corrections: {sorted(rules)}; affected glossary entries={matched}")
