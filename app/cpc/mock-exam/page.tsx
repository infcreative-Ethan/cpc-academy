"use client";

import {useEffect,useMemo,useState} from "react";
import Link from "next/link";
import {ArrowLeft,ArrowRight,BookOpen,CheckCircle2,Clock3,Flag,RotateCcw,ShieldCheck,Target} from "lucide-react";
import {buildOfficialStructurePractice,buildStudySet,officialExamStructure,type MockExamMode} from "@/lib/cpc-mock-exam";
import "../coding/coding.css";
import "./exam.css";

type Session={id:number;seed:number;mode:MockExamMode;startedAt:number;duration:number;finishedAt:number|null;answers:Record<string,number>;flags:string[];current:number};
type History={id:number;mode:MockExamMode;date:number;score:number;count:number};
const SESSION_STORAGE="cpc-academy-mock-exam-v1";
const HISTORY_STORAGE="cpc-academy-mock-exam-history-v1";
const LIMIT=240*60;

const formatTime=(seconds:number)=>{const h=Math.floor(seconds/3600),m=Math.floor((seconds%3600)/60),s=seconds%60;return [h,m,s].map(x=>String(x).padStart(2,"0")).join(":");};
function getQuestions(s:Session){
 return s.mode==="full"?buildOfficialStructurePractice(s.seed):buildStudySet(s.seed);
}

export default function CPCMockExamPage(){
 const [ready,setReady]=useState(false);
 const [session,setSession]=useState<Session|null>(null);
 const [history,setHistory]=useState<History[]>([]);
 const [now,setNow]=useState(0);
 const [error,setError]=useState("");
 const [wrongOnly,setWrongOnly]=useState(true);
 useEffect(()=>{
  try{
   const raw=localStorage.getItem(SESSION_STORAGE);
   if(raw){const x=JSON.parse(raw) as Session;if(x&&x.id&&typeof x.seed==="number")setSession(x);}
   const h=localStorage.getItem(HISTORY_STORAGE);
   if(h){const xs=JSON.parse(h) as History[];if(Array.isArray(xs))setHistory(xs.slice(0,30));}
  }catch{}
  setNow(Date.now());setReady(true);
 },[]);
 useEffect(()=>{
  if(ready)try{if(session)localStorage.setItem(SESSION_STORAGE,JSON.stringify(session));else localStorage.removeItem(SESSION_STORAGE);}catch{}
 },[ready,session]);
 useEffect(()=>{if(ready)try{localStorage.setItem(HISTORY_STORAGE,JSON.stringify(history));}catch{}},[ready,history]);
 useEffect(()=>{
  if(!session||session.finishedAt)return;
  const tick=()=>setNow(Date.now());
  tick();const timer=window.setInterval(tick,1000);
  return ()=>window.clearInterval(timer);
 },[session?.id,session?.finishedAt]);
 useEffect(()=>{
  if(session&&!session.finishedAt&&now>0&&now>=session.startedAt+session.duration*1000){
   setSession(old=>old&&!old.finishedAt?{...old,finishedAt:Date.now()}:old);
  }
 },[now,session]);
 const questions=useMemo(()=>session?getQuestions(session):[],[session?.seed,session?.mode]);
 const current=session?questions[session.current]??questions[0]:null;
 const remaining=session?Math.max(0,Math.ceil((session.startedAt+session.duration*1000-now)/1000)):0;
 const attempted=session?questions.filter(q=>session.answers[q.id]!==undefined).length:0;
 const correct=session?questions.filter(q=>session.answers[q.id]===q.answer).length:0;
 const score=questions.length?Math.round(correct/questions.length*100):0;
 const grouped=useMemo(()=>{
  if(!session||!session.finishedAt)return [];
  return officialExamStructure.map(d=>{
   const qs=questions.filter(q=>q.domain===d.name);
   return {name:d.name,zh:d.zh,n:qs.length,correct:qs.filter(q=>session.answers[q.id]===q.answer).length};
  }).filter(d=>d.n>0);
 },[session?.finishedAt,questions,session?.answers]);
 useEffect(()=>{
  if(!session?.finishedAt||!questions.length||!ready)return;
  const item:History={id:session.id,mode:session.mode,date:session.finishedAt,score,count:questions.length};
  setHistory(prev=>prev.some(x=>x.id===session.id)?prev:[item,...prev].slice(0,30));
 },[session?.id,session?.finishedAt,questions.length,ready]);

 function start(mode:MockExamMode){
  setError("");
  try{
   const id=Date.now();
   const next:Session={id,seed:id%2147483647,mode,startedAt:id,duration:mode==="full"?LIMIT:60*60,finishedAt:null,answers:{},flags:[],current:0};
   const q=getQuestions(next);
   if(q.length!==(mode==="full"?100:20))throw new Error("题目数量不足");
   setSession(next);setNow(id);setWrongOnly(true);
  }catch(e){setError(e instanceof Error?e.message:"无法创建试卷。");}
 }
 function setAnswer(index:number){
  if(!current||!session||session.finishedAt)return;
  setSession(s=>s?{...s,answers:{...s.answers,[current.id]:index}}:s);
 }
 function selectQuestion(index:number){
  if(!session)return;
  setSession(s=>s?{...s,current:index}:s);
 }
 function flagCurrent(){
  if(!current||!session||session.finishedAt)return;
  setSession(s=>s?{...s,flags:s.flags.includes(current.id)?s.flags.filter(id=>id!==current.id):[...s.flags,current.id]}:s);
 }
 function finish(){
  setSession(s=>s&&!s.finishedAt?{...s,finishedAt:Date.now()}:s);
 }
 const review=questions.map((q,i)=>({q,index:i})).filter(x=>!wrongOnly||session?.answers[x.q.id]!==x.q.answer);
 if(!ready)return <main className="exam-loading">CPC 模拟考试加载中…</main>;
 return <main className="exam-shell">
  <header className="exam-top">
   <Link href="/cpc/coding/" className="exam-back"><ArrowLeft size={16}/> 专业编码学院</Link>
   <b>CPC Academy · Mock Exam</b>
   <span>原创练习版</span>
  </header>
  <div className="exam-container">
   {!session?<section className="exam-intro">
    <span className="exam-eyebrow"><Target size={15}/> 100-QUESTION SIMULATION</span>
    <h1>CPC 模拟考试</h1>
    <p>依照 AAPC 公布的100题、4小时和17个知识领域及10道病例题的结构，使用本应用原创课程题生成练习试卷。支持题目标记、跳题、交卷统计、错题解析、重新考试和本地历史成绩。</p>
    <div className="exam-choice-grid">
     <div className="exam-mode-card"><Clock3 size={26}/><h2>完整模拟 · 100题</h2><p>限时4小时；按官方题量领域比例抽题。模拟达标参考70%。</p><button onClick={()=>start("full")}>开始100题模拟 <ArrowRight size={15}/></button></div>
     <div className="exam-mode-card"><BookOpen size={26}/><h2>专项练习 · 20题</h2><p>限时1小时；从全部领域中抽取20道题，适合短时训练。</p><button onClick={()=>start("practice")}>开始20题练习 <ArrowRight size={15}/></button></div>
    </div>
    {error&&<p className="exam-error">{error}</p>}
    <section className="exam-blueprint"><h2>模拟题量分布（100题）</h2><div>{officialExamStructure.map(d=><span key={d.name}>{d.zh}<b>{d.questionCount}</b></span>)}</div></section>
    <section className="exam-history"><h2>最近模拟成绩</h2>{history.length?history.map(h=><div key={h.id}><span>{new Date(h.date).toLocaleString("zh-CN")} · {h.count}题</span><strong>{h.score}%</strong></div>):<p>尚无考试记录。</p>}</section>
    <p className="exam-warning"><ShieldCheck size={16}/> 这是基础教学模拟，非 AAPC 官方试题，也不代表正式 CPC 难度或可直接用于真实诊断编码。选取具体 CPT® 代码仍需获授权的当前代码书。</p>
   </section>:!session.finishedAt?<div className="exam-test-layout">
    <section className="exam-quiz">
     <div className="exam-progress"><span>问题 {session.current+1} / {questions.length}</span><b className={remaining<300?"urgent":""}><Clock3 size={15}/> {formatTime(remaining)}</b></div>
     <div className="exam-progress-bar"><span style={{width:(attempted/questions.length*100)+"%"}}/></div>
     <div className="exam-topic">{current?.domain} · {attempted}题已回答 · {session.flags.length}题已标记</div>
     <h2>{current?.question}</h2>
     {current?.record&&<blockquote>{current.record}</blockquote>}
     <div className="exam-options">{current?.options.map((option,i)=><button key={i} className={session.answers[current.id]===i?"selected":""} onClick={()=>setAnswer(i)}><span>{String.fromCharCode(65+i)}</span>{option}</button>)}</div>
     <div className="exam-actions">
      <button className="exam-flag" onClick={flagCurrent}><Flag size={15}/>{current&&session.flags.includes(current.id)?"取消标记":"标记待复查"}</button>
      <div><button disabled={session.current===0} onClick={()=>selectQuestion(session.current-1)}><ArrowLeft size={14}/> 上一题</button><button disabled={session.current===questions.length-1} onClick={()=>selectQuestion(session.current+1)}>下一题 <ArrowRight size={14}/></button></div>
     </div>
     <div className="exam-submit"><p>未答题：{questions.length-attempted}题。交卷后不能继续修改答案。</p><button onClick={finish}>交卷并查看评分</button></div>
    </section>
    <aside className="exam-navigator"><h3>题目导航</h3><div>{questions.map((q,i)=><button key={q.id} onClick={()=>selectQuestion(i)}
     className={[i===session.current?"active":"",session.answers[q.id]!==undefined?"answered":"",session.flags.includes(q.id)?"flagged":""].join(" ")}>{i+1}</button>)}</div>
     <p>紫色：已回答 · 橙色边框：已标记。点击题号可跳转。</p>
    </aside>
   </div>:<section className="exam-results">
    <div className="exam-score">
     <span>{session.mode==="full"?"100题模拟":"20题练习"} · 已交卷</span><h1>{score}%</h1>
     <b>{correct}/{questions.length}题正确</b>
     <p>{session.mode==="full"?(score>=70?"达到70%的模拟参考线。":"低于70%的模拟参考线，需要针对错题复习。"):"本次短时练习完成。"} 正式 AAPC CPC 成绩不能由此预测。</p>
     <button onClick={()=>setSession(null)}><RotateCcw size={15}/> 返回并开始新考试</button>
    </div>
    <section className="exam-domain-scores"><h2>分领域表现</h2><div>{grouped.map(d=><div key={d.name}><span>{d.zh}</span><strong>{d.correct}/{d.n}</strong><div><i style={{width:(d.correct/d.n*100)+"%"}}/></div></div>)}</div></section>
    <section className="exam-review"><div className="exam-review-head"><h2>答案解析</h2><button onClick={()=>setWrongOnly(!wrongOnly)}>{wrongOnly?"显示全部题目":"只看错题"}</button></div>
     {review.length===0?<p>本次没有需要复习的题目。</p>:review.map(({q,index})=><article key={q.id}>
      <span>第 {index+1}题 · {q.domain}</span><h3>{q.question}</h3>
      <p className="exam-record">{q.record}</p>
      <p>你的答案：{session.answers[q.id]===undefined?"未作答":q.options[session.answers[q.id]]}</p>
      <p>正确答案：<strong>{q.options[q.answer]}</strong></p>
      <div className="exam-explanation">{q.explanation}</div>
     </article>)}
    </section>
   </section>}
  </div>
 </main>;
}
