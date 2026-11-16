/**
 * Chapter-based terminology study derived from the learner's 13th-edition PDF.
 *
 * The bundled index contains only Mini-Dictionary row numbers and chapter
 * occurrence order. The textbook prose, pages, and illustrations are NOT
 * bundled. A word appearing in a chapter is not necessarily an assigned
 * vocabulary word; the index is auditable and may be refined.
 */
import type {MedicalWord} from "./words";
import {words as bookWords} from "./book-words";
import {
  SOURCE_TERM_COUNT,SOURCE_TERM_CHECKSUM_FNV32,
  SOURCE_CHAPTER_COUNTS,CHAPTER_VOCABULARY_FIRST_OCCURRENCE_B64,
} from "./chapter-vocabulary-index";

function sourceChecksum():number {
  let hash=2166136261;
  for(const w of bookWords.slice(0,SOURCE_TERM_COUNT)) {
    const term=w.term.toLowerCase()+"|";
    for(let i=0;i<term.length;i++) hash=Math.imul(hash^term.charCodeAt(i),16777619)>>>0;
  }
  return hash;
}
function decodeChapterWordOrder():number[][] {
  if(bookWords.length<SOURCE_TERM_COUNT || sourceChecksum()!==SOURCE_TERM_CHECKSUM_FNV32)
    throw new Error("Chapter vocabulary index mismatches the source 13th-edition word order.");
  const raw=atob(CHAPTER_VOCABULARY_FIRST_OCCURRENCE_B64);
  const bytes=Uint8Array.from(raw,x=>x.charCodeAt(0));
  const result:number[][]=[];
  let pos=0;
  for(let chapter=1;chapter<=22;chapter++){
    if(pos+2>bytes.length)throw new Error("Truncated chapter vocabulary index.");
    const count=bytes[pos]|(bytes[pos+1]<<8);
    pos+=2;
    const items:number[]=[];
    const seen=new Set<number>();
    for(let i=0;i<count;i++){
      if(pos+2>bytes.length)throw new Error("Truncated vocabulary term index.");
      const index=bytes[pos]|(bytes[pos+1]<<8);
      pos+=2;
      if(index>=SOURCE_TERM_COUNT||seen.has(index))throw new Error("Invalid or duplicate source term index.");
      items.push(index);seen.add(index);
    }
    if(count!==SOURCE_CHAPTER_COUNTS[chapter-1])throw new Error("Chapter term count mismatch: "+chapter);
    result.push(items);
  }
  if(pos!==bytes.length)throw new Error("Unexpected trailing chapter index data.");
  return result;
}

const sourceOrder=decodeChapterWordOrder();

export const chapterWordLists:ReadonlyArray<readonly MedicalWord[]> =
  sourceOrder.map(indices=>indices.map(i=>bookWords[i]));

const wordToChapters=new Map<string,number[]>();
for(let ch=1;ch<=22;ch++){
  for(const word of chapterWordLists[ch-1]){
    const values=wordToChapters.get(word.id)??[];
    values.push(ch);
    wordToChapters.set(word.id,values);
  }
}
export const indexedChapterWordCount=wordToChapters.size;
export const unassignedSourceWords=bookWords.filter(w=>!wordToChapters.has(w.id));

export function getChapterWords(chapter:number):readonly MedicalWord[]{
  return chapterWordLists[chapter-1]??[];
}
export function getWordChapters(id:string):readonly number[]{
  return wordToChapters.get(id)??[];
}
export function getChapterVocabularyStats(chapter:number,progress:{
  knownIds:string[];introducedIds?:string[];reviewIds:string[]
}){
  const chapterWords=getChapterWords(chapter);
  const known=new Set(progress.knownIds);
  const learned=new Set([...(progress.introducedIds??[]),...progress.knownIds]);
  const due=new Set(progress.reviewIds);
  return{
    total:chapterWords.length,
    learned:chapterWords.filter(w=>learned.has(w.id)).length,
    mastered:chapterWords.filter(w=>known.has(w.id)).length,
    due:chapterWords.filter(w=>due.has(w.id)).length,
    pending:chapterWords.filter(w=>!learned.has(w.id)).length
  };
}
export function getCurrentNewWordChapter(progress:{
  knownIds:string[];introducedIds?:string[]
}):number|null{
  const excluded=new Set([...(progress.introducedIds??[]),...progress.knownIds]);
  for(let ch=1;ch<=22;ch++){
    if(getChapterWords(ch).some(w=>!excluded.has(w.id)))return ch;
  }
  return null;
}
export function getOrderedWordBatch(progress:{
 knownIds:string[];introducedIds?:string[]
},limit:20|30,chapter?:number,customWords:MedicalWord[]=[]){
  const seen=new Set([...(progress.introducedIds??[]),...progress.knownIds]);
  const chosen:MedicalWord[]=[];
  const chapters:number[]=[];
  const pick=(word:MedicalWord,ch:number)=>{
    if(chosen.length>=limit||seen.has(word.id))return;
    chosen.push(word);seen.add(word.id);
    if(!chapters.includes(ch))chapters.push(ch);
  };
  if(chapter!==undefined){
    if(!Number.isInteger(chapter)||chapter<1||chapter>22)return {words:chosen,chapters};
    for(const word of getChapterWords(chapter))pick(word,chapter);
  }else{
    for(let ch=1;ch<=22&&chosen.length<limit;ch++)
      for(const word of getChapterWords(ch))pick(word,ch);
    // Words not detected in any chapter, and learner-added words, follow
    // the complete 22-chapter sequence rather than being silently dropped.
    if(chosen.length<limit){
      for(const word of [...unassignedSourceWords,...customWords])pick(word,23);
    }
  }
  return{words:chosen,chapters};
}

export function getChapterReviewWordIds(chapter:number,progress:{
  knownIds:string[];introducedIds?:string[];reviewIds:string[]
},all=false):string[]{
  const done=new Set([...(progress.introducedIds??[]),...progress.knownIds,...progress.reviewIds]);
  return getChapterWords(chapter)
    .filter(w=>all||done.has(w.id))
    .map(w=>w.id);
}
