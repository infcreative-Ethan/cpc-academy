"use client";

import {useEffect,useMemo,useRef,useState} from "react";
import Link from "next/link";
import {ArrowLeft,ArrowRight,BookOpen,CheckCircle2,ChevronRight,ClipboardCheck,Clock3,FileText,GraduationCap,Volume2} from "lucide-react";
import {chapters} from "@/lib/cpc-curriculum";
import {words} from "@/lib/book-words";
import {medicalLessons,lessonsForChapter,type MedicalLesson,type MedicalDiagram} from "@/lib/cpc-medical-lessons";
import "./learn.css";

type Progress = {passed:Record<string,{score:number;date:string}>;lastLesson:string|null};
const STORAGE="cpc-academy-medical-lessons-v1";
const INITIAL:Progress={passed:{},lastLesson:null};
const slug=(v:string)=>v.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")||"audio";

function LessonDiagram({kind}:{kind:MedicalDiagram}){
  if(kind==="word")return <div className="learn-visual-part">
    <span><b>cardi</b><small>Root · 心脏</small></span><strong>+</strong>
    <span><b>o</b><small>连接元音</small></span><strong>+</strong>
    <span><b>-logy</b><small>Suffix · 学科</small></span>
    <p>cardi/o/logy = 心脏学。原创术语拆解示意。</p>
  </div>;
  if(kind==="hierarchy")return <div className="learn-visual-flow">
    {["Cell · 细胞","Tissue · 组织","Organ · 器官","Organ system · 器官系统"].map((x,i)=><div key={x}><b>{x}</b>{i<3&&<small>↓</small>}</div>)}
  </div>;
  if(kind==="digestive")return <div className="learn-visual-flow">
    {["Mouth · 口腔","Pharynx · 咽","Esophagus · 食管","Stomach · 胃","Small intestine · 小肠","Large intestine · 大肠"].map((x,i)=><div key={x}><b>{x}</b>{i<5&&<small>↓</small>}</div>)}
    <p>肝脏、胆囊和胰腺是辅助消化器官，并非食物直接通过的消化道。</p>
  </div>;
  if(kind==="quadrants")return <div className="learn-visual-svg">
    <svg viewBox="0 0 400 260" role="img" aria-label="腹部四象限，正面视角">
      <text x="200" y="20" textAnchor="middle" fontSize="13" fill="#685cb9">Anterior view · 患者正面</text>
      <rect x="75" y="35" width="250" height="185" rx="20" fill="#f0edff" stroke="#a69ce2"/>
      <path d="M200 35V220 M75 128H325" stroke="#9487d8" strokeDasharray="5 5" strokeWidth="2"/>
      {[[137,93,"RUQ"],[262,93,"LUQ"],[137,181,"RLQ"],[262,181,"LLQ"]].map(([x,y,t])=><text key={String(t)} x={Number(x)} y={Number(y)} textAnchor="middle" fontSize="23" fontWeight="bold" fill="#544baa">{t}</text>)}
      <text x="75" y="242" fontSize="11" fill="#646c83">患者右侧</text><text x="325" y="242" textAnchor="end" fontSize="11" fill="#646c83">患者左侧</text>
    </svg>
    <p>左右以患者自己为准，面对患者时左右方向相反。示意图不代表实际器官外形。</p>
  </div>;
  if(kind==="spine")return <div className="learn-visual-svg">
    <svg viewBox="0 0 400 280" role="img" aria-label="脊柱分区">
      <text x="200" y="22" textAnchor="middle" fontSize="14" fill="#685cb9">Spinal Regions · 脊柱</text>
      {[
        {en:"C1–C7",zh:"颈椎",y:35,h:37,c:"#e1ddfa"},
        {en:"T1–T12",zh:"胸椎",y:76,h:65,c:"#d4daf3"},
        {en:"L1–L5",zh:"腰椎",y:145,h:43,c:"#d2ebef"},
        {en:"S1–S5",zh:"骶骨（融合）",y:192,h:42,c:"#def0e0"},
        {en:"Co",zh:"尾骨",y:238,h:26,c:"#f5e6d8"}
      ].map(x=><g key={x.en}><rect x="140" y={x.y} width="75" height={x.h} rx="8" fill={x.c} stroke="#a4a0c5"/><text x="177" y={x.y+x.h/2+4} textAnchor="middle" fontSize="12" fill="#4b467f">{x.en}</text><text x="228" y={x.y+x.h/2+4} fontSize="12" fill="#5f6577">{x.zh}</text></g>)}
    </svg><p>各区段椎骨数为常见解剖数量，具体病历按临床记录确认。</p>
  </div>;
  return <div className="learn-visual-planes">
    {[
      {name:"Sagittal",zh:"分隔左右",type:"vertical"},
      {name:"Coronal",zh:"分隔前后",type:"square"},
      {name:"Transverse",zh:"分隔上下",type:"horizontal"}
    ].map(x=><div key={x.name}><svg viewBox="0 0 100 105" role="img" aria-label={x.name}>
      <circle cx="50" cy="17" r="11" fill="#dee2f7" stroke="#8784bd"/>
      <rect x="35" y="31" width="30" height="45" rx="10" fill="#dee2f7" stroke="#8784bd"/>
      <path d="M40 71L37 98 M60 71L63 98" stroke="#9c99c9" strokeWidth="9" strokeLinecap="round"/>
      {x.type==="vertical"?<rect x="48" y="9" width="5" height="82" fill="#8274d8" opacity=".7"/>:
      x.type==="horizontal"?<rect x="21" y="54" width="58" height="6" fill="#8274d8" opacity=".7"/>:
      <rect x="20" y="36" width="60" height="38" fill="#8274d8" opacity=".4"/>}
    </svg><b>{x.name}</b><small>{x.zh}</small></div>)}
  </div>;
}

export default function MedicalLearningPage(){
  const [ready,setReady]=useState(false);
  const [state,setState]=useState<Progress>(INITIAL);
  const [chapterNo,setChapterNo]=useState(1);
  const [lessonId,setLessonId]=useState("");
  const [answers,setAnswers]=useState<Record<number,number>>({});
  const [submitted,setSubmitted]=useState(false);
  const [audioStatus,setAudioStatus]=useState("");
  const audioRef=useRef<HTMLAudioElement|null>(null);
  useEffect(()=>{
    let loaded:Progress=INITIAL;
    try{
      const raw=localStorage.getItem(STORAGE);
      if(raw){const p=JSON.parse(raw) as Partial<Progress>;loaded={passed:p.passed??{},lastLesson:p.lastLesson??null};}
    }catch{loaded=INITIAL;}
    setState(loaded);
    const p=new URLSearchParams(window.location.search);
    const requested=Number(p.get("chapter"));
    const valid=Number.isInteger(requested)&&requested>=1&&requested<=22?requested:1;
    const last=medicalLessons.find(l=>l.id===loaded.lastLesson);
    const target=p.has("chapter")?valid:(last?.chapter??1);
    const byUrl=medicalLessons.find(l=>l.chapter===target&&l.id===p.get("lesson"));
    setChapterNo(target);
    setLessonId(byUrl?.id??(last?.chapter===target?last.id:lessonsForChapter(target)[0]?.id)??"");
    setReady(true);
  },[]);
  useEffect(()=>{if(ready)try{localStorage.setItem(STORAGE,JSON.stringify(state));}catch{}},[ready,state]);
  useEffect(()=>()=>audioRef.current?.pause(),[]);
  const chapter=chapters.find(ch=>ch.number===chapterNo)??chapters[0];
  const chapterLessons=useMemo(()=>lessonsForChapter(chapterNo),[chapterNo]);
  const lesson=chapterLessons.find(l=>l.id===lessonId)??chapterLessons[0]??null;
  const mastered=medicalLessons.filter(l=>(state.passed[l.id]?.score??0)>=80).length;
  const recommended=medicalLessons.find(l=>(state.passed[l.id]?.score??0)<80);
  const answerCount=lesson?lesson.questions.filter((q,i)=>answers[i]===q.answer).length:0;
  const answeredAll=lesson?lesson.questions.every((_,i)=>answers[i]!==undefined):false;
  const percentage=lesson?Math.round(answerCount/lesson.questions.length*100):0;
  const deckIndex=lesson?medicalLessons.findIndex(l=>l.id===lesson.id):-1;
  const next=deckIndex>=0?medicalLessons[deckIndex+1]:undefined;
  function changeChapter(n:number){
    setChapterNo(n);setLessonId(lessonsForChapter(n)[0]?.id??"");
    setAnswers({});setSubmitted(false);setAudioStatus("");
    window.history.replaceState(null,"","/cpc/learn/?chapter="+n);
  }
  function selectLesson(l:MedicalLesson){
    setChapterNo(l.chapter);setLessonId(l.id);setAnswers({});setSubmitted(false);setAudioStatus("");
    setState(s=>({...s,lastLesson:l.id}));
    window.history.replaceState(null,"","/cpc/learn/?chapter="+l.chapter+"&lesson="+encodeURIComponent(l.id));
  }
  function submitQuiz(){
    if(!lesson||!answeredAll)return;
    setSubmitted(true);
    if(percentage>=80)setState(s=>({...s,lastLesson:lesson.id,passed:{
      ...s.passed,[lesson.id]:{score:Math.max(percentage,s.passed[lesson.id]?.score??0),date:new Date().toISOString()}
    }}));
  }
  function playTerm(term:string){
    const index=words.findIndex(w=>w.term.toLowerCase()===term.toLowerCase());
    if(index<0)return;
    const w=words[index];
    const audio=audioRef.current??new Audio();
    audioRef.current=audio;audio.pause();
    audio.src="/audio/words/"+String(index+1).padStart(4,"0")+"-"+slug(w.term)+".mp3";
    audio.playbackRate=1;
    audio.onplaying=()=>setAudioStatus("正在播放："+term);
    audio.onended=()=>setAudioStatus("");
    audio.onerror=()=>setAudioStatus("音频文件读取失败。");
    void audio.play().catch(()=>setAudioStatus("播放失败，请重新点击。"));
  }
  if(!ready)return <main className="learn-loading">CPC Academy · 课程加载中…</main>;
  return <main className="learn-shell">
    <header className="learn-top">
      <Link href="/cpc/" className="learn-back"><ArrowLeft size={16}/> 返回学习中心</Link>
      <div className="learn-logo"><span>C</span><b>Medical Foundation</b></div>
      <span className="learn-beta">首批17节课程</span>
    </header>
    <div className="learn-container">
      <section className="learn-banner">
        <span><GraduationCap size={15}/> MEDICAL LEARNING PATHWAY</span>
        <h1>医学课程，从第一章开始。</h1>
        <p>按照原书22章的顺序学习。每节已制作课程包含原创讲解、医学术语、临床案例和知识检测。</p>
        <div className="learn-banner-stats"><b>{mastered} / {medicalLessons.length}</b> 首批课程已通过</div>
        {recommended&&<button className="learn-start" onClick={()=>selectLesson(recommended)}>继续推荐：{recommended.zh} <ArrowRight size={15}/></button>}
      </section>
      <div className="learn-layout">
        <aside className="learn-chapters" aria-label="22章课程目录">
          <div className="learn-side-heading"><BookOpen size={16}/> 医学教材22章</div>
          {chapters.map(ch=>{
            const ls=lessonsForChapter(ch.number);
            const passed=ls.filter(l=>(state.passed[l.id]?.score??0)>=80).length;
            return <button key={ch.number} className={chapterNo===ch.number?"active":""} onClick={()=>changeChapter(ch.number)}>
              <span>{String(ch.number).padStart(2,"0")}</span>
              <div><b>{ch.title}</b><small>{ls.length?("已制作"+ls.length+"课时 · 通过"+passed+"节"):"内容待制作"}</small></div>
              {ls.length&&passed===ls.length?<CheckCircle2 size={16}/>:<ChevronRight size={15}/>}
            </button>;
          })}
        </aside>
        <section className="learn-main">
          <div className="learn-section-heading"><div>
            <span className="learn-eyebrow">CHAPTER {chapter.number} · {chapter.phase}</span>
            <h2>{chapter.title}</h2><p>原书目录：{chapter.topics.join(" · ")}</p>
          </div><span className="learn-count">{chapterLessons.length?chapterLessons.length+"节已制作":"内容待制作"}</span></div>
          {chapterLessons.length===0?<div className="learn-empty">
            <h3>本章目前只有教材目录</h3>
            <p>本章的独立授课内容、医学插图、案例和测试尚未制作，不能当作已学完。</p>
            <ul>{chapter.topics.map(t=><li key={t}>{t}</li>)}</ul>
            <button className="learn-secondary" onClick={()=>changeChapter(1)}>返回第一章</button>
          </div>:<>
            <nav className="learn-lessons" aria-label="当前章节课时">
              {chapterLessons.map((item,i)=><button key={item.id} className={lesson?.id===item.id?"active":""} onClick={()=>selectLesson(item)}>
                <span className="learn-number">{i+1}</span><span><b>{item.zh}</b><small>{item.textbookSection} · {item.minutes}分钟</small></span>
                {(state.passed[item.id]?.score??0)>=80?<CheckCircle2 className="learn-good" size={16}/>:<ChevronRight size={15}/>}
              </button>)}
            </nav>
            {lesson&&<article className="learn-article" key={lesson.id}>
              <div className="learn-title-top"><span className="learn-eyebrow">LESSON · {lesson.textbookSection}</span><small><Clock3 size={14}/>{lesson.minutes}分钟</small></div>
              <h3>{lesson.zh}</h3><p className="learn-en">{lesson.title}</p>
              {(state.passed[lesson.id]?.score??0)>=80&&<div className="learn-passed"><CheckCircle2 size={16}/>本课知识检测已通过</div>}
              <section className="learn-block"><h4><BookOpen size={17}/> 学习目标</h4><ul>{lesson.objectives.map(x=><li key={x}>{x}</li>)}</ul></section>
              <section className="learn-block"><h4><BookOpen size={17}/> 知识讲解</h4>{lesson.teaching.map(item=><div className="learn-teaching" key={item.heading}><b>{item.heading}</b><p>{item.body}</p></div>)}</section>
              {lesson.diagram&&<section className="learn-block"><h4><FileText size={17}/> 可视化知识结构</h4><LessonDiagram kind={lesson.diagram}/></section>}
              <section className="learn-block"><h4><BookOpen size={17}/> 医学术语</h4>
                <div className="learn-term-grid">{lesson.terminology.map(item=>{
                  const available=words.some(w=>w.term.toLowerCase()===item.term.toLowerCase());
                  return <div className="learn-term" key={item.term}>
                    <div><b>{item.term}</b><span>{item.zh}</span></div><p>{item.note}</p>
                    {available&&<button onClick={()=>playTerm(item.term)} aria-label={"朗读"+item.term}><Volume2 size={15}/></button>}
                  </div>;
                })}</div>
                {audioStatus&&<p className="learn-audio-note">{audioStatus}</p>}
                <p className="learn-note">仅对已匹配原医学词库的词提供离线 MP3 播放。</p>
              </section>
              <section className="learn-block"><h4><FileText size={17}/> {lesson.clinical.heading}</h4>
                <blockquote className="learn-record">{lesson.clinical.note}</blockquote>
                <p className="learn-clinical-task">{lesson.clinical.task}</p>
                <details className="learn-explain"><summary>展开临床分析</summary><p>{lesson.clinical.takeaway}</p></details>
              </section>
              <section className="learn-block learn-quiz">
                <div className="learn-quiz-title"><h4><ClipboardCheck size={17}/> 本课知识检测</h4><span>两题均答对才通过</span></div>
                {lesson.questions.map((q,i)=><div className="learn-question" key={q.question}>
                  <b>{i+1}. {q.question}</b>
                  <div className="learn-options">{q.options.map((opt,j)=><button
                    key={j} disabled={submitted}
                    className={submitted&&j===q.answer?"correct":submitted&&answers[i]===j?"wrong":answers[i]===j?"selected":""}
                    onClick={()=>setAnswers(prev=>({...prev,[i]:j}))}><span>{String.fromCharCode(65+j)}</span>{opt}</button>)}</div>
                  {submitted&&<div className="learn-answer"><b>{answers[i]===q.answer?"回答正确":"需要巩固"}</b><p>{q.explanation}</p></div>}
                </div>)}
                {!submitted?<button className="learn-primary" disabled={!answeredAll} onClick={submitQuiz}>提交检测并记录学习成绩 <ArrowRight size={14}/></button>:
                <div className={percentage>=80?"learn-result good":"learn-result"}><b>{percentage}% · {percentage>=80?"通过":"未通过"}</b>
                  <p>{percentage>=80?"本课成绩已保存，可以继续下一节。":"建议阅读解析后再次检测。"}</p>
                  {percentage<80&&<button className="learn-secondary" onClick={()=>{setAnswers({});setSubmitted(false);}}>重新作答</button>}
                </div>}
              </section>
              <div className="learn-next"><span>已制作课时 {deckIndex+1}/{medicalLessons.length}</span>{next&&<button className="learn-primary" onClick={()=>selectLesson(next)}>下一节：{next.zh} <ArrowRight size={14}/></button>}</div>
            </article>}
          </>}
        </section>
      </div>
    </div>
    <footer className="learn-footer">CPC ACADEMY · MEDICAL COURSE PILOT <span>依照《The Language of Medicine》第13版章节目录编排；讲解、案例和试题为独立创作的教育内容。请勿用于真实诊断或无审核索赔。</span></footer>
  </main>;
}
