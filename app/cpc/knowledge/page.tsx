"use client";

import {useEffect,useMemo,useState} from "react";
import Link from "next/link";
import {ArrowLeft,ArrowRight,BookOpen,BookOpenCheck,CheckCircle2,FileSearch,Filter,Image as ImageIcon,Layers,Search} from "lucide-react";
import {chapters} from "@/lib/cpc-curriculum";
import {medicalLessons} from "@/lib/cpc-medical-lessons";
import {figuresForChapter,priorityLabel,sectionHasLesson,sectionsForChapter,textbookSections,type SectionRecord} from "@/lib/textbook-index";
import "./knowledge.css";

type Priority="A"|"B"|"C";
const KEY="cpc-academy-knowledge-priorities-v1";
const PROGRESS="cpc-academy-medical-lessons-v1";
export default function KnowledgeCoveragePage(){
 const [chapter,setChapter]=useState(1);
 const [level,setLevel]=useState<"all"|Priority>("all");
 const [query,setQuery]=useState("");
 const [overrides,setOverrides]=useState<Record<string,Priority>>({});
 const [passed,setPassed]=useState<Record<string,{score:number}>>({});
 useEffect(()=>{
  try{const o=localStorage.getItem(KEY);if(o)setOverrides(JSON.parse(o));}catch{}
  try{const p=localStorage.getItem(PROGRESS);if(p)setPassed((JSON.parse(p) as {passed?:Record<string,{score:number}>}).passed??{});}catch{}
  const params=new URLSearchParams(window.location.search);
  const ch=Number(params.get("chapter"));if(Number.isInteger(ch)&&ch>=1&&ch<=22)setChapter(ch);
 },[]);
 const lessons=useMemo(()=>medicalLessons.filter(x=>x.chapter===chapter),[chapter]);
 const sections=useMemo(()=>sectionsForChapter(chapter),[chapter]);
 const filtered=sections.filter(s=>{
  if(level!=="all"&&(overrides[s.id]??s.priority)!==level)return false;
  const needle=query.trim().toLowerCase();return !needle||s.title.toLowerCase().includes(needle);
 });
 const byPriority=({A:0,B:0,C:0});for(const s of textbookSections)byPriority[overrides[s.id]??s.priority]++;
 function changePriority(section:SectionRecord,value:Priority){
  const next={...overrides,[section.id]:value};setOverrides(next);
  try{localStorage.setItem(KEY,JSON.stringify(next));}catch{}
 }
 const passedLessons=lessons.filter(l=>(passed[l.id]?.score??0)>=80).length;
 return <main className="knowledge-shell"><header className="knowledge-top"><Link href="/cpc/" className="knowledge-back"><ArrowLeft size={15}/> 学习中心</Link><b>Knowledge Map · 22 Chapters</b><Link href="/cpc/textbook/" className="knowledge-back">教材图谱 <ImageIcon size={15}/></Link></header>
  <div className="knowledge-container">
   <section className="knowledge-hero"><span><Layers size={16}/> COURSE COVERAGE & PRIORITIES</span><h1>全书知识点索引与学习优先级</h1>
    <p>根据第13版 PDF 章节书签提取115个二级主题，同时连接116节已编写课程及其学习目标。A/B/C 为建议分级，支持你按考试和工作需求自行调整，修改仅保存本机。</p>
    <div className="knowledge-hero-stats">{(["A","B","C"] as const).map(p=><div key={p}><strong>{byPriority[p]}</strong><small>{p}级 · {priorityLabel(p)}</small></div>)}<div><strong>{medicalLessons.length}</strong><small>已编写课程</small></div></div>
   </section>
   <div className="knowledge-layout"><aside className="knowledge-chapters"><h2>教材章节</h2><div>{chapters.map(c=>{
     const total=sectionsForChapter(c.number).length;const made=medicalLessons.filter(l=>l.chapter===c.number).length;
     return <button key={c.number} className={chapter===c.number?"active":""} onClick={()=>setChapter(c.number)}><span>{String(c.number).padStart(2,"0")}</span><b>{c.title}</b><small>{total}主题 · {made}课</small></button>;
    })}</div></aside>
    <article className="knowledge-detail"><div className="knowledge-detail-head"><div><span>CHAPTER {chapter}</span><h2>{chapters[chapter-1]?.title}</h2><p>{sections.length}个目录主题 · {lessons.length}节课程 · {passedLessons}节测验通过 · {figuresForChapter(chapter).length}张原书图位</p></div>
     <div><Link href={"/cpc/learn/?chapter="+chapter}>学习课程 <ArrowRight size={14}/></Link><Link href={"/cpc/textbook/?chapter="+chapter}>查看教材图谱 <ImageIcon size={14}/></Link></div></div>
     <div className="knowledge-filters"><label><Search size={15}/><input placeholder="搜索英文目录" value={query} onChange={e=>setQuery(e.target.value)}/></label><select value={level} onChange={e=>setLevel(e.target.value as typeof level)}><option value="all">全部级别</option><option value="A">A级核心</option><option value="B">B级进阶</option><option value="C">C级拓展</option></select></div>
     <section className="knowledge-subsection"><h3><BookOpenCheck size={15}/> 教材二级目录知识点</h3><p>按照 PDF 书签逐项列出；课程关联使用章节标题和关键词匹配，匹配结果不代表知识点已完整覆盖。</p>
      <div className="knowledge-sections">{filtered.map(s=>{
       const level=overrides[s.id]??s.priority;const covered=sectionHasLesson(s,lessons);
       return <div className="knowledge-section" key={s.id}><div className="knowledge-section-no">{s.id}</div><div><b>{s.title}</b><small>原书 PDF 第{s.page}页 · {covered?"有关联教学课时":"尚待深入扩充"}</small></div>
        <select aria-label={s.title+"学习级别"} value={level} onChange={e=>changePriority(s,e.target.value as Priority)}><option value="A">A级</option><option value="B">B级</option><option value="C">C级</option></select>
        <span className={covered?"covered":"pending"}>{covered?"已有关联课":"待补充"}</span>
       </div>;
      })}{!filtered.length&&<p className="knowledge-empty">没有符合筛选的目录主题。</p>}</div>
     </section>
     <section className="knowledge-subsection"><h3><BookOpen size={15}/> 本章授课与学习目标</h3><p>这些是独立编写的教学目标，不是把教材所有正文小知识点完全重新审核后的清单。</p>
      <div className="knowledge-lesson-list">{lessons.map(l=><div key={l.id}><div className="knowledge-lesson-title"><b>{l.zh}</b><span>{(passed[l.id]?.score??0)>=80?<><CheckCircle2 size={13}/> 已掌握</>:"待完成"}</span></div><small>{l.textbookSection} · {l.minutes}分钟</small>
       <ul>{l.objectives.map((obj,i)=><li key={i}>{obj}</li>)}</ul><Link href={"/cpc/learn/?chapter="+chapter+"&lesson="+encodeURIComponent(l.id)}>学习此课 <ArrowRight size={13}/></Link>
      </div>)}</div>
     </section>
     <p className="knowledge-footnote">版权与范围说明：本索引只包含教材二级书签标题和位置，以及 App 原创课程目标，没有教材正文、练习题、原图。当前是可执行的逐章覆盖审计基础；尚未声称已经审完所有书内细分知识点。</p>
    </article></div>
  </div></main>;
}