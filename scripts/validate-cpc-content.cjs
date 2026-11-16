#!/usr/bin/env node
/* CI data integrity and mock exam construction smoke test.
 * Requires the project's installed typescript dev dependency.
 */
"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const ts = require("typescript");

require.extensions[".ts"] = function(mod, filename) {
 const source = fs.readFileSync(filename,"utf8");
 const transpiled = ts.transpileModule(source,{
  compilerOptions:{
   module:ts.ModuleKind.CommonJS,
   target:ts.ScriptTarget.ES2022,
   esModuleInterop:true,
  },fileName:filename
 }).outputText;
 mod._compile(transpiled,filename);
};

const {medicalLessons}=require("../lib/cpc-medical-lessons.ts");
const {codingUnits,cpcExamDomains}=require("../lib/cpc-professional-curriculum.ts");
const {codingLessonDetails}=require("../lib/cpc-coding-lesson-content.ts");
const {practiceCases,caseQuestions,caseBankSummary}=require("../lib/cpc-case-bank.ts");
const {buildOfficialStructurePractice,buildStudySet,officialExamQuestionCount}=require("../lib/cpc-mock-exam.ts");
const byCode=Object.fromEntries(codingUnits.flatMap(unit=>unit.lessons.map((title,index)=>[unit.id+":"+index,title])));
assert.equal(medicalLessons.length,116,"medical lesson count");
assert.equal(codingLessonDetails.length,100,"coding lesson count");
assert.equal(Object.keys(byCode).length,100,"coding outline count");
assert.equal(practiceCases.length,228,"case count");
assert.equal(caseQuestions.length,456,"case-question count");
assert.equal(caseBankSummary.total,228);
assert.equal(officialExamQuestionCount,100);
assert.equal(new Set(medicalLessons.map(x=>x.id)).size,116);
assert.equal(new Set(codingLessonDetails.map(x=>x.id)).size,100);
assert.equal(new Set(practiceCases.map(x=>x.id)).size,228);
for(let i=1;i<=22;i++) assert.ok(medicalLessons.some(x=>x.chapter===i),"missing chapter "+i);
for(const l of medicalLessons){
 assert.equal(l.questions.length,2,"medical quiz length "+l.id);
 assert.equal(l.terminology.length,4,"medical terminology length "+l.id);
 assert.ok(l.clinical?.note&&l.teaching.length>=3,"medical teaching "+l.id);
}
for(const l of codingLessonDetails){
 assert.ok(byCode[l.id]!==undefined,"unexpected code unit lesson "+l.id);
 assert.equal(l.questions.length,2,"coding quiz length "+l.id);
 assert.ok(l.practice?.record&&l.sections.length>=3,"coding teaching "+l.id);
}
const sums=Object.fromEntries(cpcExamDomains.map(x=>[x.name,x.questions]));
for(const seed of [1,2,7,42,100,1000,2027,123456,20261116]){
 const exam=buildOfficialStructurePractice(seed);
 assert.equal(exam.length,100,"100 question count seed "+seed);
 const questionIds=exam.map(x=>x.id);
 assert.equal(new Set(questionIds).size,100,"duplicated question id seed "+seed);
 const signature=q=>q.question.trim().toLowerCase()+"|"+q.options.join("|").toLowerCase();
 assert.equal(new Set(exam.map(signature)).size,100,"duplicated question wording seed "+seed);
 for(const [domain,expected] of Object.entries(sums))
  assert.equal(exam.filter(q=>q.domain===domain).length,expected,"domain "+domain);
 assert.equal(buildStudySet(seed).length,20);
}
console.log(JSON.stringify({medicalLessons:medicalLessons.length,codingLessons:codingLessonDetails.length,cases:practiceCases.length,questions:caseQuestions.length,examQuotas:sums,seedsChecked:9},null,2));
