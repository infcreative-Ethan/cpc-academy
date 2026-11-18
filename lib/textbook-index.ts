/** Metadata-only figure locations and chapter headings derived from the user's PDF. */
import figureData from "./textbook-figure-index.json";
import sectionData from "./textbook-section-index.json";
import type {MedicalLesson} from "./cpc-medical-lessons";
import type {PdfCrop} from "./textbook-pdf";

export type FigureRecord={id:string;ch:number;page:number;crop:PdfCrop;keywords:string[];confidence:"image-match"|"full-page"};
export type SectionRecord={id:string;ch:number;title:string;page:number;priority:"A"|"B"|"C"};
export const textbookSource=figureData.source;
export const textbookFigures:FigureRecord[]=figureData.figures.map(f=>({
 ...f,crop:{x:f.crop[0],y:f.crop[1],w:f.crop[2],h:f.crop[3]},confidence:f.confidence as FigureRecord["confidence"]
}));
export const textbookSections=sectionData as SectionRecord[];
export const figuresForChapter=(ch:number)=>textbookFigures.filter(f=>f.ch===ch);
export const sectionsForChapter=(ch:number)=>textbookSections.filter(s=>s.ch===ch);
const STOP=new Set(["with","from","there","anatomy","clinical","procedure","system","structure","introduction","physiology","pathology","major","tests","medical","additional","normal","types"]);
const tokenize=(input:string)=>Array.from(new Set((input.toLowerCase().match(/[a-z]{4,}/g)??[]).filter(x=>!STOP.has(x))));
function matchKeyword(keyword:string,word:string){
 if(keyword===word)return true;
 // Basic suffix variations, e.g. vessels/vessel, gastric/gastritis.
 if(keyword.length>=6&&word.length>=6)return keyword.slice(0,5)===word.slice(0,5);
 return false;
}
/** Lesson-level recommendations, never claims that every caption is a verified semantic match. */
export function suggestFigures(chapter:number,lesson?:MedicalLesson|null,limit=12):FigureRecord[]{
 const candidates=figuresForChapter(chapter);
 if(!lesson)return candidates.slice(0,limit);
 const subject=tokenize([lesson.title,lesson.textbookSection,lesson.objectives.join(" "),lesson.terminology.map(x=>x.term).join(" ")].join(" "));
 const termTokens=tokenize(lesson.terminology.map(x=>x.term).join(" "));
 return candidates.map((figure,i)=>{
  let score=0;
  for(const k of figure.keywords){
   if(subject.some(w=>matchKeyword(k,w)))score+=3;
   if(termTokens.some(w=>matchKeyword(k,w)))score+=5;
  }
  // Strictly stable default favors illustrations near the start of a lesson's chapter.
  score+=Math.max(0,3-i/8);
  return {figure,score};
 }).sort((a,b)=>b.score-a.score || a.figure.page-b.figure.page)
   .slice(0,limit).map(x=>x.figure);
}
export function sectionHasLesson(section:SectionRecord,lessons:readonly MedicalLesson[]):boolean{
 const key=tokenize(section.title);
 if(!key.length)return false;
 return lessons.some(l=>{
  if(l.chapter!==section.ch)return false;
  const words=tokenize(l.textbookSection+" "+l.title);
  return key.some(k=>words.some(w=>matchKeyword(w,k)));
 });
}
export function priorityLabel(value:"A"|"B"|"C"){
 return value==="A"?"核心必修":value==="B"?"进阶必学":"拓展参考";
}