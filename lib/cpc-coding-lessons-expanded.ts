/**
 * Original course explanations covering the 88 remaining planned CPC coding lessons.
 * This module does not reproduce copyrighted CPT descriptors or AAPC exam questions.
 */
import {codingUnits} from "./cpc-professional-curriculum";
import {icdCodingLessonNotes, type CodingLessonSeed} from "./cpc-coding-notes-icd";
import {cptCodingLessonNotes} from "./cpc-coding-notes-cpt";
import {hcpcsComplianceNotes} from "./cpc-coding-notes-hcpcs-compliance";
import type {CodingLessonDetail} from "./cpc-coding-lesson-content";

const notes:Record<string,CodingLessonSeed[]> = {
 ...icdCodingLessonNotes, ...cptCodingLessonNotes, ...hcpcsComplianceNotes
};

const initialPilot = new Set([
 ...[0,1,2,3].map(i=>"icd-foundations:"+i),
 ...[0,1,2,3].map(i=>"icd-index:"+i),
 ...[0,1,2,3].map(i=>"cpt-foundations:"+i)
]);

const distractors = [
 "只使用历史病例作参考，忽略本次医疗文档和服务日期。",
 "推断尚未确定的严重疾病，以取得更高的报销。",
 "忽略代码说明、相关注释和医疗必要性，直接提交。"
];

export const expandedCodingLessons:CodingLessonDetail[] = codingUnits.flatMap((unit,unitPosition)=>
 unit.lessons.flatMap((zh,lessonIndex)=>{
  const id=unit.id+":"+lessonIndex;
  if(initialPilot.has(id))return [];
  const focus=notes[unit.id]?.[lessonIndex];
  if(!focus)throw new Error("Missing professional lesson notes: "+id);
  const right=(unitPosition+lessonIndex*3)%4;
  const distractorChoices=[...distractors];
  const choices:string[]=[];
  for(let i=0;i<4;i++)choices.push(i===right?focus.solution:(distractorChoices.shift()??"随意修改。"));
  const quizChoices=unit.quiz.options.slice(0,4);
  if(quizChoices.length!==4)throw new Error("Invalid unit quiz: "+unit.id);
  const lesson:CodingLessonDetail={
   id,unitId:unit.id,lessonIndex,zh,
   objectives:[
    "理解“"+zh+"”的核心编码概念和适用场景",
    unit.objectives[lessonIndex%unit.objectives.length],
    "在英文病历中区分已完成的服务、医嘱与有缺陷的诊断记录",
   ],
   sections:[
    {heading:"本课核心知识",body:focus.concept},
    {heading:"章节关键规则",body:unit.summary+" "+unit.keyPoints[lessonIndex%unit.keyPoints.length]+" 具体细节以当年度授权的官方文件和服务日期为准。"},
    {heading:"专业工作流程",body:"逐步核验："+unit.workflow.join(" → ")+"。"+unit.caution},
   ],
   practice:{
    record:focus.record,
    prompt:"阅读本次“"+zh+"”模拟病历，指出已记录的事实和不能自行推断的事项。",
    explanation:focus.solution
   },
   questions:[
    {question:"本课病例在处理“"+zh+"”时，哪种做法正确？",
     options:choices as [string,string,string,string],answer:right,explanation:focus.solution},
    {question:unit.quiz.question,
     options:quizChoices as [string,string,string,string],answer:unit.quiz.answer,explanation:unit.quiz.explanation}
   ]
  };
  return [lesson];
 })
);
