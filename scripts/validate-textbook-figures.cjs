#!/usr/bin/env node
/** Metadata-only audit; private textbook PDF is not shipped in the repository. */
"use strict";
const fs=require("node:fs");
const assert=require("node:assert/strict");
const path=require("node:path");
const root=path.resolve(__dirname,"..");
const figure=JSON.parse(fs.readFileSync(path.join(root,"lib/textbook-figure-index.json"),"utf8"));
const sections=JSON.parse(fs.readFileSync(path.join(root,"lib/textbook-section-index.json"),"utf8"));
const java=fs.readFileSync(path.join(root,"native/TextbookPdfPlugin.java"),"utf8");
assert.equal(figure.schema,1);
assert.equal(figure.source.edition,13);
assert.equal(figure.source.pageCount,2137);
assert.match(figure.source.sha256,/^[a-f0-9]{64}$/);
assert.ok(java.includes(figure.source.sha256),"Android plugin must verify same PDF fingerprint as mapping");
assert.ok(java.includes("EXPECTED_PAGE_COUNT = 2137"));
assert.equal(figure.figures.length,434);
assert.equal(sections.length,115);
const ids=new Set();const counts={};let inferred=0;
for(const f of figure.figures){
 assert.ok(!ids.has(f.id),"Duplicate figure ID: "+f.id);ids.add(f.id);
 assert.ok(Number.isInteger(f.ch)&&f.ch>=1&&f.ch<=22);
 assert.ok(Number.isInteger(f.page)&&f.page>=1&&f.page<=2137);
 assert.equal(f.crop.length,4);const [x,y,w,h]=f.crop;
 assert.ok([x,y,w,h].every(v=>Number.isFinite(v)&&v>=0));
 assert.ok(w>=.05&&h>=.05&&x+w<=1.001&&y+h<=1.001,"Bad crop "+f.id);
 assert.ok(f.keywords.length>0&&f.keywords.length<=9);
 if(f.confidence==="image-match")inferred++;
 counts[f.ch]=(counts[f.ch]??0)+1;
}
for(let ch=1;ch<=22;ch++)assert.ok(counts[ch]>0,"Missing figure metadata for chapter "+ch);
assert.ok(inferred>=430,"Not enough localized figure crops");
const sectionIds=new Set();const priority={A:0,B:0,C:0};
for(const s of sections){
 assert.ok(!sectionIds.has(s.id));sectionIds.add(s.id);
 assert.ok(s.ch>=1&&s.ch<=22);
 assert.ok(s.page>=1&&s.page<=2137);
 assert.ok(typeof s.title==="string"&&s.title.trim().length>=3);
 assert.ok(["A","B","C"].includes(s.priority));priority[s.priority]++;
}
const nativeSource=fs.readFileSync(path.join(root,"native/TextbookPdfPlugin.java"),"utf8");
for(const marker of ["ACTION_OPEN_DOCUMENT","PdfRenderer","getStatus","importPdf","renderPage","removePdf","MODE_READ_ONLY","cpc-import-pdf","Bitmap.Config.ARGB_8888"])
 assert.ok(nativeSource.includes(marker),"Missing native functionality "+marker);
console.log(JSON.stringify({chapters:22,sections:sections.length,priorities:priority,figures:figure.figures.length,localizedCrop:inferred,verifiedPdfPages:figure.source.pageCount,sha256:figure.source.sha256,containsOriginalFigures:false},null,2));