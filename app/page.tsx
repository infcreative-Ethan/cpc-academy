"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity, ArrowRight, AudioLines, BookOpen, Brain, Check, ChevronDown, Download,
  CircleHelp, Clock3, Flame, Headphones, Home, Layers3, ListChecks, Menu,
  Mic2, PencilLine, Play, Repeat2, RotateCcw, Search, Sparkles, Target, Volume2, X
} from "lucide-react";
import { MedicalWord, WordCategory } from "@/lib/words";
import { wordParts, words } from "@/lib/book-words";
import { emptyProgress, getTodayKey, loadProgress, saveProgress, StudyProgress } from "@/lib/progress";

type Tab = "home" | "words" | "review" | "listen" | "dictation" | "roots" | "progress";
type DictationMode = "word" | "meaning" | "definition" | "root" | "clinical";
const categories: ("All" | WordCategory)[] = ["All", "Foundations", "Body Systems", "Conditions", "Procedures", "Specialties"];
const APP_VERSION = "0.2.1";

type AudioStatus = { message: string; kind: "info" | "success" | "error" };

function setAudioStatus(message: string, kind: AudioStatus["kind"] = "info") {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent<AudioStatus>("cpc-audio-status", { detail: { message, kind } }));
  }
}

async function speak(text: string, rate = 0.88): Promise<boolean> {
  if (typeof window === "undefined" || !text.trim()) return false;
  try {
    const { Capacitor } = await import("@capacitor/core");
    if (Capacitor.isNativePlatform()) {
      const { TextToSpeech, QueueStrategy } = await import("@capacitor-community/text-to-speech");
      await TextToSpeech.stop().catch(() => undefined);
      const language = await TextToSpeech.isLanguageSupported({ lang: "en-US" }).catch(() => ({ supported: true }));
      if (!language.supported) {
        await TextToSpeech.openInstall().catch(() => undefined);
        throw new Error("设备尚未提供 en-US 美式英语语音数据。请在刚打开的 Android 语音数据页面安装 English (United States)，再返回重试。");
      }
      await TextToSpeech.speak({
        text,
        lang: "en-US",
        rate,
        pitch: 1,
        volume: 1,
        queueStrategy: QueueStrategy.Flush,
      });
      setAudioStatus("已调用 Android 原生语音引擎播放美式英语。", "success");
      return true;
    }

    if (!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") {
      throw new Error("当前浏览器没有可用的语音合成功能。");
    }
    const synthesis = window.speechSynthesis;
    synthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = synthesis.getVoices();
    const american = voices.find(v => v.lang.toLowerCase() === "en-us")
      || voices.find(v => v.lang.toLowerCase().startsWith("en-us"));
    if (american) utterance.voice = american;
    utterance.lang = "en-US";
    utterance.rate = rate;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.onstart = () => setAudioStatus("正在播放美式英语发音。", "success");
    utterance.onend = () => setAudioStatus("播放完成。", "info");
    utterance.onerror = event => setAudioStatus(`浏览器语音播放失败：${event.error || "语音引擎无响应"}。请检查设备语音服务和媒体音量。`, "error");
    synthesis.speak(utterance);
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : "未知语音错误";
    setAudioStatus(`发音无法播放：${message}`, "error");
    return false;
  }
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
  const [reviewRounds, setReviewRounds] = useState(3);
  const [reviewSessionIds, setReviewSessionIds] = useState<string[]>([]);
  const [reviewActive, setReviewActive] = useState(false);
  const [reviewFinished, setReviewFinished] = useState(false);
  const [reviewRound, setReviewRound] = useState(1);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [reviewAnswer, setReviewAnswer] = useState("");
  const [reviewFeedback, setReviewFeedback] = useState<"correct" | "wrong" | null>(null);
  const [reviewCorrect, setReviewCorrect] = useState(0);
  const [reviewAttempts, setReviewAttempts] = useState(0);
  const [reviewRoundResults, setReviewRoundResults] = useState<{round:number;correct:number;total:number}[]>([]);
  const [checkingUpdate, setCheckingUpdate] = useState(false);
  const [updateInfo, setUpdateInfo] = useState<{message:string;url?:string}|null>(null);
  const [audioInfo, setAudioInfo] = useState<AudioStatus | null>(null);

  useEffect(() => {
    const handleAudioStatus = (event: Event) => {
      setAudioInfo((event as CustomEvent<AudioStatus>).detail);
    };
    window.addEventListener("cpc-audio-status", handleAudioStatus);
    return () => window.removeEventListener("cpc-audio-status", handleAudioStatus);
  }, []);

  useEffect(() => {
    let saved = loadProgress();
    const today = getTodayKey();
    if (saved.dailyDate !== today) {
      const candidates = words.filter(w => !saved.knownIds.includes(w.id));
      saved = { ...saved, dailyDate: today, dailyIds: candidates.slice(0, 20).map(w => w.id) };
      saveProgress(saved);
    }
    setProgress(saved);
    setReviewRounds(saved.reviewRounds ?? 3);
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

  const reviewPool = useMemo(() => {
    const ids = reviewSessionIds.length ? reviewSessionIds : [...new Set([...progress.dailyIds, ...progress.reviewIds])];
    const pool = ids.map(id => words.find(w => w.id === id)).filter((w): w is MedicalWord => Boolean(w));
    return pool.length ? pool : dailyWords;
  }, [reviewSessionIds, progress.dailyIds, progress.reviewIds, dailyWords]);
  const currentReviewWord = reviewPool[reviewIndex];

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
    if (mode === "meaning") return { label: "Chinese → English", prompt: word.meaning || word.definition, expected: word.term };
    if (mode === "definition") return { label: "Definition → Term", prompt: word.definition, expected: word.term };
    if (mode === "root") return { label: "Word parts → Term", prompt: word.parts.map(p=>p.part).join(" + "), expected: word.term };
    return { label: "Clinical sentence", prompt: word.exampleZh || word.definition, expected: word.term };
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
    { id:"review", label:"复习", en:"Review Rounds", icon:Repeat2 },
    { id:"listen", label:"听力", en:"Listening", icon:Headphones },
    { id:"dictation", label:"默写", en:"Dictation", icon:PencilLine },
    { id:"roots", label:"词根", en:"Word Parts", icon:Layers3 },
    { id:"progress", label:"进度", en:"Progress", icon:Activity },
  ];

  const changeTab = (next: Tab) => { setTab(next); setMobileMenu(false); setFeedback(null); };

  const chooseReviewRounds = (rounds: number) => {
    setReviewRounds(rounds);
    update({ ...progress, reviewRounds: rounds });
  };

  const startReview = () => {
    setReviewSessionIds(reviewPool.map(word => word.id));
    setReviewActive(true);
    setReviewFinished(false);
    setReviewRound(1);
    setReviewIndex(0);
    setReviewAnswer("");
    setReviewFeedback(null);
    setReviewCorrect(0);
    setReviewAttempts(0);
    setReviewRoundResults([]);
    changeTab("review");
  };

  const submitReviewAnswer = () => {
    if (!currentReviewWord || !reviewAnswer.trim() || reviewFeedback) return;
    const correct = normalize(reviewAnswer) === normalize(currentReviewWord.term);
    setReviewFeedback(correct ? "correct" : "wrong");
    setReviewAttempts(value => value + 1);
    if (correct) setReviewCorrect(value => value + 1);
    update({
      ...progress,
      attempts: progress.attempts + 1,
      correct: progress.correct + (correct ? 1 : 0),
      reviewIds: correct
        ? progress.reviewIds.filter(id => id !== currentReviewWord.id)
        : Array.from(new Set([...progress.reviewIds, currentReviewWord.id])),
    });
  };

  const advanceReview = () => {
    if (!reviewFeedback) return;
    if (reviewIndex + 1 < reviewPool.length) {
      setReviewIndex(value => value + 1);
      setReviewAnswer("");
      setReviewFeedback(null);
      return;
    }
    const date = getTodayKey();
    const result = { date, round: reviewRound, correct: reviewCorrect, total: reviewAttempts };
    const results = [...reviewRoundResults, { round: reviewRound, correct: reviewCorrect, total: reviewAttempts }];
    setReviewRoundResults(results);
    update({
      ...progress,
      reviewHistory: [...progress.reviewHistory.filter(item => !(item.date === date && item.round === reviewRound)), result].slice(-200),
    });
    if (reviewRound >= reviewRounds) {
      setReviewActive(false);
      setReviewFinished(true);
    } else {
      setReviewRound(value => value + 1);
      setReviewIndex(0);
      setReviewAnswer("");
      setReviewFeedback(null);
      setReviewCorrect(0);
      setReviewAttempts(0);
    }
  };

  const openSpeechSettings = async () => {
    try {
      const { Capacitor } = await import("@capacitor/core");
      if (!Capacitor.isNativePlatform()) {
        setAudioInfo({ message: "请在已安装的 Android APK 中打开语音设置。", kind: "info" });
        return;
      }
      const { TextToSpeech } = await import("@capacitor-community/text-to-speech");
      await TextToSpeech.openInstall();
      setAudioInfo({ message: "已打开 Android 语音数据安装页面。请安装 English (United States) 语音包。", kind: "success" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "无法打开语音数据页面";
      setAudioInfo({ message: `打开语音设置失败：${message}`, kind: "error" });
    }
  };

  const checkForUpdates = async () => {
    setCheckingUpdate(true);
    setUpdateInfo(null);
    const actionsUrl = "https://github.com/infcreative-Ethan/cpc-academy/actions/workflows/android-apk.yml";
    try {
      const response = await fetch("https://api.github.com/repos/infcreative-Ethan/cpc-academy/actions/workflows/android-apk.yml/runs?branch=main&status=completed&per_page=1", {
        headers: { Accept: "application/vnd.github+json" },
      });
      if (!response.ok) throw new Error("GitHub API request failed");
      const data = await response.json();
      const run = data.workflow_runs?.[0];
      if (!run) {
        setUpdateInfo({ message: "暂时没有可下载的 APK 构建记录。", url: actionsUrl });
      } else if (run.conclusion !== "success") {
        setUpdateInfo({ message: "最近一次 APK 构建未成功，点击查看构建日志。", url: run.html_url || actionsUrl });
      } else {
        setUpdateInfo({ message: `最新 APK 构建完成：${new Date(run.updated_at).toLocaleDateString("zh-CN")}`, url: run.html_url || actionsUrl });
      }
    } catch {
      setUpdateInfo({ message: "检查更新失败，可打开 GitHub 构建页面查看。", url: actionsUrl });
    } finally {
      setCheckingUpdate(false);
    }
  };


  if (!ready) return <main className="loading-screen"><div className="brand-mark">C</div><p>CPC Academy 正在加载…</p></main>;

  return (
    <main className="app-shell">
      <aside className={`sidebar ${mobileMenu ? "sidebar-open" : ""}`}>
        <div className="brand"><div className="brand-mark">C</div><div><strong>CPC Academy</strong><span>MEDICAL CODING PATHWAY</span></div></div>
        <div className="side-label">学习中心 · LEARNING</div>
        <nav className="side-nav">
          {navItems.map(item=>{ const Icon=item.icon; return <button key={item.id} className={`nav-item ${tab===item.id?"active":""}`} onClick={()=>changeTab(item.id)}><Icon size={19}/><span>{item.label}<small>{item.en}</small></span>{tab===item.id&&<span className="nav-dot"/>}</button>; })}
        </nav>
        <div className="sidebar-bottom"><div className="daily-mini"><div className="daily-mini-icon"><Target size={18}/></div><div><b>每日目标</b><span>20 new words</span></div><strong>{studiedToday}/20</strong></div><div className="sidebar-foot">CPC Academy <span>V0.2.1 · Native audio</span></div></div>
      </aside>

      {mobileMenu && <button aria-label="关闭菜单" className="scrim" onClick={()=>setMobileMenu(false)}/>}

      <section className="main-area">
        <header className="topbar">
          <button className="icon-button mobile-only" onClick={()=>setMobileMenu(!mobileMenu)} aria-label="打开菜单"><Menu size={21}/></button>
          <div className="breadcrumb">CPC Academy <span>/</span> {navItems.find(n=>n.id===tab)?.en}</div>
          <div className="top-actions"><button className="update-button" onClick={checkForUpdates} disabled={checkingUpdate}><Download size={14}/>{checkingUpdate ? "检查中…" : "检查更新"}</button><span className="language-pill">中 / EN</span><div className="avatar">E</div></div>
        </header>
        {updateInfo && <div className="update-notice"><span>{updateInfo.message}</span>{updateInfo.url && <a href={updateInfo.url} target="_blank" rel="noreferrer">打开 APK 下载页</a>}<button onClick={()=>setUpdateInfo(null)} aria-label="关闭">×</button></div>}
        {audioInfo && <div className={`audio-notice ${audioInfo.kind}`} role="status"><Volume2 size={15}/><span>{audioInfo.message}</span><button onClick={()=>setAudioInfo(null)} aria-label="关闭声音提示">×</button></div>}

        {tab==="home" && <div className="page-content">
          <div className="welcome-row"><div><div className="eyebrow"><Sparkles size={14}/> YOUR DAILY STUDY PLAN</div><h1>今天继续积累专业词汇。</h1><p>Build medical English, one term at a time.</p></div><div className="date-chip"><Clock3 size={15}/>{new Intl.DateTimeFormat("zh-CN",{month:"long",day:"numeric",weekday:"short"}).format(new Date())}</div></div>
          <div className="hero-card"><div className="hero-copy"><span className="hero-kicker">CPC ACADEMY · VOCABULARY</span><h2>Medical terminology<br/><em>starts here.</em></h2><p>医学术语 · 美式发音 · 听力默写 · 词根拆解</p><button className="primary-button" onClick={()=>changeTab("words")}>开始今日学习 <ArrowRight size={17}/></button></div><div className="hero-art"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="hero-cross">+</div><div className="hero-word">cardi<span>/</span>o</div><div className="hero-caption">HEART · 心脏</div></div></div>
          <div className="stats-grid"><div className="stat-card"><div className="stat-icon purple"><BookOpen size={18}/></div><span>已掌握词汇</span><strong>{progress.knownIds.length}<small> / {words.length}</small></strong><div className="stat-note">Words learned</div></div><div className="stat-card"><div className="stat-icon orange"><Flame size={18}/></div><span>待复习</span><strong>{dueWords.length}</strong><div className="stat-note">Words to review</div></div><div className="stat-card"><div className="stat-icon green"><Target size={18}/></div><span>今日新词</span><strong>{studiedToday}<small> / 20</small></strong><div className="stat-note">Daily target</div></div><div className="stat-card"><div className="stat-icon blue"><Activity size={18}/></div><span>练习正确率</span><strong>{accuracy}<small>%</small></strong><div className="stat-note">Practice accuracy</div></div></div>
          <div className="section-heading"><div><h3>今日学习任务</h3><p>Today&apos;s learning tasks</p></div><span className="section-link">{studiedToday}/20 completed</span></div>
          <div className="task-grid"><button className="task-card" onClick={()=>changeTab("words")}><div className="task-top"><div className="task-icon purple"><BookOpen size={20}/></div><span className="task-time">20–25 min</span></div><h4>学习 20 个新单词</h4><p>词义、英文定义、例句与词根</p><div className="task-progress"><span style={{width:`${Math.min(100,studiedToday/20*100)}%`}}/></div><div className="task-foot">{studiedToday} / 20 <ArrowRight size={16}/></div></button><button className="task-card" onClick={()=>changeTab("listen")}><div className="task-top"><div className="task-icon blue"><Headphones size={20}/></div><span className="task-time">10 min</span></div><h4>医学英语听力</h4><p>听辨医学术语，熟悉美式发音</p><div className="task-foot">开始训练 <ArrowRight size={16}/></div></button><button className="task-card" onClick={()=>changeTab("dictation")}><div className="task-top"><div className="task-icon orange"><PencilLine size={20}/></div><span className="task-time">15 min</span></div><h4>听音与拼写默写</h4><p>听单词、辨词根、练习准确拼写</p><div className="task-foot">开始训练 <ArrowRight size={16}/></div></button><button className="task-card" onClick={startReview}><div className="task-top"><div className="task-icon green"><Repeat2 size={20}/></div><span className="task-time">{reviewRounds} rounds</span></div><h4>今日多轮复习</h4><p>完成新词后，自选复习轮数并逐轮检查掌握情况</p><div className="task-foot">开始复习 <ArrowRight size={16}/></div></button></div>
          <div className="section-heading"><div><h3>今日单词预览</h3><p>Daily vocabulary preview</p></div><button className="text-button" onClick={()=>changeTab("words")}>查看全部 <ArrowRight size={15}/></button></div>
          <div className="word-preview">{dailyWords.slice(0,5).map(w=><button key={w.id} className="preview-row" onClick={()=>{setSelected(w);changeTab("words");}}><span className="word-initial">{w.term[0].toUpperCase()}</span><span className="preview-term"><b>{w.term}</b><small>{w.definition}</small></span><span className="preview-zh">{w.meaning || "查看英文释义"}</span><ChevronDown className="rotate-icon" size={17}/></button>)}</div>
        </div>}

        {tab==="words" && <div className="page-content">
          <div className="page-title-row"><div><div className="eyebrow">MEDICAL TERMINOLOGY</div><h1>医学词汇库</h1><p>Search, study and master medical terms.</p></div><div className="count-chip">{words.length} TERMS</div></div>
          <div className="vocab-layout"><div className="vocab-list-panel"><div className="search-box"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="搜索英文、中文、词根…" /><span>{filteredWords.length}</span></div><div className="category-scroll">{categories.map(c=><button key={c} onClick={()=>setCategory(c)} className={category===c?"filter-active":""}>{c==="All"?"全部":c}</button>)}</div><div className="vocab-list">{filteredWords.map(w=><button key={w.id} className={`vocab-row ${selected.id===w.id?"selected":""}`} onClick={()=>setSelected(w)}><span className="word-initial">{w.term[0].toUpperCase()}</span><span className="vocab-row-text"><b>{w.term}</b><small>{w.meaning || w.definition}</small></span><span className="row-status">{progress.knownIds.includes(w.id)?<Check size={16}/>:<span/>}</span></button>)}{filteredWords.length===0&&<div className="empty-state">没有找到匹配词汇。<br/>Try another search.</div>}</div></div>
          <div className="word-detail"><div className="detail-top"><span className="detail-category">{selected.category}</span><div className="audio-controls"><button className="speaker-button" onClick={()=>speak(selected.term,0.88)}><Volume2 size={18}/> 正常发音</button><button className="speaker-button" onClick={()=>speak(selected.term,0.65)}>慢速</button></div></div><div className="detail-term">{selected.term}</div><div className="detail-meaning">{selected.meaning || "中文释义待补充"}</div>{selected.pronunciation && <div className="pronunciation-guide">教材注音：{selected.pronunciation}</div>}<div className="detail-definition"><span>ENGLISH DEFINITION</span><p>{selected.definition}</p></div><div className="detail-block"><div className="block-label">WORD PARTS <span>词根拆解</span></div><div className="parts-row">{selected.parts.map((p,i)=><div className="part-chip" key={i}><b>{p.part}</b><small>{p.meaning}</small></div>)}</div></div>{selected.example && <div className="detail-block"><div className="block-label">CLINICAL EXAMPLE <span>医学例句</span></div><p className="example-en">{selected.example}</p>{selected.exampleZh && <p className="example-zh">{selected.exampleZh}</p>}<div className="audio-controls"><button className="inline-audio" onClick={()=>speak(selected.example,0.88)}><Volume2 size={15}/> 正常播放</button><button className="inline-audio" onClick={()=>speak(selected.example,0.65)}>慢速播放</button></div></div>}<div className="detail-actions"><button className="secondary-button" onClick={()=>markReview(selected)}><RotateCcw size={16}/> 加入复习</button><button className="primary-button" onClick={()=>markKnown(selected)}><Check size={17}/> 我已掌握</button></div><p className="detail-footnote">Android APK 使用原生语音引擎；美式英语音色取决于设备安装的语音包。教材注音供核对读音。</p><div className="audio-help-actions"><button className="inline-audio" onClick={()=>void speak("Hello. This is an American English pronunciation test.",0.9)}><Volume2 size={15}/> 测试声音</button><button className="inline-audio" onClick={openSpeechSettings}>检查 / 安装英语语音包</button></div></div></div>
        </div>}

        {tab==="review" && <div className="page-content narrow-content">
          <div className="page-title-row"><div><div className="eyebrow">DAILY MULTI-ROUND REVIEW</div><h1>每日多轮复习</h1><p>完成今日新词后，按自己选择的轮数反复回忆与拼写。</p></div><div className="count-chip">{reviewPool.length} TERMS</div></div>
          {!reviewActive && !reviewFinished && <div className="practice-card review-setup">
            <div className="dictation-symbol"><Repeat2 size={28}/></div>
            <h2>今天复习几轮？</h2>
            <p>每轮复习今日学习词汇和待复习词汇，共 {reviewPool.length} 个词。</p>
            <div className="round-selector">{[1,2,3,5,10].map(n=><button key={n} className={reviewRounds===n?"round-selected":""} onClick={()=>chooseReviewRounds(n)}>{n} 轮</button>)}</div>
            <button className="primary-button" onClick={startReview}><Play size={16} fill="currentColor"/> 开始第 1 轮</button>
            <div className="answer-hint">每轮结束都会记录正确率；答错的词自动加入待复习列表。</div>
          </div>}
          {reviewActive && currentReviewWord && <div className="practice-card dictation-card">
            <div className="practice-progress"><span>ROUND {reviewRound} / {reviewRounds}</span><span>{reviewIndex+1} / {reviewPool.length}</span></div>
            <div className="dictation-symbol"><BookOpen size={28}/></div>
            <h2>{currentReviewWord.meaning || "根据英文释义回忆医学术语"}</h2>
            <p>{currentReviewWord.definition}</p>
            {currentReviewWord.pronunciation && <div className="pronunciation-guide">教材注音：{currentReviewWord.pronunciation}</div>}
            <button className="play-button" onClick={()=>speak(currentReviewWord.term,0.78)}><Volume2 size={18}/> 播放单词</button>
            <div className="listen-answer"><label>请写出对应的英文医学术语</label><input value={reviewAnswer} onChange={e=>{setReviewAnswer(e.target.value);setReviewFeedback(null);}} onKeyDown={e=>e.key==="Enter"&&submitReviewAnswer()} placeholder="Type the medical term…" /><button className="primary-button full-button" onClick={submitReviewAnswer} disabled={!reviewAnswer.trim() || Boolean(reviewFeedback)}>提交答案 <Check size={16}/></button>
              {reviewFeedback && <div className={`feedback ${reviewFeedback}`}>{reviewFeedback==="correct"?"✓ 正确！":"正确答案："+currentReviewWord.term}</div>}
              <button className="next-button" onClick={advanceReview} disabled={!reviewFeedback}>{reviewIndex+1===reviewPool.length?(reviewRound===reviewRounds?"完成复习":"进入下一轮"):"下一题"} <ArrowRight size={16}/></button>
            </div>
            <div className="answer-hint">本轮正确 {reviewCorrect} / 已答 {reviewAttempts}</div>
          </div>}
          {reviewFinished && <div className="practice-card review-results">
            <div className="dictation-symbol"><Check size={28}/></div><h2>今日复习完成</h2><p>已完成 {reviewRounds} 轮，每轮共复习 {reviewPool.length} 个词。</p>
            <div className="round-results">{reviewRoundResults.map(result=><div key={result.round}><span>第 {result.round} 轮</span><b>{result.correct} / {result.total}</b><small>{result.total?Math.round(result.correct/result.total*100):0}%</small></div>)}</div>
            <button className="primary-button" onClick={startReview}><Repeat2 size={16}/> 再复习一组</button>
          </div>}
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
          <div className="section-heading"><div><h3>多轮复习记录</h3><p>Daily review history</p></div><span className="section-link">{progress.reviewHistory.length} rounds</span></div>
          <div className="word-preview">{progress.reviewHistory.length ? [...progress.reviewHistory].slice(-10).reverse().map((item,index)=><div className="preview-row" key={`${item.date}-${item.round}-${index}`}><span className="word-initial"><Repeat2 size={15}/></span><span className="preview-term"><b>{item.date} · 第 {item.round} 轮</b><small>完成 {item.total} 个词</small></span><span className="preview-zh">{item.correct}/{item.total} · {item.total?Math.round(item.correct/item.total*100):0}%</span></div>) : <div className="empty-state">完成第一轮复习后，这里会显示每轮的正确率。</div>}</div>
          <div className="section-heading"><div><h3>需要加强的词汇</h3><p>Review queue</p></div><span className="section-link">{dueWords.length} terms</span></div>
          <div className="word-preview">{dueWords.length?dueWords.map(w=><button key={w.id} className="preview-row" onClick={()=>{setSelected(w);changeTab("words");}}><span className="word-initial"><RotateCcw size={16}/></span><span className="preview-term"><b>{w.term}</b><small>{w.definition}</small></span><span className="preview-zh">{w.meaning || "查看英文释义"}</span><ArrowRight size={16}/></button>):<div className="empty-state">目前没有待复习词汇。完成练习后，答错的词会自动加入这里。</div>}</div>
          <button className="reset-button" onClick={()=>{if(window.confirm("确定清空本设备上的 CPC Academy 学习记录吗？")){update(emptyProgress);}}}>清空本地学习记录</button>
        </div>}
        <footer className="page-footer">CPC ACADEMY <span>·</span> PERSONAL STUDY EDITION <span>·</span> V{APP_VERSION}</footer>
      </section>

      <nav className="mobile-nav">{navItems.slice(0,5).map(item=>{const Icon=item.icon;return <button key={item.id} className={tab===item.id?"mobile-active":""} onClick={()=>changeTab(item.id)}><Icon size={19}/><span>{item.label}</span></button>;})}</nav>
    </main>
  );
}
