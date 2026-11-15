"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity, ArrowRight, AudioLines, BookOpen, Brain, Check, ChevronDown,
  CircleHelp, Clock3, Flame, Headphones, Home, Layers3, ListChecks, Menu,
  Mic2, PencilLine, Play, RotateCcw, Search, Sparkles, Target, Volume2, X
} from "lucide-react";
import { MedicalWord, WordCategory, wordParts, words } from "@/lib/words";
import { emptyProgress, getTodayKey, loadProgress, saveProgress, StudyProgress } from "@/lib/progress";

type Tab = "home" | "words" | "listen" | "dictation" | "roots" | "progress";
type DictationMode = "word" | "meaning" | "definition" | "root" | "clinical";
const categories: ("All" | WordCategory)[] = ["All", "Foundations", "Body Systems", "Conditions", "Procedures", "Specialties"];

function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return false;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const voices = window.speechSynthesis.getVoices();
  const american = voices.find(v => v.lang.toLowerCase() === "en-us" && /natural|enhanced|us|american/i.test(v.name))
    || voices.find(v => v.lang.toLowerCase() === "en-us");
  if (american) utterance.voice = american;
  utterance.lang = "en-US";
  utterance.rate = 0.88;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
  return true;
}

function normalize(value: string) {
  return value.trim().toLowerCase().replace(/[.,!?;:]/g, "").replace(/\s+/g, " ");
}

export default function HomePage() {
  const [tab, setTab] = useState<Tab>("home");
  const [progress, setProgress] = useState<StudyProgress>(emptyProgress);
  const [ready, setReady] = useState(false);
  const [selected, setSelected] = useState<MedicalWord>(words[0]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [showChinese, setShowChinese] = useState(true);
  const [dictationMode, setDictationMode] = useState<DictationMode>("word");
  const [question, setQuestion] = useState<MedicalWord>(words[0]);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [listeningIndex, setListeningIndex] = useState(0);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    let saved = loadProgress();
    const today = getTodayKey();
    if (saved.dailyDate !== today) {
      const candidates = words.filter(w => !saved.knownIds.includes(w.id));
      saved = { ...saved, dailyDate: today, dailyIds: candidates.slice(0, 20).map(w => w.id) };
      saveProgress(saved);
    }
    setProgress(saved);
    setReady(true);
  }, []);

  const update = (next: StudyProgress) => {
    setProgress(next);
    saveProgress(next);
  };

  const dailyWords = useMemo(() => {
    const ids = progress.dailyIds.length ? progress.dailyIds : words.slice(0,20).map(w=>w.id);
    return ids.map(id=>words.find(w=>w.id===id)).filter((w): w is MedicalWord => Boolean(w));
  }, [progress.dailyIds]);

  const filteredWords = useMemo(() => words.filter(w => {
    const matchesQuery = !query || [w.term, w.meaning, w.definition, ...w.parts.map(p=>p.part)].join(" ").toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (category === "All" || w.category === category);
  }), [query, category]);

  const dueWords = useMemo(() => {
    const ids = new Set(progress.reviewIds);
    return words.filter(w=>ids.has(w.id));
  }, [progress.reviewIds]);

  const accuracy = progress.attempts ? Math.round(progress.correct / progress.attempts * 100) : 0;
  const studiedToday = dailyWords.filter(w=>progress.knownIds.includes(w.id)).length;

  const markKnown = (word: MedicalWord) => {
    update({ ...progress, knownIds: Array.from(new Set([...progress.knownIds, word.id])), reviewIds: progress.reviewIds.filter(id=>id!==word.id) });
  };
  const markReview = (word: MedicalWord) => {
    update({ ...progress, reviewIds: Array.from(new Set([...progress.reviewIds, word.id])) });
  };

  const nextQuestion = (mode = dictationMode) => {
    const pool = mode === "root" ? words.filter(w=>w.parts.length) : words;
    const next = pool[Math.floor(Math.random()*pool.length)];
    setQuestion(next);
    setAnswer("");
    setFeedback(null);
  };

  const promptFor = (word: MedicalWord, mode: DictationMode) => {
    if (mode === "word") return { label: "Listen and spell", prompt: "点击播放，听完后写出英文单词", expected: word.term };
    if (mode === "meaning") return { label: "Chinese → English", prompt: word.meaning, expected: word.term };
    if (mode === "definition") return { label: "Definition → Term", prompt: word.definition, expected: word.term };
    if (mode === "root") return { label: "Word parts → Term", prompt: word.parts.map(p=>p.part).join(" + "), expected: word.term };
    return { label: "Clinical sentence", prompt: word.exampleZh, expected: word.term };
  };

  const submitAnswer = () => {
    const expected = promptFor(question, dictationMode).expected;
    const correct = normalize(answer) === normalize(expected);
    setFeedback(correct ? "correct" : "wrong");
    update({ ...progress, attempts: progress.attempts+1, correct: progress.correct+(correct?1:0), reviewIds: correct ? progress.reviewIds.filter(id=>id!==question.id) : Array.from(new Set([...progress.reviewIds, question.id])) });
  };

  const navItems: { id: Tab; label: string; en: string; icon: typeof Home }[] = [
    { id:"home", label:"首页", en:"Today", icon:Home },
    { id:"words", label:"词汇库", en:"Vocabulary", icon:BookOpen },
    { id:"listen", label:"听力", en:"Listening", icon:Headphones },
    { id:"dictation", label:"默写", en:"Dictation", icon:PencilLine },
    { id:"roots", label:"词根", en:"Word Parts", icon:Layers3 },
    { id:"progress", label:"进度", en:"Progress", icon:Activity },
  ];

  const changeTab = (next: Tab) => { setTab(next); setMobileMenu(false); setFeedback(null); };

  if (!ready) return <main className="loading-screen"><div className="brand-mark">C</div><p>CPC Academy 正在加载…</p></main>;

  return (
    <main className="app-shell">
      <aside className={`sidebar ${mobileMenu ? "sidebar-open" : ""}`}>
        <div className="brand"><div className="brand-mark">C</div><div><strong>CPC Academy</strong><span>MEDICAL CODING PATHWAY</span></div></div>
        <div className="side-label">学习中心 · LEARNING</div>
        <nav className="side-nav">
          {navItems.map(item=>{ const Icon=item.icon; return <button key={item.id} className={`nav-item ${tab===item.id?"active":""}`} onClick={()=>changeTab(item.id)}><Icon size={19}/><span>{item.label}<small>{item.en}</small></span>{tab===item.id&&<span className="nav-dot"/>}</button>; })}
        </nav>
        <div className="sidebar-bottom"><div className="daily-mini"><div className="daily-mini-icon"><Target size={18}/></div><div><b>每日目标</b><span>20 new words</span></div><strong>{studiedToday}/20</strong></div><div className="sidebar-foot">CPC Academy <span>V0.1 · Vocabulary</span></div></div>
      </aside>

      {mobileMenu && <button aria-label="关闭菜单" className="scrim" onClick={()=>setMobileMenu(false)}/>}

      <section className="main-area">
        <header className="topbar">
          <button className="icon-button mobile-only" onClick={()=>setMobileMenu(!mobileMenu)} aria-label="打开菜单"><Menu size={21}/></button>
          <div className="breadcrumb">CPC Academy <span>/</span> {navItems.find(n=>n.id===tab)?.en}</div>
          <div className="top-actions"><span className="language-pill">中 / EN</span><div className="avatar">E</div></div>
        </header>

        {tab==="home" && <div className="page-content">
          <div className="welcome-row"><div><div className="eyebrow"><Sparkles size={14}/> YOUR DAILY STUDY PLAN</div><h1>今天继续积累专业词汇。</h1><p>Build medical English, one term at a time.</p></div><div className="date-chip"><Clock3 size={15}/>{new Intl.DateTimeFormat("zh-CN",{month:"long",day:"numeric",weekday:"short"}).format(new Date())}</div></div>
          <div className="hero-card"><div className="hero-copy"><span className="hero-kicker">CPC ACADEMY · VOCABULARY</span><h2>Medical terminology<br/><em>starts here.</em></h2><p>医学术语 · 美式发音 · 听力默写 · 词根拆解</p><button className="primary-button" onClick={()=>changeTab("words")}>开始今日学习 <ArrowRight size={17}/></button></div><div className="hero-art"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="hero-cross">+</div><div className="hero-word">cardi<span>/</span>o</div><div className="hero-caption">HEART · 心脏</div></div></div>
          <div className="stats-grid"><div className="stat-card"><div className="stat-icon purple"><BookOpen size={18}/></div><span>已掌握词汇</span><strong>{progress.knownIds.length}<small> / {words.length}</small></strong><div className="stat-note">Words learned</div></div><div className="stat-card"><div className="stat-icon orange"><Flame size={18}/></div><span>待复习</span><strong>{dueWords.length}</strong><div className="stat-note">Words to review</div></div><div className="stat-card"><div className="stat-icon green"><Target size={18}/></div><span>今日新词</span><strong>{studiedToday}<small> / 20</small></strong><div className="stat-note">Daily target</div></div><div className="stat-card"><div className="stat-icon blue"><Activity size={18}/></div><span>练习正确率</span><strong>{accuracy}<small>%</small></strong><div className="stat-note">Practice accuracy</div></div></div>
          <div className="section-heading"><div><h3>今日学习任务</h3><p>Today&apos;s learning tasks</p></div><span className="section-link">{studiedToday}/20 completed</span></div>
          <div className="task-grid"><button className="task-card" onClick={()=>changeTab("words")}><div className="task-top"><div className="task-icon purple"><BookOpen size={20}/></div><span className="task-time">20–25 min</span></div><h4>学习 20 个新单词</h4><p>词义、英文定义、例句与词根</p><div className="task-progress"><span style={{width:`${Math.min(100,studiedToday/20*100)}%`}}/></div><div className="task-foot">{studiedToday} / 20 <ArrowRight size={16}/></div></button><button className="task-card" onClick={()=>changeTab("listen")}><div className="task-top"><div className="task-icon blue"><Headphones size={20}/></div><span className="task-time">10 min</span></div><h4>医学英语听力</h4><p>听辨医学术语，熟悉美式发音</p><div className="task-foot">开始训练 <ArrowRight size={16}/></div></button><button className="task-card" onClick={()=>changeTab("dictation")}><div className="task-top"><div className="task-icon orange"><PencilLine size={20}/></div><span className="task-time">15 min</span></div><h4>听音与拼写默写</h4><p>听单词、辨词根、练习准确拼写</p><div className="task-foot">开始训练 <ArrowRight size={16}/></div></button></div>
          <div className="section-heading"><div><h3>今日单词预览</h3><p>Daily vocabulary preview</p></div><button className="text-button" onClick={()=>changeTab("words")}>查看全部 <ArrowRight size={15}/></button></div>
          <div className="word-preview">{dailyWords.slice(0,5).map(w=><button key={w.id} className="preview-row" onClick={()=>{setSelected(w);changeTab("words");}}><span className="word-initial">{w.term[0].toUpperCase()}</span><span className="preview-term"><b>{w.term}</b><small>{w.definition}</small></span><span className="preview-zh">{w.meaning}</span><ChevronDown className="rotate-icon" size={17}/></button>)}</div>
        </div>}

        {tab==="words" && <div className="page-content">
          <div className="page-title-row"><div><div className="eyebrow">MEDICAL TERMINOLOGY</div><h1>医学词汇库</h1><p>Search, study and master medical terms.</p></div><div className="count-chip">{words.length} TERMS</div></div>
          <div className="vocab-layout"><div className="vocab-list-panel"><div className="search-box"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="搜索英文、中文、词根…" /><span>{filteredWords.length}</span></div><div className="category-scroll">{categories.map(c=><button key={c} onClick={()=>setCategory(c)} className={category===c?"filter-active":""}>{c==="All"?"全部":c}</button>)}</div><div className="vocab-list">{filteredWords.map(w=><button key={w.id} className={`vocab-row ${selected.id===w.id?"selected":""}`} onClick={()=>setSelected(w)}><span className="word-initial">{w.term[0].toUpperCase()}</span><span className="vocab-row-text"><b>{w.term}</b><small>{w.meaning}</small></span><span className="row-status">{progress.knownIds.includes(w.id)?<Check size={16}/>:<span/>}</span></button>)}{filteredWords.length===0&&<div className="empty-state">没有找到匹配词汇。<br/>Try another search.</div>}</div></div>
          <div className="word-detail"><div className="detail-top"><span className="detail-category">{selected.category}</span><button className="speaker-button" onClick={()=>speak(selected.term)}><Volume2 size={18}/> 听美式发音</button></div><div className="detail-term">{selected.term}</div><div className="detail-meaning">{selected.meaning}</div><div className="detail-definition"><span>ENGLISH DEFINITION</span><p>{selected.definition}</p></div><div className="detail-block"><div className="block-label">WORD PARTS <span>词根拆解</span></div><div className="parts-row">{selected.parts.map((p,i)=><div className="part-chip" key={i}><b>{p.part}</b><small>{p.meaning}</small></div>)}</div></div><div className="detail-block"><div className="block-label">CLINICAL EXAMPLE <span>医学例句</span></div><p className="example-en">{selected.example}</p><p className="example-zh">{selected.exampleZh}</p><button className="inline-audio" onClick={()=>speak(selected.example)}><Volume2 size={15}/> 播放例句</button></div><div className="detail-actions"><button className="secondary-button" onClick={()=>markReview(selected)}><RotateCcw size={16}/> 加入复习</button><button className="primary-button" onClick={()=>markKnown(selected)}><Check size={17}/> 我已掌握</button></div><p className="detail-footnote">发音由设备浏览器的 en-US 语音合成提供；实际音色取决于设备可用语音。</p></div></div>
        </div>}

        {tab==="listen" && <div className="page-content narrow-content">
          <div className="page-title-row"><div><div className="eyebrow">LISTENING PRACTICE</div><h1>医学英语听力</h1><p>Listen carefully and identify the medical term.</p></div><div className="count-chip">US ENGLISH</div></div>
          <div className="practice-card"><div className="practice-progress"><span>LISTENING · {listeningIndex+1}</span><span>{listeningIndex+1} / 10</span></div><div className="sound-visual"><div className="sound-orb"><AudioLines size={36}/></div><div className="sound-rings"/></div><h2>听一听，你听到了什么？</h2><p>点击播放按钮，仔细听清医学单词的发音。</p><button className="play-button" onClick={()=>speak(words[listeningIndex%words.length].term)}><Play size={20} fill="currentColor"/> 播放单词</button><div className="listen-hint">American English · en-US</div><div className="practice-divider"/><div className="listen-answer"><label>你听到的单词是什么？</label><input value={answer} onChange={e=>{setAnswer(e.target.value);setFeedback(null);}} onKeyDown={e=>e.key==="Enter"&&setFeedback(normalize(answer)===normalize(words[listeningIndex%words.length].term)?"correct":"wrong")} placeholder="Type the medical term…" /><button className="primary-button full-button" onClick={()=>{const ok=normalize(answer)===normalize(words[listeningIndex%words.length].term);setFeedback(ok?"correct":"wrong");update({...progress,attempts:progress.attempts+1,correct:progress.correct+(ok?1:0)});}}>检查答案</button>{feedback&&<div className={`feedback ${feedback}`}>{feedback==="correct"?"✓ 正确！Great listening.":`正确答案：${words[listeningIndex%words.length].term}`}</div>}<button className="next-button" onClick={()=>{setListeningIndex(i=>i+1);setAnswer("");setFeedback(null);}}>下一题 <ArrowRight size={16}/></button></div></div>
        </div>}

        {tab==="dictation" && <div className="page-content narrow-content">
          <div className="page-title-row"><div><div className="eyebrow">ACTIVE RECALL TRAINING</div><h1>听力与默写</h1><p>Practice spelling, meaning, roots and clinical context.</p></div><div className="count-chip">5 MODES</div></div>
          <div className="mode-tabs">{([{id:"word",label:"听音拼写"},{id:"meaning",label:"中文释义"},{id:"definition",label:"英文定义"},{id:"root",label:"词根组合"},{id:"clinical",label:"临床语境"}] as {id:DictationMode;label:string}[]).map(m=><button key={m.id} className={dictationMode===m.id?"mode-active":""} onClick={()=>{setDictationMode(m.id);nextQuestion(m.id);}}>{m.label}</button>)}</div>
          <div className="practice-card dictation-card"><div className="practice-progress"><span>{promptFor(question,dictationMode).label.toUpperCase()}</span><button className="quiet-button" onClick={()=>nextQuestion()}><RotateCcw size={15}/> 换一题</button></div>{dictationMode==="word"?<><div className="dictation-symbol"><Headphones size={30}/></div><h2>听发音，写出单词</h2><p>点击播放按钮，听完后输入完整的医学术语。</p><button className="play-button" onClick={()=>speak(question.term)}><Volume2 size={19}/> 播放发音</button></>:<><div className="prompt-label">{dictationMode==="meaning"?"CHINESE MEANING":dictationMode==="definition"?"ENGLISH DEFINITION":dictationMode==="root"?"WORD PARTS":"CLINICAL CONTEXT"}</div><div className="dictation-prompt">{promptFor(question,dictationMode).prompt}</div></>}<div className="listen-answer"><label>请输入英文医学术语</label><input value={answer} onChange={e=>{setAnswer(e.target.value);setFeedback(null);}} onKeyDown={e=>e.key==="Enter"&&submitAnswer()} placeholder="Type your answer…" /><button className="primary-button full-button" onClick={submitAnswer} disabled={!answer.trim()}>提交答案 <Check size={16}/></button>{feedback&&<div className={`feedback ${feedback}`}>{feedback==="correct"?"✓ 正确！Well done.":`再记一下：${question.term} — ${question.meaning}`}</div>}</div><div className="answer-hint"><CircleHelp size={15}/> 拼写需完整匹配；大小写和多余空格不影响判分。</div></div>
        </div>}

        {tab==="roots" && <div className="page-content">
          <div className="page-title-row"><div><div className="eyebrow">WORD BUILDING BLOCKS</div><h1>词根与词缀</h1><p>Understand how medical terms are constructed.</p></div><div className="count-chip">{wordParts.length} PARTS</div></div>
          <div className="roots-intro"><div className="roots-icon"><Brain size={25}/></div><div><b>拆解医学术语的构成</b><p>掌握常见 combining forms、prefixes 和 suffixes，帮助你理解陌生医学词汇。</p></div></div>
          <div className="roots-grid">{wordParts.map((p,i)=><div className="root-card" key={i}><span className="root-index">{String(i+1).padStart(2,"0")}</span><b>{p.part}</b><span>{p.meaning}</span><button onClick={()=>speak(p.part.replaceAll("/"," "))}><Volume2 size={14}/> 听发音</button></div>)}</div>
        </div>}

        {tab==="progress" && <div className="page-content">
          <div className="page-title-row"><div><div className="eyebrow">YOUR LEARNING ANALYTICS</div><h1>学习进度</h1><p>Track your vocabulary growth and practice accuracy.</p></div><div className="count-chip">LOCAL DATA</div></div>
          <div className="progress-overview"><div className="progress-ring" style={{background:`conic-gradient(#6759d8 ${words.length?progress.knownIds.length/words.length*360:0}deg,#e9eaf1 0deg)`}}><div><b>{Math.round(progress.knownIds.length/words.length*100)}%</b><span>掌握率</span></div></div><div className="progress-copy"><h2>持续学习，逐步建立词汇基础。</h2><p>你的学习记录保存在当前设备浏览器中。</p><div className="progress-metrics"><span><b>{progress.knownIds.length}</b> 已掌握</span><span><b>{dueWords.length}</b> 待复习</span><span><b>{progress.attempts}</b> 总练习</span><span><b>{accuracy}%</b> 正确率</span></div></div></div>
          <div className="section-heading"><div><h3>需要加强的词汇</h3><p>Review queue</p></div><span className="section-link">{dueWords.length} terms</span></div>
          <div className="word-preview">{dueWords.length?dueWords.map(w=><button key={w.id} className="preview-row" onClick={()=>{setSelected(w);changeTab("words");}}><span className="word-initial"><RotateCcw size={16}/></span><span className="preview-term"><b>{w.term}</b><small>{w.definition}</small></span><span className="preview-zh">{w.meaning}</span><ArrowRight size={16}/></button>):<div className="empty-state">目前没有待复习词汇。完成练习后，答错的词会自动加入这里。</div>}</div>
          <button className="reset-button" onClick={()=>{if(window.confirm("确定清空本设备上的 CPC Academy 学习记录吗？")){update(emptyProgress);}}}>清空本地学习记录</button>
        </div>}
        <footer className="page-footer">CPC ACADEMY <span>·</span> PERSONAL STUDY EDITION <span>·</span> V0.1</footer>
      </section>

      <nav className="mobile-nav">{navItems.slice(0,5).map(item=>{const Icon=item.icon;return <button key={item.id} className={tab===item.id?"mobile-active":""} onClick={()=>changeTab(item.id)}><Icon size={19}/><span>{item.label}</span></button>;})}</nav>
    </main>
  );
}
