"use client";

import {useEffect,useMemo,useRef,useState} from "react";
import Link from "next/link";
import {ArrowLeft,ArrowRight,BookOpen,CheckCircle2,ChevronRight,ClipboardCheck,Clock3,FileText,GraduationCap,Volume2} from "lucide-react";
import {chapters} from "@/lib/cpc-curriculum";
import {words} from "@/lib/book-words";
import {medicalLessons,lessonsForChapter,type MedicalLesson,type MedicalDiagram} from "@/lib/cpc-medical-lessons";
import PronunciationFeedback from "@/components/pronunciation-feedback";
import AdvancedMedicalDiagram from "./advanced-diagrams";
import TextbookFigure from "@/components/textbook-figure";
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

  if(kind==="nervous")return <div className="learn-anatomy-board">
    <div className="learn-anatomy-heading"><b>神经系统 · CNS / PNS</b><span>结构关联概念图</span></div>
    <svg viewBox="0 0 640 270" role="img" aria-label="中枢与周围神经系统的连接示意">
      <defs><linearGradient id="nerveShade" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#e8e1ff"/><stop offset="100%" stopColor="#d3defd"/></linearGradient></defs>
      <path d="M88 79Q85 50 116 38Q142 16 171 39Q204 35 210 69Q222 92 201 109L166 120L116 114Q91 106 88 79Z" fill="url(#nerveShade)" stroke="#8877c6" strokeWidth="2"/>
      <path d="M143 48Q128 65 143 78Q157 90 145 110 M174 45Q159 63 179 78Q189 93 176 107" fill="none" stroke="#8877c6" strokeWidth="2"/>
      <path d="M157 120V227" stroke="#6d5bb3" strokeWidth="13" strokeLinecap="round"/>
      <path d="M157 153L109 179M157 174L206 195M157 197L109 224" stroke="#9b91cc" strokeWidth="5" strokeLinecap="round"/>
      <circle cx="157" cy="94" r="10" fill="#8275cb"/><circle cx="157" cy="153" r="8" fill="#8275cb"/>
      <path d="M218 75H304M171 191H304M218 205H304" stroke="#a3a0c1" strokeWidth="1.5" strokeDasharray="4 5"/>
      <text x="315" y="79" fontSize="17" fontWeight="700" fill="#444777">Brain · 脑</text>
      <text x="315" y="99" fontSize="12" fill="#787e97">中枢神经系统 CNS</text>
      <text x="315" y="192" fontSize="17" fontWeight="700" fill="#444777">Spinal cord · 脊髓</text>
      <text x="315" y="212" fontSize="12" fill="#787e97">中枢神经系统 CNS</text>
      <text x="315" y="240" fontSize="13" fill="#6656b8">Peripheral nerves · 周围神经分支</text>
    </svg>
    <p>概念示意：脑和脊髓属于中枢神经系统，外周分布的神经属于周围神经系统；并非按真实比例绘制。</p>
  </div>;
  if(kind==="heart")return <div className="learn-anatomy-board">
    <div className="learn-anatomy-heading"><b>血液流经心脏与肺 · 双循环</b><span>结构关系图</span></div>
    <svg viewBox="0 0 640 255" role="img" aria-label="右心、肺、左心与体循环血流方向">
      <rect x="28" y="84" width="130" height="80" rx="15" fill="#dce4ff" stroke="#8394d4" strokeWidth="2"/>
      <text x="93" y="113" textAnchor="middle" fontSize="18" fontWeight="800" fill="#415a99">右心</text>
      <text x="93" y="135" textAnchor="middle" fontSize="12" fill="#415a99">RA → RV</text>
      <text x="93" y="152" textAnchor="middle" fontSize="10" fill="#6f7baa">向肺泵血</text>
      <rect x="252" y="84" width="130" height="80" rx="15" fill="#e7f3f2" stroke="#75b4b3" strokeWidth="2"/>
      <text x="317" y="113" textAnchor="middle" fontSize="18" fontWeight="800" fill="#377f81">肺</text>
      <text x="317" y="135" textAnchor="middle" fontSize="12" fill="#377f81">Lungs</text>
      <text x="317" y="152" textAnchor="middle" fontSize="10" fill="#5b999a">气体交换</text>
      <rect x="477" y="84" width="130" height="80" rx="15" fill="#ffe2e5" stroke="#d48c97" strokeWidth="2"/>
      <text x="542" y="113" textAnchor="middle" fontSize="18" fontWeight="800" fill="#a65767">左心</text>
      <text x="542" y="135" textAnchor="middle" fontSize="12" fill="#a65767">LA → LV</text>
      <text x="542" y="152" textAnchor="middle" fontSize="10" fill="#b3747d">向身体泵血</text>
      <path d="M160 124H245 M384 124H470" fill="none" stroke="#8d82c7" strokeWidth="5" strokeLinecap="round"/>
      <path d="M236 115L247 124L236 133 M460 115L472 124L460 133" fill="none" stroke="#8d82c7" strokeWidth="3" strokeLinecap="round"/>
      <text x="210" y="106" textAnchor="middle" fontSize="11" fill="#707c9a">肺动脉</text>
      <text x="429" y="106" textAnchor="middle" fontSize="11" fill="#ad7386">肺静脉</text>
      <path d="M542 169V219H93V169" fill="none" stroke="#b78b9f" strokeWidth="4" strokeLinecap="round" strokeDasharray="7 6"/>
      <text x="318" y="209" textAnchor="middle" fontSize="13" fontWeight="700" fill="#9f738a">体循环：左心 → 全身 → 右心</text>
      <text x="320" y="31" textAnchor="middle" fontSize="16" fontWeight="700" fill="#6557b2">Pulmonary circulation · 肺循环</text>
    </svg>
    <p>RA 右心房、RV 右心室、LA 左心房、LV 左心室。此图强调血流方向，不按真实解剖形态及比例绘制。</p>
  </div>;
  if(kind==="respiratory")return <div className="learn-anatomy-board">
    <div className="learn-anatomy-heading"><b>呼吸道与肺泡 · Respiratory</b><span>气流路径图</span></div>
    <svg viewBox="0 0 640 270" role="img" aria-label="从鼻咽、气管、左右支气管到肺泡的呼吸通路">
      <rect x="274" y="28" width="94" height="43" rx="13" fill="#efeaff" stroke="#998aca"/>
      <text x="321" y="45" textAnchor="middle" fontSize="13" fill="#6555ac">Nose / mouth</text>
      <text x="321" y="61" textAnchor="middle" fontSize="12" fill="#6555ac">鼻 / 口</text>
      <path d="M321 72V147" stroke="#a3a7cb" strokeWidth="15" strokeLinecap="round"/>
      {[90,110,130].map(y=><path key={y} d={"M314 "+y+"H328"} stroke="#edf0fb" strokeWidth="3"/>)}
      <path d="M321 144L214 181 M321 144L429 181" stroke="#a3a7cb" strokeWidth="12" strokeLinecap="round"/>
      <path d="M216 181L175 199 M216 181L231 217 M429 181L468 199 M429 181L405 217" stroke="#a3a7cb" strokeWidth="5" strokeLinecap="round"/>
      <path d="M154 141Q117 165 139 233Q166 249 238 236Q258 204 252 160Q217 126 180 148Z" fill="#e0edfa" stroke="#91a8d8" strokeWidth="2"/>
      <path d="M490 141Q527 165 505 233Q478 249 406 236Q386 204 392 160Q427 126 464 148Z" fill="#e0edfa" stroke="#91a8d8" strokeWidth="2"/>
      <path d="M321 145L214 181 M321 145L429 181" stroke="#a3a7cb" strokeWidth="10" strokeLinecap="round"/>
      <circle cx="214" cy="195" r="13" fill="#becdeb" stroke="#879dd0"/><circle cx="429" cy="195" r="13" fill="#becdeb" stroke="#879dd0"/>
      <text x="104" y="73" textAnchor="middle" fontSize="14" fontWeight="700" fill="#566392">Alveoli · 肺泡</text>
      {[71,93,115].map(x=><circle key={x} cx={x} cy="107" r="13" fill="#f6d9df" stroke="#cd93a4"/>)}
      <path d="M138 118L185 161" stroke="#be9dad" strokeDasharray="5 5" strokeWidth="2"/>
      <text x="385" y="108" fontSize="14" fontWeight="700" fill="#566392">Trachea · 气管</text>
      <text x="325" y="264" textAnchor="middle" fontSize="12" fill="#737d99">Bronchi · 支气管 → bronchioles · 细支气管 → alveoli · 肺泡</text>
    </svg><p>肺泡位于更远端的细支气管通路终末区域。示意图用于理解结构与路径，不代表医学影像。</p>
  </div>;
  if(kind==="blood")return <div className="learn-anatomy-board">
    <div className="learn-anatomy-heading"><b>血液组成 · Blood Components</b><span>血细胞概念图</span></div>
    <svg viewBox="0 0 640 235" role="img" aria-label="血浆、红细胞、白细胞及血小板示意">
      <rect x="24" y="30" width="591" height="174" rx="17" fill="#fbf7f3" stroke="#e2d8d6"/>
      {[[102,96],[142,141],[190,96],[224,151]].map(([x,y],i)=><g key={i}><ellipse cx={x} cy={y} rx="24" ry="16" fill="#e99a9d" stroke="#bf6972" strokeWidth="2"/><ellipse cx={x} cy={y} rx="10" ry="6" fill="#eec1c3"/></g>)}
      <circle cx="347" cy="119" r="31" fill="#dfd9ef" stroke="#9b91c4" strokeWidth="2"/>
      <path d="M329 119Q347 90 358 113Q375 136 345 143Q326 140 329 119" fill="#a29ac6"/>
      {[465,488,508,475].map((x,i)=><circle key={i} cx={x} cy={90+(i%2)*38} r="7" fill="#e2d0a0" stroke="#c4a467"/>)}
      <path d="M134 54V75M347 53V85M490 57V82" stroke="#a6a4b5" strokeWidth="1.5"/>
      <text x="134" y="46" textAnchor="middle" fontSize="15" fill="#a45b64" fontWeight="700">RBC · 红细胞</text>
      <text x="347" y="46" textAnchor="middle" fontSize="15" fill="#605694" fontWeight="700">WBC · 白细胞</text>
      <text x="490" y="46" textAnchor="middle" fontSize="15" fill="#a68138" fontWeight="700">Platelets</text>
      <text x="490" y="61" textAnchor="middle" fontSize="12" fill="#a68138">血小板</text>
      <text x="320" y="189" textAnchor="middle" fontSize="13" fill="#876d60">Plasma · 血浆（液体部分）</text>
    </svg><p>示意中放大了细胞及血小板的外观，大小比例并非真实。CBC 是对这些血细胞相关参数的实验室检测。</p>
  </div>;
  if(kind==="immune")return <div className="learn-anatomy-board">
    <div className="learn-anatomy-heading"><b>淋巴与免疫系统 · Lymph & Immune</b><span>流动与防御关系图</span></div>
    <svg viewBox="0 0 640 238" role="img" aria-label="组织液回流、淋巴管、淋巴结、淋巴细胞及静脉回流">
      <rect x="21" y="77" width="132" height="84" rx="13" fill="#e8f2fc" stroke="#a2bbdb"/>
      <text x="87" y="111" textAnchor="middle" fontSize="15" fontWeight="700" fill="#5477a0">组织间液</text>
      <text x="87" y="136" textAnchor="middle" fontSize="12" fill="#5477a0">Interstitial fluid</text>
      <rect x="194" y="77" width="132" height="84" rx="13" fill="#e9f4e9" stroke="#93ba98"/>
      <text x="260" y="111" textAnchor="middle" fontSize="15" fontWeight="700" fill="#4f8960">淋巴管</text>
      <text x="260" y="136" textAnchor="middle" fontSize="12" fill="#4f8960">Lymphatic vessel</text>
      <rect x="367" y="77" width="132" height="84" rx="13" fill="#e9e5fa" stroke="#a89ccf"/>
      <text x="433" y="111" textAnchor="middle" fontSize="15" fontWeight="700" fill="#6652aa">淋巴结</text>
      <text x="433" y="136" textAnchor="middle" fontSize="12" fill="#6652aa">Lymph node</text>
      <path d="M156 119H187 M329 119H360 M501 119H568" stroke="#8c88bd" strokeWidth="3" strokeLinecap="round"/>
      {[187,360,568].map(x=><path key={x} d={"M"+(x-10)+" 111L"+x+" 119L"+(x-10)+" 127"} fill="none" stroke="#8c88bd" strokeWidth="2.5"/>)}
      <text x="564" y="103" textAnchor="middle" fontSize="13" fontWeight="700" fill="#6b5daf">静脉回流</text>
      <text x="564" y="142" textAnchor="middle" fontSize="10" fill="#87819e">Venous return</text>
      <text x="320" y="40" textAnchor="middle" fontSize="14" fontWeight="700" fill="#665caa">免疫细胞识别和防御在淋巴组织中进行</text>
      <rect x="170" y="193" width="300" height="26" rx="13" fill="#f0edfb"/>
      <text x="320" y="211" textAnchor="middle" fontSize="12" fill="#665caa">B cells · T cells · Antibodies</text>
    </svg><p>简化的淋巴回流和免疫参与模型；不表示全部实际淋巴路径或淋巴器官位置。</p>
  </div>;
  if(["skeletal","skin","sense-eye","sense-ear","endocrine","oncology","radiology","pharma","psychiatry"].includes(kind))return <AdvancedMedicalDiagram kind={kind}/>;
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
      <span className="learn-beta">已制作课程</span>
    </header>
    <div className="learn-container">
      <section className="learn-banner">
        <span><GraduationCap size={15}/> MEDICAL LEARNING PATHWAY</span>
        <h1>医学课程，从第一章开始。</h1>
        <p>按照原书22章的顺序学习。每节已制作课程包含原创讲解、医学术语、临床案例和知识检测。</p>
        <div className="learn-banner-stats"><b>{mastered} / {medicalLessons.length}</b> 医学课程已通过</div>
        <div className="learn-addon-links"><Link href={"/cpc/knowledge/?chapter="+chapterNo}>查看本章知识点与A/B/C优先级</Link><Link href={"/cpc/textbook/?chapter="+chapterNo}>打开教材图谱与PDF</Link></div>
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
              <section className="learn-block"><TextbookFigure key={lesson.id} chapter={chapterNo} lesson={lesson}/></section>
              <section className="learn-block"><h4><BookOpen size={17}/> 医学术语</h4>
                <div className="learn-term-grid">{lesson.terminology.map(item=>{
                  const available=words.some(w=>w.term.toLowerCase()===item.term.toLowerCase());
                  return <div className="learn-term" key={item.term}>
                    <div><b>{item.term}</b><span>{item.zh}</span></div><p>{item.note}</p>
                    {available&&<button onClick={()=>playTerm(item.term)} aria-label={"朗读"+item.term}><Volume2 size={15}/></button>}
                    {available&&<PronunciationFeedback term={item.term} compact/>}
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
              <section className="learn-block learn-coding-bridge">
                <h4><ClipboardCheck size={17}/> 对接 CPC 专业编码</h4>
                <p>{chapter.codingConnection}</p>
                <Link href="/cpc/coding/" className="learn-secondary">进入专业编码课程 <ChevronRight size={15}/></Link>
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
