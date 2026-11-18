"use client";

import {useEffect,useState} from "react";
import Link from "next/link";
import {ArrowLeft,ArrowRight,BookOpen,CheckCircle2,ClipboardCheck,FileSearch,ShieldCheck} from "lucide-react";
import {codingUnits,officialCodingResources} from "@/lib/cpc-professional-curriculum";
import {codingLessonDetails} from "@/lib/cpc-coding-lesson-content";
import "../coding.css";
import "./lesson.css";

const STORAGE="cpc-academy-professional-coding-v1";
type Mastery={score:number;date:string};
const first=codingLessonDetails[0];

export default function ProfessionalLessonPage(){
  const [ready,setReady]=useState(false);
  const [id,setId]=useState(first.id);
  const [passed,setPassed]=useState<Record<string,Mastery>>({});
  const [answers,setAnswers]=useState<Record<number,number>>({});
  const [submitted,setSubmitted]=useState(false);

  useEffect(()=>{
    let progress:Record<string,Mastery>={};
    try{
      const raw=localStorage.getItem(STORAGE);
      if(raw)progress=(JSON.parse(raw) as {passedCodingLessons?:Record<string,Mastery>}).passedCodingLessons??{};
    }catch{progress={};}
    setPassed(progress);
    const params=new URLSearchParams(window.location.search);
    const match=codingLessonDetails.find(l=>l.unitId===params.get("unit")&&l.lessonIndex===Number(params.get("lesson")));
    setId(match?.id??first.id);
    setReady(true);
  },[]);

  const lesson=codingLessonDetails.find(l=>l.id===id)??first;
  const unit=codingUnits.find(u=>u.id===lesson.unitId);
  const currentIndex=codingLessonDetails.findIndex(l=>l.id===id);
  const next=codingLessonDetails[currentIndex+1];
  const correct=lesson.questions.reduce((n,q,i)=>n+(answers[i]===q.answer?1:0),0);
  const percentage=Math.round(correct/lesson.questions.length*100);
  const allAnswered=lesson.questions.every((_,i)=>answers[i]!==undefined);
  const progress=Object.keys(passed).filter(key=>(passed[key]?.score??0)>=80).length;

  function openLesson(nextId:string){
    const target=codingLessonDetails.find(l=>l.id===nextId);
    if(!target)return;
    setId(nextId);
    setAnswers({});
    setSubmitted(false);
    window.history.replaceState(null,"","/cpc/coding/lesson/?unit="+encodeURIComponent(target.unitId)+"&lesson="+target.lessonIndex);
    window.scrollTo({top:0,behavior:"smooth"});
  }

  function submit(){
    if(!allAnswered)return;
    setSubmitted(true);
    if(percentage>=80){
      const record={score:Math.max(percentage,passed[id]?.score??0),date:new Date().toISOString()};
      const updated={...passed,[id]:record};
      setPassed(updated);
      try{
        const raw=localStorage.getItem(STORAGE);
        const saved=raw?JSON.parse(raw) as Record<string,unknown>:{};
        localStorage.setItem(STORAGE,JSON.stringify({...saved,passedCodingLessons:updated}));
      }catch{/* some browsers may restrict local data */}
    }
  }

  if(!ready)return <main className="coding-loading">专业编码课程加载中…</main>;
  return <main className="coding-shell">
    <header className="coding-topbar">
      <Link className="coding-back" href="/cpc/coding/"><ArrowLeft size={16}/> 返回专业编码学院</Link>
      <div className="coding-brand"><span className="coding-mark">C</span><span><b>CPC Academy</b><small>PROFESSIONAL LESSON</small></span></div>
      <span className="coding-version">课程试点</span>
    </header>
    <div className="pro-lesson-container">
      <section className="pro-lesson-hero">
        <div className="pro-lesson-eyebrow"><BookOpen size={15}/> {unit?.track.toUpperCase()} · {unit?.title}</div>
        <h1>{lesson.zh}</h1>
        <p>{unit?.lessons[lesson.lessonIndex]??lesson.zh}</p>
        <div className="pro-lesson-meta"><span>第 {currentIndex+1} / {codingLessonDetails.length} 节已制作课程</span><span>已通过 {progress} 节</span></div>
      </section>

      <div className="pro-lesson-content">
        {(passed[id]?.score??0)>=80&&<div className="pro-lesson-passed"><CheckCircle2 size={17}/> 本课知识检测已通过</div>}
        <section className="pro-lesson-card">
          <h2><BookOpen size={17}/> 本节学习目标</h2>
          <ul>{lesson.objectives.map(x=><li key={x}>{x}</li>)}</ul>
        </section>
        <section className="pro-lesson-card">
          <h2><BookOpen size={17}/> 专业知识讲解</h2>
          {lesson.sections.map(x=><div className="pro-lesson-explanation" key={x.heading}><h3>{x.heading}</h3><p>{x.body}</p></div>)}
        </section>
        <section className="pro-lesson-card">
          <h2><FileSearch size={17}/> 临床编码阅读示例</h2>
          <blockquote className="pro-lesson-record">{lesson.practice.record}</blockquote>
          <p className="pro-lesson-prompt">{lesson.practice.prompt}</p>
          <details className="pro-lesson-answer"><summary>展开分析与编码逻辑</summary><p>{lesson.practice.explanation}</p></details>
        </section>
        <section className="pro-lesson-card">
          <div className="pro-lesson-test-heading"><h2><ClipboardCheck size={17}/> 知识检测</h2><span>两题均正确才记录掌握</span></div>
          {lesson.questions.map((q,i)=><div className="pro-lesson-question" key={q.question}>
            <b>{i+1}. {q.question}</b>
            <div className="pro-lesson-options">{q.options.map((option,j)=><button type="button" key={j} disabled={submitted}
              className={submitted&&j===q.answer?"correct":submitted&&answers[i]===j?"wrong":answers[i]===j?"selected":""}
              onClick={()=>setAnswers(prev=>({...prev,[i]:j}))}><span>{String.fromCharCode(65+j)}</span>{option}</button>)}</div>
            {submitted&&<div className="pro-lesson-feedback"><b>{answers[i]===q.answer?"回答正确":"需要复习"}</b><p>{q.explanation}</p></div>}
          </div>)}
          {!submitted?<button className="coding-primary" disabled={!allAnswered} onClick={submit}>提交本课检测 <ArrowRight size={15}/></button>:
          <div className={percentage>=80?"pro-lesson-result pass":"pro-lesson-result"}>
            <b>{percentage}% · {percentage>=80?"已掌握":"继续复习"}</b>
            <p>{percentage>=80?"成绩已保存到本地专业课程进度。":"阅读解析后可重新作答。本课暂不计入已掌握课程。"}</p>
            {percentage<80&&<button className="coding-secondary" onClick={()=>{setAnswers({});setSubmitted(false);}}>重新作答</button>}
          </div>}
        </section>
        <aside className="pro-lesson-caution"><ShieldCheck size={18}/><p>本课程使用原创教学解释和虚构案例，不提供完整 CPT® 版权代码库。实际编码须按服务日期核实当年度官方指南、获授权的 CPT® 资料及支付方规则。</p></aside>
        <div className="pro-lesson-bottom">
          <Link href="/cpc/coding/" className="coding-secondary"><ArrowLeft size={15}/> 课程目录</Link>
          {next&&<button className="coding-primary" onClick={()=>openLesson(next.id)}>下一课：{next.zh}<ArrowRight size={15}/></button>}
        </div>
        <div className="pro-lesson-resources"><Link href="/cpc/icd10-lookup/" className="coding-secondary">查询官方 ICD-10-CM FY2027 代码描述</Link></div>
        <div className="pro-lesson-resources">
          <h2>官方参考资料</h2>
          {officialCodingResources.filter(x=>/CMS — ICD|AMA|AAPC/.test(x.label)).map(x=><a key={x.url} href={x.url} target="_blank" rel="noopener noreferrer">{x.label} ↗</a>)}
        </div>
      </div>
    </div>
  </main>;
}
