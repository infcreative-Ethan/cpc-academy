/**
 * Author-created training exam using AAPC's published domain counts.
 * Not official or licensed AAPC CPC exam content.
 */
import {caseQuestions, type PracticeQuestion} from "./cpc-case-bank";
import {cpcExamDomains} from "./cpc-professional-curriculum";

export type MockExamMode="full"|"practice";

export const officialExamStructure=cpcExamDomains.map(d=>({
 name:d.name,zh:d.zh,questionCount:d.questions
}));

export const officialExamQuestionCount=officialExamStructure.reduce((n,d)=>n+d.questionCount,0);

function randomGenerator(seed:number){
 let x=seed>>>0;
 return ()=>{x+=0x6D2B79F5;let t=x;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296;};
}
function shuffle<T>(input:readonly T[],rng:()=>number):T[]{
 const out=[...input];
 for(let i=out.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[out[i],out[j]]=[out[j],out[i]];}
 return out;
}

function signature(q:PracticeQuestion){
 return q.question.trim().toLowerCase()+"|"+q.options.join("|").toLowerCase();
}

/** Creates exactly 100 questions following the 18 blocks (17 domains + 10 record cases). */
export function buildOfficialStructurePractice(seed:number):PracticeQuestion[]{
 const rng=randomGenerator(seed);
 const selected:PracticeQuestion[]=[];
 const signatures=new Set<string>();
 for(const domain of officialExamStructure){
  // Shuffle by case first, then question index, to prevent consecutive
  // questions from always referring to the same vignette.
  const candidates=shuffle(caseQuestions.filter(x=>x.domain===domain.name),rng);
  let added=0;
  for(const item of candidates){
   if(added>=domain.questionCount)break;
   const key=signature(item);
   if(signatures.has(key))continue;
   signatures.add(key);selected.push(item);added++;
  }
  if(added!==domain.questionCount){
   throw new Error("Insufficient unique training questions in domain "+domain.name+": "+added+"/"+domain.questionCount);
  }
 }
 if(selected.length!==100||officialExamQuestionCount!==100)throw new Error("Practice exam configuration must total 100.");
 // Shuffle question order after collecting exact domain quotas.
 return shuffle(selected,rng);
}

/** 20-question training mode: different domains, no official timing equivalence. */
export function buildStudySet(seed:number):PracticeQuestion[]{
 return buildOfficialStructurePractice(seed).slice(0,20);
}
