/**
 * Practice bank of 228 DISTINCT lesson-linked fictional case prompts:
 * 116 medical mini-cases + 100 professional coding mini-cases + 12 extended records.
 *
 * These are original training exercises. "Mini-case" means a short vignette,
 * not a full clinical chart or a licensed CPT code-selection simulation.
 */
import {medicalLessons} from "./cpc-medical-lessons";
import {codingLessonDetails} from "./cpc-coding-lesson-content";
import {extendedCases} from "./cpc-extended-cases";

export type PracticeQuestion = {
 id:string;caseId:string;domain:string;question:string;
 options:[string,string,string,string];answer:number;explanation:string;record:string;
};
export type PracticeCase = {
 id:string;title:string;system:string;source:"medical"|"coding"|"extended";
 record:string;domain:string;questions:PracticeQuestion[];
};

const surgeryDomains=[
 "CPT 10000 Series","CPT 20000 Series","CPT 30000 Series",
 "CPT 40000 Series","CPT 50000 Series","CPT 60000 Series"
] as const;

function medicalDomain(ch:number):string {
 if(ch===1||ch===3||ch===4)return "Medical Terminology";
 if(ch===2||ch===17)return "Anatomy";
 if(ch===5||ch===6)return "CPT 40000 Series";
 if(ch===7||ch===8||ch===9||ch===18)return "CPT 50000 Series";
 if(ch===10)return "CPT 60000 Series";
 if(ch===11||ch===12||ch===14)return "CPT 30000 Series";
 if(ch===13)return "Pathology and Laboratory";
 if(ch===15)return "CPT 20000 Series";
 if(ch===16)return "CPT 10000 Series";
 if(ch===19)return "ICD-10-CM";
 if(ch===20)return "Radiology";
 if(ch===21)return "Medicine";
 return "Evaluation and Management";
}

function codingDomain(unit:string,idx:number):string {
 if(unit==="cpt-specialties")return surgeryDomains[idx]??"CPT 60000 Series";
 if(unit==="cpt-surgery")return surgeryDomains[idx]??"CPT 20000 Series";
 if(unit==="cpt-radiology-lab")return idx<2?"Radiology":"Pathology and Laboratory";
 if(unit==="cpt-medicine")return "Medicine";
 if(unit==="cpt-em")return "Evaluation and Management";
 if(unit==="cpt-anesthesia")return "Anesthesia";
 if(unit.startsWith("hcpcs-"))return "HCPCS Level II";
 if(unit.startsWith("compliance-"))return idx%3===0?"Compliance and Regulatory":"Coding Guidelines";
 if(unit==="cpt-modifiers")return "Coding Guidelines";
 if(unit==="cpt-foundations")return "Coding Guidelines";
 if(unit==="icd-chapters"||unit==="icd-documentation")return "ICD-10-CM";
 if(unit.startsWith("icd-"))return "Coding Guidelines";
 return "Coding Guidelines";
}

export const practiceCases:PracticeCase[]=[
 ...medicalLessons.map(lesson=>{
  const id="case-"+lesson.id;
  const domain=medicalDomain(lesson.chapter);
  const record=lesson.clinical.note;
  return {
   id,title:"Chapter "+lesson.chapter+" · "+lesson.zh,system:"Chapter "+lesson.chapter,
   source:"medical" as const,record,domain,
   questions:lesson.questions.map((q,index)=>({
    id:id+"-q"+index,caseId:id,domain,record,
    question:q.question,options:q.options,answer:q.answer,explanation:q.explanation
   }))
  };
 }),
 ...codingLessonDetails.map(lesson=>{
  const id="case-coding-"+lesson.id.replace(":","-");
  const domain=codingDomain(lesson.unitId,lesson.lessonIndex);
  const record=lesson.practice.record;
  return{
   id,title:"Coding · "+lesson.zh,system:lesson.unitId,source:"coding" as const,
   record,domain,
   questions:lesson.questions.map((q,index)=>({
    id:id+"-q"+index,caseId:id,domain,record,
    question:q.question,options:q.options,answer:q.answer,explanation:q.explanation
   }))
  };
 }),
 ...extendedCases.map(lesson=>{
  const domain="Medical Record Cases",record=lesson.record;
  return{
   id:lesson.id,title:lesson.title,system:lesson.system,source:"extended" as const,
   record,domain,
   questions:lesson.questions.map((q,index)=>({
    id:lesson.id+"-q"+index,caseId:lesson.id,domain,record,
    question:q.question,options:q.options,answer:q.answer,explanation:q.explanation
   }))
  };
 })
];

export const caseQuestions=practiceCases.flatMap(c=>c.questions);

export const caseBankSummary={
 medical:medicalLessons.length,
 professional:codingLessonDetails.length,
 extended:extendedCases.length,
 total:practiceCases.length,
 questionTotal:caseQuestions.length,
};
