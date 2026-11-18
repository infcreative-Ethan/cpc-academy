"use client";

import {useEffect,useMemo,useState} from "react";
import Link from "next/link";
import {ArrowLeft,ArrowRight,BookOpen,CheckCircle2,ClipboardCheck,FileText,Filter,Heart,RotateCcw,Search,ShieldCheck} from "lucide-react";
import {practiceCases,caseBankSummary} from "@/lib/cpc-case-bank";
import "../coding.css";
import "./cases.css";

type Result={answer:number;correct:boolean;attempts:number;date:string};
type Abstract={diagnosis:string;procedure:string;laterality:string;missing:string};
type Progress={answers:Record<string,Result>;favorites:string[];notes:Record<string,Abstract>};
const STORAGE="cpc-academy-case-bank-v1";
const INITIAL:Progress={answers:{},favorites:[],notes:{}};
const EMPTY:Abstract={diagnosis:"",procedure:"",laterality:"",missing:""};

export default function CaseBankPage(){
 const [ready,setReady]=useState(false);
 const [saved,setSaved]=useState<Progress>(INITIAL);
 const [source,setSource]=useState("all");
 const [status,setStatus]=useState("all");
 const [search,setSearch]=useState("");
 const [selected,setSelected]=useState(practiceCases[0].id);
 const [questionNo,setQuestionNo]=useState(0);
 const [answer,setAnswer]=useState<number|null>(null);
 const [expand,setExpand]=useState(false);
 useEffect(()=>{
  try{
   const raw=localStorage.getItem(STORAGE);
   if(raw){const x=JSON.parse(raw) as Partial<Progress>;setSaved({answers:x.answers??{},favorites:x.favorites??[],notes:x.notes??{}});}
  }catch{}
  const param=new URLSearchParams(window.location.search).get("case");
  if(param&&practiceCases.some(c=>c.id===param))setSelected(param);
  setReady(true);
 },[]);
 useEffect(()=>{if(ready)try{localStorage.setItem(STORAGE,JSON.stringify(saved));}catch{}},[saved,ready]);
 const filtered=useMemo(()=>practiceCases.filter(c=>{
  if(source!=="all"&&c.source!==source)return false;
  if(status==="favorite"&&!saved.favorites.includes(c.id))return false;
  if(status==="unanswered"&&c.questions.some(q=>saved.answers[q.id]))return false;
  if(status==="wrong"&&!c.questions.some(q=>saved.answers[q.id]&&!saved.answers[q.id].correct))return false;
  const term=search.trim().toLowerCase();
  return !term||[c.title,c.system,c.record,c.domain].join(" ").toLowerCase().includes(term);
 }),[source,status,search,saved.answers,saved.favorites]);
 const active=practiceCases.find(c=>c.id===selected)??practiceCases[0];
 const question=active.questions[questionNo]??active.questions[0];
 const done=Object.values(saved.answers).filter(r=>r.correct).length;
 const allQuestions=caseBankSummary.questionTotal;
 const currentIndex=filtered.findIndex(c=>c.id===active.id);
 function openCase(id:string){
  setSelected(id);setQuestionNo(0);setAnswer(null);setExpand(false);
  window.history.replaceState(null,"","/cpc/coding/cases/?case="+encodeURIComponent(id));
 }
 function choose(index:number){
  if(answer!==null)return;
  setAnswer(index);
  const previous=saved.answers[question.id];
  setSaved(p=>({...p,answers:{...p.answers,[question.id]:{
   answer:index,correct:index===question.answer,
   attempts:(previous?.attempts??0)+1,date:new Date().toISOString()
  }}}));
 }
 function toggleFavorite(){
  setSaved(p=>({...p,favorites:p.favorites.includes(active.id)?p.favorites.filter(x=>x!==active.id):[...p.favorites,active.id]}));
 }
 function updateAbstract(key:keyof Abstract,value:string){
  const current=saved.notes[active.id]??EMPTY;
  setSaved(p=>({...p,notes:{...p.notes,[active.id]:{...current,[key]:value}}}));
 }
 const abstract=saved.notes[active.id]??EMPTY;
 if(!ready)return <main className="coding-loading">病例库加载中…</main>;
 return <main className="coding-shell">
  <header className="case-topbar">
   <Link href="/cpc/coding/" className="case-back"><ArrowLeft size={15}/> 专业编码学院</Link>
   <b>CPC Academy · Case Lab</b>
   <Link href="/cpc/mock-exam/" className="case-exam-link">100题模拟考试 <ArrowRight size={13}/></Link>
  </header>
  <div className="case-container">
   <section className="case-hero">
    <span><ClipboardCheck size={16}/> CASE BANK · 只使用虚构病历</span>
    <h1>临床病例与编码实训</h1>
    <p>{caseBankSummary.total}份原创教学案例，其中{caseBankSummary.medical}份医学短病例、{caseBankSummary.professional}份编码短病例和{caseBankSummary.extended}份综合病历。每份均有选择题和解析。</p>
    <div className="case-stats"><strong>{done}/{allQuestions}</strong> 当前答对题数（每次重练会更新） <span>·</span> <strong>{saved.favorites.length}</strong> 收藏病例</div>
   </section>
   <div className="case-layout">
    <aside className="case-sidebar">
     <div className="case-filter-title"><Filter size={15}/> 选择病例</div>
     <label className="case-search"><Search size={15}/><input value={search} placeholder="搜索病历、关键词、系统" onChange={e=>setSearch(e.target.value)}/></label>
     <div className="case-filter-row">
      <label>病例类型<select value={source} onChange={e=>setSource(e.target.value)}>
       <option value="all">全部病例</option><option value="medical">医学基础短病例</option><option value="coding">专业编码短病例</option><option value="extended">综合病历</option>
      </select></label>
      <label>练习状态<select value={status} onChange={e=>setStatus(e.target.value)}>
       <option value="all">全部状态</option><option value="unanswered">尚未开始</option><option value="wrong">上次答错</option><option value="favorite">我的收藏</option>
      </select></label>
     </div>
     <div className="case-list-count">{filtered.length} 份匹配病例</div>
     <div className="case-list">
      {filtered.map((item,index)=>{
       const complete=item.questions.every(q=>saved.answers[q.id]?.correct);
       const attempted=item.questions.some(q=>saved.answers[q.id]);
       return <button key={item.id} onClick={()=>openCase(item.id)} className={active.id===item.id?"selected":""}>
        <span className="case-list-no">{index+1}</span>
        <span><b>{item.title}</b><small>{item.domain} · {item.source==="extended"?"综合病历":item.source==="medical"?"医学基础":"专业编码"}</small></span>
        {complete?<CheckCircle2 size={16} className="case-correct"/>:attempted?<span className="case-attempt">复习</span>:null}
       </button>;
      })}
      {!filtered.length&&<p className="case-no-result">没有符合筛选条件的病例。</p>}
     </div>
    </aside>
    <article className="case-article">
     <div className="case-article-top"><span className="case-section-tag">{active.source==="extended"?"LONG CLINICAL RECORD":"CLINICAL MINI-CASE"} · {active.domain}</span>
      <button onClick={toggleFavorite} className={saved.favorites.includes(active.id)?"favorite":""}><Heart size={17}/>{saved.favorites.includes(active.id)?"已收藏":"收藏"}</button>
     </div>
     <h2>{active.title}</h2>
     <section className="case-record">
      <h3><FileText size={16}/> Original English Clinical Record</h3>
      <p>{active.record}</p>
      <div className="case-privacy"><ShieldCheck size={14}/> 全部为虚构教学案例，请勿将真实患者资料输入此应用。</div>
     </section>
     <section className="case-abstract">
      <div className="case-card-heading"><BookOpen size={16}/><h3>模拟编码员：病历抽取工作表</h3><button onClick={()=>setExpand(!expand)}>{expand?"收起":"展开填写"}</button></div>
      {expand&&<div className="case-fields">{([
       ["diagnosis","医师记录的诊断/症状"],
       ["procedure","已完成的操作/服务"],
       ["laterality","部位、侧别、方法"],
       ["missing","需澄清的缺失信息"]
      ] as const).map(([key,label])=><label key={key}>{label}<textarea rows={2} value={abstract[key]} onChange={e=>updateAbstract(key,e.target.value)} placeholder="用自己的话总结；仅保存于当前设备"/></label>)}</div>}
     </section>
     <section className="case-quiz">
      <div className="case-question-top"><span>问题 {questionNo+1}/{active.questions.length}</span><span>{saved.answers[question.id]?saved.answers[question.id].correct?"上次回答正确":"上次回答错误":"尚未完成"}</span></div>
      <h3>{question.question}</h3>
      <div className="case-options">{question.options.map((opt,i)=><button key={i} disabled={answer!==null} onClick={()=>choose(i)}
       className={answer===null?"":i===question.answer?"correct":answer===i?"wrong":""}>
       <span>{String.fromCharCode(65+i)}</span>{opt}
      </button>)}</div>
      {answer!==null&&<div className={answer===question.answer?"case-feedback correct":"case-feedback wrong"}>
       <b>{answer===question.answer?"回答正确":"回答错误，建议复习"}</b>
       <p>{question.explanation}</p>
       <button onClick={()=>setAnswer(null)}><RotateCcw size={14}/> 重做本题</button>
      </div>}
      <div className="case-question-actions">
       <button disabled={questionNo===0} onClick={()=>{setQuestionNo(x=>x-1);setAnswer(null);}}><ArrowLeft size={14}/> 上一题</button>
       <button disabled={questionNo>=active.questions.length-1} onClick={()=>{setQuestionNo(x=>x+1);setAnswer(null);}}>下一题 <ArrowRight size={14}/></button>
      </div>
     </section>
     <div className="case-bottom">
      <button disabled={currentIndex<=0} onClick={()=>openCase(filtered[currentIndex-1]?.id??active.id)}><ArrowLeft size={14}/> 上一病例</button>
      <button disabled={currentIndex<0||currentIndex>=filtered.length-1} onClick={()=>openCase(filtered[currentIndex+1]?.id??active.id)}>下一病例 <ArrowRight size={14}/></button>
     </div>
     <p className="case-footnote">本题库检验病历抽取、术语、分类及合规判断。正式 ICD-10-CM/CPT®/HCPCS 的逐代码选择需要对应年份的官方或获授权代码资料，不能以本训练自动生成真实索赔。</p>
    </article>
   </div>
  </div>
 </main>;
}
