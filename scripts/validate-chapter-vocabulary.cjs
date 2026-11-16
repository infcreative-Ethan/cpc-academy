#!/usr/bin/env node
"use strict";
/** Check chapter PDF metadata, lexical order and daily progression. */
const assert=require("node:assert/strict");
const fs=require("node:fs");
const ts=require("typescript");
require.extensions[".ts"]=function(mod,filename){
  const content=fs.readFileSync(filename,"utf8");
  const js=ts.transpileModule(content,{
    fileName:filename,compilerOptions:{
      module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,
      esModuleInterop:true,resolveJsonModule:true
    }
  }).outputText;
  mod._compile(js,filename);
};
const {words}=require("../lib/book-words.ts");
const {
  chapterWordLists,indexedChapterWordCount,unassignedSourceWords,
  getChapterWords,getWordChapters,getChapterVocabularyStats,
  getCurrentNewWordChapter,getOrderedWordBatch,getChapterReviewWordIds,
}=require("../lib/chapter-vocabulary.ts");
const {SOURCE_CHAPTER_COUNTS,SOURCE_TERM_COUNT}=require("../lib/chapter-vocabulary-index.ts");
assert.ok(words.length>=SOURCE_TERM_COUNT);
assert.equal(chapterWordLists.length,22);
const indexSet=new Set();
for(let chapter=1;chapter<=22;chapter++){
  const list=getChapterWords(chapter);
  assert.equal(list.length,SOURCE_CHAPTER_COUNTS[chapter-1],"Chapter "+chapter+" count");
  const ids=list.map(w=>w.id);
  assert.equal(new Set(ids).size,ids.length,"duplicate term in chapter "+chapter);
  assert.ok(ids.length>100,"missing chapter vocabulary "+chapter);
  for(const id of ids){
    assert.ok(getWordChapters(id).includes(chapter),"reverse membership "+id);
    indexSet.add(id);
  }
}
assert.equal(indexedChapterWordCount,indexSet.size);
assert.equal(indexedChapterWordCount,2295,"book entries matched in chapters");
assert.equal(unassignedSourceWords.filter(w=>words.indexOf(w)<SOURCE_TERM_COUNT).length,11,"unmatched source entries");
const empty={knownIds:[],introducedIds:[],reviewIds:[]};
assert.equal(getCurrentNewWordChapter(empty),1);
const first=getOrderedWordBatch(empty,20);
assert.equal(first.words.length,20);
assert.deepEqual(first.words.map(w=>w.id),getChapterWords(1).slice(0,20).map(w=>w.id));
const seen=first.words.map(w=>w.id);
const second=getOrderedWordBatch({...empty,introducedIds:seen},20);
assert.equal(second.words.length,20);
assert.ok(second.words.every(w=>!seen.includes(w.id)));
assert.equal(new Set([...seen,...second.words.map(w=>w.id)]).size,40);
const skipKnown=getOrderedWordBatch({...empty,knownIds:[first.words[0].id]},20);
assert.ok(!skipKnown.words.some(w=>w.id===first.words[0].id),"already mastered word repeated");
// Once the 1st chapter has been visited, new learning continues into chapter 2.
const ch1=getChapterWords(1).map(w=>w.id);
assert.equal(getCurrentNewWordChapter({...empty,introducedIds:ch1}),2);
const crossing=getOrderedWordBatch({...empty,introducedIds:ch1.slice(0,-2)},20);
assert.ok(crossing.chapters.includes(1)&&crossing.chapters.includes(2),"cross-chapter transition failed");
const onlyCh2=getOrderedWordBatch(empty,20,2);
assert.equal(onlyCh2.words[0].id,getChapterWords(2)[0].id);
assert.deepEqual(onlyCh2.chapters,[2]);
const fullCh2=getChapterReviewWordIds(2,empty,true);
assert.equal(fullCh2.length,getChapterWords(2).length);
assert.equal(getChapterReviewWordIds(2,empty).length,0);
assert.equal(getChapterReviewWordIds(2,{...empty,introducedIds:[getChapterWords(2)[0].id]}).length,1);
const stats=getChapterVocabularyStats(1,{...empty,introducedIds:ch1.slice(0,15),knownIds:ch1.slice(0,5)});
assert.equal(stats.learned,15);
assert.equal(stats.mastered,5);
// Iterated batches never repeat introduced IDs, and all chapter vocabulary
// eventually completes; unmatched terms follow the 22-chapter sequence.
const total=[];
let loops=0;
while(loops++<250){
  const batch=getOrderedWordBatch({...empty,introducedIds:total},30);
  if(batch.words.length===0)break;
  const next=batch.words.map(w=>w.id);
  assert.equal(new Set([...total,...next]).size,total.length+next.length);
  total.push(...next);
}
assert.ok(loops<250,"infinite progression");
assert.equal(getCurrentNewWordChapter({...empty,introducedIds:total}),null);
assert.equal(new Set(total).size,total.length);
assert.ok(total.length>=indexedChapterWordCount,"some chapter terms never offered");
console.log(JSON.stringify({sourceTerms:SOURCE_TERM_COUNT,chapters:22,indexed:indexedChapterWordCount,notInChapter:11,firstChapter:getChapterWords(1).length,finalChapter:getChapterWords(22).length,uniqueWordsInAutomaticSequence:total.length,dailyBatches:loops-1,source:"original PDF chapter body exact matching"},null,2));
