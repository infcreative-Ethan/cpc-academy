"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity, ArrowRight, AudioLines, BookOpen, Brain, Check, ChevronDown, ChevronLeft, ChevronRight, Download,
  CircleHelp, Clock3, Flame, Headphones, Home, Layers3, ListChecks, Menu,
  Mic2, PencilLine, Play, Repeat2, RotateCcw, Search, Sparkles, Target, Volume2, X,
  ClipboardCheck, FileText
} from "lucide-react";
import Link from "next/link";
import PronunciationFeedback from "@/components/pronunciation-feedback";
import TranslationFeedback from "@/components/translation-feedback";
import AppUpdateButton from "@/components/app-update-button";
import ProgressBackup from "@/components/progress-backup";
import { MedicalWord, WordCategory } from "@/lib/words";
import { wordParts, words } from "@/lib/book-words";
import { chapters } from "@/lib/cpc-curriculum";
import {
  getChapterWords,getChapterVocabularyStats,getCurrentNewWordChapter,
  getOrderedWordBatch,getChapterReviewWordIds,getWordChapters,
  indexedChapterWordCount,unassignedSourceWords
} from "@/lib/chapter-vocabulary";
import { emptyProgress, getTodayKey, loadProgress, saveProgress, StudyProgress } from "@/lib/progress";

type Tab = "home" | "daily" | "chapters" | "words" | "review" | "listen" | "dictation" | "roots" | "progress";
type DictationMode = "word" | "meaning" | "definition" | "root" | "clinical";
type ReviewMode = "dictation" | "zh-en" | "en-zh";
const categories: ("All" | WordCategory)[] = ["All", "Foundations", "Body Systems", "Conditions", "Procedures", "Specialties", "Other"];
const APP_VERSION = "1.0.0-beta.1";

type AudioStatus = { message: string; kind: "info" | "success" | "error" };

function setAudioStatus(message: string, kind: AudioStatus["kind"] = "info") {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent<AudioStatus>("cpc-audio-status", { detail: { message, kind } }));
  }
}

function audioSlug(value: string) {
  return value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "audio";
}

function normalize(value: string) {
  return value.trim().toLowerCase().replace(/[.,!?;:]/g, "").replace(/\s+/g, " ");
}

function normalizeChinese(value: string) {
  return value.toLowerCase().replace(/[\s，。；、！？：,.!?;:()（）\[\]{}"'“”‘’]/g, "");
}

function matchesChineseMeaning(answer: string, expected: string) {
  const clean = (value: string) => normalizeChinese(value.replace(/\([^)]*\)/g, ""));
  const target = clean(expected);
  const variants = expected.split(/[;；,，、/／|]+/).map(clean).filter(Boolean);
  const candidate = normalizeChinese(answer);
  return candidate === target || variants.includes(candidate);
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
  const [reviewMode, setReviewMode] = useState<ReviewMode>("dictation");
  const [dictionaryOpen, setDictionaryOpen] = useState(false);
  const [dictionaryWord, setDictionaryWord] = useState("");
  const [dictionarySourceTerm, setDictionarySourceTerm] = useState("");
  const [dictionaryData, setDictionaryData] = useState<Record<string, string>>({});
  const [dictionaryReady, setDictionaryReady] = useState(false);
  const [dictionaryTranslation, setDictionaryTranslation] = useState("");
  const [dictionaryLoading, setDictionaryLoading] = useState(false);
  const [dailyShowList, setDailyShowList] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [chapterQuery, setChapterQuery] = useState("");
  const [chapterFilter, setChapterFilter] = useState<"all"|"pending"|"learned"|"known"|"review">("all");
  const [reviewSourceLabel, setReviewSourceLabel] = useState("今日新词与长期复习");
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
  const [audioInfo, setAudioInfo] = useState<AudioStatus | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const handleAudioStatus = (event: Event) => {
      setAudioInfo((event as CustomEvent<AudioStatus>).detail);
    };
    window.addEventListener("cpc-audio-status", handleAudioStatus);
    return () => window.removeEventListener("cpc-audio-status", handleAudioStatus);
  }, []);

  useEffect(() => {
    const player = new Audio();
    player.preload = "auto";
    audioRef.current = player;
    return () => {
      player.pause();
      player.removeAttribute("src");
      player.load();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    let saved = loadProgress();
    const today = getTodayKey();
    if (saved.dailyDate !== today) {
      saved = {
        ...saved,
        dailyDate: today,
        dailyIds: [],
        dailySize: saved.dailySize === 30 ? 30 : 20,
        dailyCompletedIds: [],
        dailyStudyIndex: 0,
        dailyStudyStarted: false,
        dailyStudyCompleted: false,
        dailyChapter: null,
      };
      saveProgress(saved);
    } else {
      saved = {
        ...saved,
        dailySize: saved.dailySize === 30 ? 30 : 20,
        dailyCompletedIds: saved.dailyCompletedIds ?? [],
        dailyStudyIndex: saved.dailyStudyIndex ?? 0,
        dailyStudyStarted: saved.dailyStudyStarted ?? false,
        dailyStudyCompleted: saved.dailyStudyCompleted ?? false,
      };
      saveProgress(saved);
    }
    setProgress(saved);
    setReviewRounds(saved.reviewRounds ?? 3);
    setReviewMode(saved.reviewMode ?? "dictation");
    const params=new URLSearchParams(window.location.search);
    const initialChapter=Number(params.get("chapter"));
    if(params.get("tab")==="chapters"){
      setTab("chapters");
      if(Number.isInteger(initialChapter)&&initialChapter>=1&&initialChapter<=22)setSelectedChapter(initialChapter);
    }
    setReady(true);
  }, []);

  const update = (next: StudyProgress) => {
    setProgress(next);
    saveProgress(next);
  };

  useEffect(() => {
    let cancelled = false;
    fetch("/english-dictionary.json")
      .then(response => response.ok ? response.json() : {})
      .then((data: Record<string, string>) => {
        if (!cancelled) {
          setDictionaryData(data && typeof data === "object" ? data : {});
          setDictionaryReady(true);
        }
      })
      .catch(() => { if (!cancelled) setDictionaryReady(true); });
    return () => { cancelled = true; };
  }, []);

  const allWords = useMemo(() => [...words, ...(progress.customWords ?? [])], [progress.customWords]);
  const dailyWords = useMemo(() => {
    return progress.dailyIds.map(id=>allWords.find(w=>w.id===id)).filter((w): w is MedicalWord => Boolean(w));
  }, [progress.dailyIds, allWords]);
  const dailyCurrentWord = dailyWords[progress.dailyStudyIndex] ?? dailyWords[0];
  const dailyPercent = dailyWords.length ? Math.round((progress.dailyCompletedIds.length / dailyWords.length) * 100) : 0;

  useEffect(() => {
    if (!dictionaryOpen || !dictionaryWord || !dictionaryReady) return;
    const key = dictionaryWord.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().replace(/\s+/g, " ");
    const translation = dictionaryData[key] ?? dictionaryData[dictionaryWord.toLowerCase()] ?? "";
    setDictionaryTranslation(translation);
    setDictionaryLoading(false);
  }, [dictionaryOpen, dictionaryWord, dictionaryReady, dictionaryData]);

  const lookupDictionaryWord = (word: string, sourceTerm = selected.term) => {
    setDictionaryWord(word);
    setDictionarySourceTerm(sourceTerm);
    setDictionaryTranslation("");
    setDictionaryLoading(!dictionaryReady);
    setDictionaryOpen(true);
  };

  const renderDictionaryText = (value: string, sourceTerm = selected.term) => value.split(/([A-Za-z]+(?:[-'][A-Za-z]+)*)/g).map((segment, index) =>
    /^[A-Za-z]/.test(segment)
      ? <button type="button" className="dictionary-word-link" key={index} onClick={() => lookupDictionaryWord(segment, sourceTerm)}>{segment}</button>
      : segment
  );

  const addDictionaryWord = () => {
    const term = dictionaryWord.trim().toLowerCase();
    if (!term) return;
    const existing = allWords.find(word => word.term.toLowerCase() === term);
    if (existing) {
      update({ ...progress, reviewIds: Array.from(new Set([...progress.reviewIds, existing.id])) });
      setDictionaryOpen(false);
      return;
    }
    const id = "custom-" + audioSlug(term);
    const customWord: MedicalWord = {
      id,
      term: dictionaryWord.trim(),
      meaning: dictionaryTranslation.trim(),
      definition: "Added from the English definition of " + (dictionarySourceTerm || selected.term) + ".",
      definitionZh: "来自医学词汇 " + (dictionarySourceTerm || selected.term) + " 的英文定义。",
      category: "Other",
      parts: [],
      example: "",
      exampleZh: "",
    };
    update({
      ...progress,
      customWords: [...(progress.customWords ?? []).filter(word => word.id !== id), customWord],
      reviewIds: Array.from(new Set([...progress.reviewIds, id])),
    });
    setSelected(customWord);
    setCategory("Other");
    setQuery("");
    setDictionaryOpen(false);
    changeTab("words");
  };

  const reviewPool = useMemo(() => {
    const ids = reviewSessionIds.length ? reviewSessionIds : [...new Set([...progress.dailyIds, ...progress.reviewIds])];
    const pool = ids.map(id => allWords.find(w => w.id === id)).filter((w): w is MedicalWord => Boolean(w));
    return pool;
  }, [reviewSessionIds, progress.dailyIds, progress.reviewIds, allWords]);
  const currentReviewWord = reviewPool[reviewIndex];

  const filteredWords = useMemo(() => allWords.filter(w => {
    const matchesQuery = !query || [w.term, w.meaning, w.definition, w.definitionZh ?? "", ...w.parts.map(p=>p.part)].join(" ").toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (category === "All" || w.category === category);
  }), [query, category, allWords]);

  const dueWords = useMemo(() => {
    const ids = new Set(progress.reviewIds);
    return allWords.filter(w=>ids.has(w.id));
  }, [progress.reviewIds, allWords]);

  const accuracy = progress.attempts ? Math.round(progress.correct / progress.attempts * 100) : 0;
  const studiedToday = dailyWords.filter(w=>progress.dailyCompletedIds.includes(w.id)).length;
  const dailyTarget = progress.dailySize;
  const nextChapter = getCurrentNewWordChapter(progress);
  const activeChapterStats=getChapterVocabularyStats(selectedChapter,progress);
  const chapterWords=getChapterWords(selectedChapter);
  const chapterFilteredWords=chapterWords.filter(word=>{
    const term=chapterQuery.trim().toLowerCase();
    if(term && ![word.term,word.meaning,word.definition].join(" ").toLowerCase().includes(term))return false;
    const known=progress.knownIds.includes(word.id);
    const learned=known || progress.introducedIds.includes(word.id);
    if(chapterFilter==="pending")return !learned;
    if(chapterFilter==="learned")return learned;
    if(chapterFilter==="known")return known;
    if(chapterFilter==="review")return progress.reviewIds.includes(word.id);
    return true;
  });

  const markKnown = (word: MedicalWord) => {
    update({ ...progress, knownIds: Array.from(new Set([...progress.knownIds, word.id])),
      introducedIds:Array.from(new Set([...progress.introducedIds,word.id])),
      reviewIds: progress.reviewIds.filter(id=>id!==word.id) });
  };
  const markReview = (word: MedicalWord) => {
    update({ ...progress, reviewIds: Array.from(new Set([...progress.reviewIds, word.id])) });
  };

  const generateDailySet = (size: 20 | 30 = progress.dailySize, chapter?:number) => {
    // Always use the original textbook chapter order, not a randomized global word pool.
    const selection=getOrderedWordBatch(progress,size,chapter,progress.customWords??[]);
    update({
      ...progress,
      dailySize:size,
      dailyChapter:chapter??null,
      dailyIds:selection.words.map(word=>word.id),
      dailyCompletedIds:[],
      dailyStudyIndex:0,
      dailyStudyStarted:false,
      dailyStudyCompleted:false
    });
    setReviewSessionIds([]);
    setReviewSourceLabel("今日新词与长期复习");
    setReviewActive(false);
    setReviewFinished(false);
    setDailyShowList(true);
  };
  const startChapterNewWords=(chapter:number)=>{
    if(progress.dailyIds.length>0&&!progress.dailyStudyCompleted &&
      !window.confirm("本次操作将替换今天尚未完成的词单。旧掌握和复习进度仍会保留，确定继续吗？"))return;
    generateDailySet(progress.dailySize,chapter);
    changeTab("daily");
  };
  const selectChapterReview=(chapter:number,all=false)=>{
    const ids=getChapterReviewWordIds(chapter,progress,all);
    if(!ids.length)return;
    setReviewSessionIds(ids);
    setReviewSourceLabel("Chapter "+chapter+(all?" · 全章词汇":" · 已学词汇"));
    setReviewActive(false);
    setReviewFinished(false);
    setReviewRound(1);
    setReviewIndex(0);
    changeTab("review");
  };

  const startDailyStudy = () => {
    if (!dailyWords.length) return;
    const index = progress.dailyStudyCompleted ? 0 : Math.min(progress.dailyStudyIndex, dailyWords.length - 1);
    setSelected(dailyWords[index]);
    update({ ...progress, dailyStudyStarted: true, dailyStudyCompleted: false, dailyStudyIndex: index });
    setDailyShowList(false);
    changeTab("daily");
  };

  const showDailyWord = (index: number) => {
    if (index < 0 || index >= dailyWords.length) return;
    setSelected(dailyWords[index]);
    update({ ...progress, dailyStudyIndex: index });
  };

  const nextDailyWord = () => {
    if (!dailyCurrentWord) return;
    const completed=Array.from(new Set([...progress.dailyCompletedIds,dailyCurrentWord.id]));
    const introduced=Array.from(new Set([...progress.introducedIds,dailyCurrentWord.id]));
    if(progress.dailyStudyIndex+1>=dailyWords.length){
      update({...progress,introducedIds:introduced,dailyCompletedIds:completed,
        dailyStudyCompleted:true,dailyStudyStarted:false});
      setDailyShowList(false);
      return;
    }
    const nextIndex=progress.dailyStudyIndex+1;
    update({...progress,introducedIds:introduced,dailyCompletedIds:completed,dailyStudyIndex:nextIndex});
    setSelected(dailyWords[nextIndex]);
  };

  const previousDailyWord = () => {
    if (progress.dailyStudyIndex <= 0) return;
    showDailyWord(progress.dailyStudyIndex - 1);
  };

  const nextQuestion = (mode = dictationMode) => {
    const pool = mode === "root" ? allWords.filter(w=>w.parts.length) : allWords;
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
    { id:"daily", label:"今日学习", en:"Daily Study", icon:BookOpen },
    { id:"chapters", label:"章节词表", en:"Chapter Vocabulary", icon:Layers3 },
    { id:"words", label:"词汇库", en:"Vocabulary", icon:BookOpen },
    { id:"review", label:"复习", en:"Review Rounds", icon:Repeat2 },
    { id:"listen", label:"听力", en:"Listening", icon:Headphones },
    { id:"dictation", label:"默写", en:"Dictation", icon:PencilLine },
    { id:"roots", label:"词根", en:"Word Parts", icon:Layers3 },
    { id:"progress", label:"进度", en:"Progress", icon:Activity },
  ];

  const changeTab = (next: Tab) => { setTab(next); setMobileMenu(false); setFeedback(null); };

  const chooseReviewMode = (mode: ReviewMode) => {
    setReviewMode(mode);
    update({ ...progress, reviewMode: mode });
  };

  const chooseReviewRounds = (rounds: number) => {
    setReviewRounds(rounds);
    update({ ...progress, reviewRounds: rounds });
  };

  const startReview = () => {
    if (!reviewPool.length) return;
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
    const correct = reviewMode === "en-zh"
      ? matchesChineseMeaning(reviewAnswer, currentReviewWord.meaning)
      : normalize(reviewAnswer) === normalize(currentReviewWord.term);
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
      // Preserve the selected chapter scope until the learner chooses another review.
    } else {
      setReviewRound(value => value + 1);
      setReviewIndex(0);
      setReviewAnswer("");
      setReviewFeedback(null);
      setReviewCorrect(0);
      setReviewAttempts(0);
    }
  };

  const playAudioFile = (src: string, rate = 1) => {
    if (!src) {
      setAudioStatus("找不到对应的 MP3 音频文件。", "error");
      return;
    }
    const audio = audioRef.current ?? new Audio();
    audioRef.current = audio;
    audio.pause();
    try { audio.currentTime = 0; } catch {}
    audio.onplaying = () => setAudioStatus("正在播放离线美式英语 MP3 音频。", "success");
    audio.onended = () => setAudioStatus("播放完成。", "info");
    audio.onerror = () => setAudioStatus("MP3 音频读取失败。请确认已安装最新 CPC Academy 版本。", "error");
    audio.preload = "auto";
    audio.src = src;
    audio.playbackRate = rate;
    audio.load();
    audio.play().catch(error => {
      const message = error instanceof Error ? error.message : "媒体播放失败";
      setAudioStatus("MP3 播放失败：" + message, "error");
    });
  };

  const playWord = (word: MedicalWord, rate = 1) => {
    const index = words.findIndex(item => item.id === word.id);
    if (index < 0) {
      setAudioStatus("未找到这个单词对应的离线音频。", "error");
      return;
    }
    const filename = String(index + 1).padStart(4, "0") + "-" + audioSlug(word.term) + ".mp3";
    playAudioFile("/audio/words/" + filename, rate);
  };

  const playDefinition = (word: MedicalWord, rate = 1) => {
    const index = words.findIndex(item => item.id === word.id);
    if (index < 0) {
      setAudioStatus("自定义生词暂无预生成的英文定义音频。", "info");
      return;
    }
    const filename = String(index + 1).padStart(4, "0") + "-" + audioSlug(word.term) + ".mp3";
    playAudioFile("/audio/definitions/" + filename, rate);
  };

  const playPart = (part: string, index: number, rate = 1) => {
    const filename = String(index + 1).padStart(4, "0") + "-" + audioSlug(part) + ".mp3";
    playAudioFile("/audio/parts/" + filename, rate);
  };

  const playExample = (word: MedicalWord, rate = 1) => {
    playAudioFile("/audio/examples/" + audioSlug(word.term) + ".mp3", rate);
  };

  if (!ready) return <main className="loading-screen"><div className="brand-mark">C</div><p>CPC Academy 正在加载…</p></main>;

  return (
    <main className="app-shell">
      <aside className={`sidebar ${mobileMenu ? "sidebar-open" : ""}`}>
        <div className="brand"><div className="brand-mark">C</div><div><strong>CPC Academy</strong><span>MEDICAL CODING PATHWAY</span></div></div>
        <div className="side-label">学习中心 · LEARNING</div>
        <nav className="side-nav">
          {navItems.map(item=>{ const Icon=item.icon; return <button key={item.id} className={`nav-item ${tab===item.id?"active":""}`} onClick={()=>changeTab(item.id)}><Icon size={19}/><span>{item.label}<small>{item.en}</small></span>{tab===item.id&&<span className="nav-dot"/>}</button>; })}
          <Link className="nav-item cpc-nav-link" href="/cpc/" prefetch={false}><span className="cpc-nav-badge">C</span><span>医学课程与CPC编码<small>116 Medical Lessons · 100 Coding Lessons</small></span></Link>
        </nav>
        <div className="sidebar-bottom"><div className="daily-mini"><div className="daily-mini-icon"><Target size={18}/></div><div><b>每日目标</b><span>{dailyTarget} new words</span></div><strong>{studiedToday}/{dailyTarget}</strong></div><div className="sidebar-foot">CPC Academy <span>V1.0.0-beta.1 · Dictionary + review</span></div></div>
      </aside>

      {mobileMenu && <button aria-label="关闭菜单" className="scrim" onClick={()=>setMobileMenu(false)}/>}

      <section className="main-area">
        <header className="topbar">
          <button className="icon-button mobile-only" onClick={()=>setMobileMenu(!mobileMenu)} aria-label="打开菜单"><Menu size={21}/></button>
          <div className="breadcrumb">CPC Academy <span>/</span> {navItems.find(n=>n.id===tab)?.en}</div>
          <div className="top-actions"><AppUpdateButton/><span className="language-pill">中 / EN</span><div className="avatar">E</div></div>
        </header>
        {audioInfo && <div className={`audio-notice ${audioInfo.kind}`} role="status"><Volume2 size={15}/><span>{audioInfo.message}</span><button onClick={()=>setAudioInfo(null)} aria-label="关闭声音提示">×</button></div>}

        {tab==="home" && <div className="page-content">
          <div className="welcome-row"><div><div className="eyebrow"><Sparkles size={14}/> CPC ACADEMY · LEARNING PATHWAY</div><h1>今天开始系统学习CPC医学与编码。</h1><p>医学课程、英文病历、职业编码与考试准备。</p></div><div className="date-chip"><Clock3 size={15}/>{new Intl.DateTimeFormat("zh-CN",{month:"long",day:"numeric",weekday:"short"}).format(new Date())}</div></div>
          <section className="course-entry-panel" aria-label="CPC系统课程快捷入口">
            <div className="course-entry-title"><span>系统课程 · COURSE PATHWAY</span><strong>22章医学课程已上线，按章节从基础到临床学习</strong><p>医学知识讲解、解剖图、疾病检查、英文病历、测试与编码实操。</p></div>
            <div className="course-entry-actions">
              <Link href="/cpc/learn/" prefetch={false} className="course-entry-primary"><BookOpen size={18}/> 开始医学课程 <ArrowRight size={16}/></Link>
              <Link href="/cpc/coding/" prefetch={false} className="course-entry-secondary"><ClipboardCheck size={17}/> 专业编码课程</Link>
              <Link href="/cpc/coding/cases/" prefetch={false} className="course-entry-secondary"><FileText size={17}/> 病例训练</Link>
              <Link href="/cpc/knowledge/" prefetch={false} className="course-entry-secondary"><Layers3 size={17}/> 22章知识点地图</Link>
              <Link href="/cpc/textbook/" prefetch={false} className="course-entry-secondary"><BookOpen size={17}/> 导入教材PDF与配图</Link>
            </div>
          </section>
          <div className="home-chapter-status">
            <div><span>当前章节词汇进度</span><b>{nextChapter?"Chapter "+nextChapter+" · "+(chapters[nextChapter-1]?.title??""):"22章已完成"}</b><small>按照原书章节与正文首次出现的顺序推进；已掌握与已学习的词不再随机重复。</small></div>
            <button className="secondary-button" onClick={()=>changeTab("chapters")}>查看22章词表 <ArrowRight size={14}/></button>
          </div>
          <div className="hero-card"><div className="hero-copy"><span className="hero-kicker">VOCABULARY · SUPPORTING STUDY</span><h2>Medical terminology<br/><em>starts here.</em></h2><p>医学术语 · 美式发音 · 听力默写 · 词根拆解</p><button className="primary-button" onClick={()=>changeTab("daily")}>开始今日学习 <ArrowRight size={17}/></button></div><div className="hero-art"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="hero-cross">+</div><div className="hero-word">cardi<span>/</span>o</div><div className="hero-caption">HEART · 心脏</div></div></div>
          <div className="stats-grid"><div className="stat-card"><div className="stat-icon purple"><BookOpen size={18}/></div><span>已掌握词汇</span><strong>{progress.knownIds.length}<small> / {allWords.length}</small></strong><div className="stat-note">Words learned</div></div><div className="stat-card"><div className="stat-icon orange"><Flame size={18}/></div><span>待复习</span><strong>{dueWords.length}</strong><div className="stat-note">Words to review</div></div><div className="stat-card"><div className="stat-icon green"><Target size={18}/></div><span>今日新词</span><strong>{studiedToday}<small> / {dailyTarget}</small></strong><div className="stat-note">Daily target</div></div><div className="stat-card"><div className="stat-icon blue"><Activity size={18}/></div><span>练习正确率</span><strong>{accuracy}<small>%</small></strong><div className="stat-note">Practice accuracy</div></div></div>
          <div className="section-heading"><div><h3>今日学习任务</h3><p>Today&apos;s learning tasks</p></div><span className="section-link">{studiedToday}/{dailyTarget} completed</span></div>
          <div className="task-grid"><button className="task-card" onClick={()=>changeTab("daily")}><div className="task-top"><div className="task-icon purple"><BookOpen size={20}/></div><span className="task-time">20–25 min</span></div><h4>学习 {dailyTarget} 个新单词</h4><p>词义、英文定义、例句与词根</p><div className="task-progress"><span style={{width:`${Math.min(100,studiedToday/dailyTarget*100)}%`}}/></div><div className="task-foot">{studiedToday} / {dailyTarget} <ArrowRight size={16}/></div></button><button className="task-card" onClick={()=>changeTab("listen")}><div className="task-top"><div className="task-icon blue"><Headphones size={20}/></div><span className="task-time">10 min</span></div><h4>医学英语听力</h4><p>听辨医学术语，熟悉美式发音</p><div className="task-foot">开始训练 <ArrowRight size={16}/></div></button><button className="task-card" onClick={()=>changeTab("dictation")}><div className="task-top"><div className="task-icon orange"><PencilLine size={20}/></div><span className="task-time">15 min</span></div><h4>听音与拼写默写</h4><p>听单词、辨词根、练习准确拼写</p><div className="task-foot">开始训练 <ArrowRight size={16}/></div></button><button className="task-card" onClick={startReview}><div className="task-top"><div className="task-icon green"><Repeat2 size={20}/></div><span className="task-time">{reviewRounds} rounds</span></div><h4>今日多轮复习</h4><p>完成新词后，自选复习轮数并逐轮检查掌握情况</p><div className="task-foot">开始复习 <ArrowRight size={16}/></div></button></div>
          <div className="section-heading"><div><h3>今日单词预览</h3><p>Daily vocabulary preview</p></div><button className="text-button" onClick={()=>changeTab("daily")}>查看今日词单 <ArrowRight size={15}/></button></div>
          <div className="word-preview">{dailyWords.length ? dailyWords.slice(0,5).map(w=><button key={w.id} className="preview-row" onClick={()=>{setDailyShowList(true);changeTab("daily");}}><span className="word-initial">{w.term[0].toUpperCase()}</span><span className="preview-term"><b>{w.term}</b><small>{w.definition}</small></span><span className="preview-zh">{w.meaning || "查看英文释义"}</span><ChevronDown className="rotate-icon" size={17}/></button>) : <div className="empty-state">还没有生成今日词单。点击「开始今日学习」，选择20或30个新词。</div>}</div>
        </div>}

        {tab==="daily" && <div className="page-content daily-page">
          <div className="page-title-row"><div><div className="eyebrow">TODAY'S WORD SET · DAILY STUDY</div><h1>今日学习</h1><p>依照教材 Chapter 1–22 顺序继续新词。可以选择20或30个，复习不受章节限制。</p><p className="chapter-vocab-daily-scope">{progress.dailyChapter?"当前为自选 Chapter "+progress.dailyChapter+" 专属词单":"自动路径：从 Chapter "+(nextChapter??"22")+" 按教材顺序继续"} · 已学词不重复抽入新词</p></div><div className="count-chip">{dailyWords.length ? dailyWords.length + " TERMS" : "NEW SET"}</div></div>

          {((!progress.dailyStudyStarted && !progress.dailyStudyCompleted) || dailyShowList) && <div className="daily-selection-card">
            <div className="daily-selection-heading"><div><span className="daily-kicker">STEP 1 · BUILD YOUR WORD SET</span><h2>选择今天学习多少个新单词</h2><p>从当前章节开始按教材出现顺序选词，跳过已经掌握或学过的新词；当前章节学完自动接下一章。</p></div><div className="daily-selection-icon"><BookOpen size={24}/></div></div>
            <div className="daily-size-options">
              <button className={progress.dailySize===20?"daily-size-active":""} onClick={()=>update({...progress,dailySize:20})}><b>20</b><span>个单词 · 标准学习量</span></button>
              <button className={progress.dailySize===30?"daily-size-active":""} onClick={()=>update({...progress,dailySize:30})}><b>30</b><span>个单词 · 加强学习量</span></button>
            </div>
            <div className="daily-set-toolbar">
              <div><b>今日专属词单</b><span>{dailyWords.length ? "已生成 " + dailyWords.length + " 个有序单词" : "还没有生成今日词单"}</span></div>
              <button className="secondary-button" onClick={()=>{if(dailyWords.length && !window.confirm("重新生成会替换今日词单及本组进度，已完成及已掌握的词仍会保存。确定继续吗？"))return;generateDailySet(progress.dailySize,progress.dailyChapter??undefined);}}><RotateCcw size={15}/>{dailyWords.length ? "重新生成" : "生成顺序词单"}</button>
            </div>
            {dailyWords.length>0 && <>
              {dailyWords.length!==progress.dailySize && <div className="daily-set-note">当前词单为 {dailyWords.length} 个；如需变更本组数量，点击「重新生成」。在当前章末不足目标数量时，会自动衔接下一章。</div>}
              <div className="daily-word-list">{dailyWords.map((word,index)=><div className="daily-word-row" key={word.id}><span className="daily-word-number">{String(index+1).padStart(2,"0")}</span><div className="daily-word-copy"><b>{word.term}</b><span>{word.meaning || word.definition}</span></div><span className={progress.dailyCompletedIds.includes(word.id)?"daily-word-state done":"daily-word-state"}>{progress.dailyCompletedIds.includes(word.id)?"已学":"新词"}</span></div>)}</div>
              <div className="daily-list-footer"><span>{progress.dailyCompletedIds.length} / {dailyWords.length} 已完成</span><button className="primary-button" onClick={startDailyStudy} disabled={!dailyWords.length}><Play size={16} fill="currentColor"/>{progress.dailyStudyStarted ? "继续学习" : progress.dailyStudyCompleted ? "重新学习本组" : "开始逐词学习"} <ArrowRight size={16}/></button></div>
            </>}
            {dailyWords.length===0 && <div className="daily-empty"><BookOpen size={25}/><b>今日词单尚未建立</b><span>选择20或30词，然后点击「生成顺序词单」。</span></div>}
            {progress.dailyStudyStarted && <button className="daily-back-link" onClick={()=>setDailyShowList(false)}>返回当前学习页面 <ArrowRight size={14}/></button>}
          </div>}

          {progress.dailyStudyStarted && !dailyShowList && !progress.dailyStudyCompleted && dailyCurrentWord && <div className="daily-lesson-wrap">
            <div className="daily-lesson-top"><div><span className="daily-kicker">STEP 2 · ONE WORD AT A TIME</span><h2>专注学习当前单词</h2></div><button className="secondary-button" onClick={()=>setDailyShowList(true)}><ListChecks size={15}/> 今日词单</button></div>
            <div className="daily-lesson-progress"><div className="daily-progress-label"><span>今日学习进度</span><b>{progress.dailyStudyIndex+1} / {dailyWords.length}</b></div><div className="daily-progress-track"><span style={{width:String(((progress.dailyStudyIndex+1)/dailyWords.length)*100)+"%"}}/></div></div>
            <article className="daily-word-card">
              <div className="daily-word-meta"><span>{getWordChapters(dailyCurrentWord.id).length?"Chapter "+getWordChapters(dailyCurrentWord.id).join(" / "):"待归章"} · {dailyCurrentWord.category}</span><span>WORD {String(progress.dailyStudyIndex+1).padStart(2,"0")}</span></div>
              <div className="daily-term">{dailyCurrentWord.term}</div>
              <div className="daily-meaning">{dailyCurrentWord.meaning || "中文释义待补充"}</div>
              {dailyCurrentWord.meaningSource==="machine-translation" && <div className="translation-source">自动翻译参考译名 · 建议结合英文定义核对</div>}
              {dailyCurrentWord.pronunciation && <div className="pronunciation-guide">教材注音：{dailyCurrentWord.pronunciation}</div>}
              <div className="daily-audio-actions"><button className="speaker-button" onClick={()=>playWord(dailyCurrentWord,1)}><Volume2 size={17}/> 美式发音</button><button className="speaker-button" onClick={()=>playWord(dailyCurrentWord,0.75)}>慢速播放</button></div>
              <PronunciationFeedback term={dailyCurrentWord.term}/>
              <TranslationFeedback term={dailyCurrentWord.term} meaning={dailyCurrentWord.meaning}/>
              <div className="daily-detail-section"><div className="definition-heading"><span>ENGLISH DEFINITION · 英文定义</span><small className="definition-hint">点击英文单词可翻译</small><button className="inline-audio" onClick={()=>playDefinition(dailyCurrentWord)}><Volume2 size={14}/> 朗读定义</button></div><p>{renderDictionaryText(dailyCurrentWord.definition, dailyCurrentWord.term)}</p>{dailyCurrentWord.definitionZh && <div className="daily-definition-zh"><b>中文解释</b><p>{dailyCurrentWord.definitionZh}</p></div>}</div>
              <div className="daily-detail-section"><span>WORD PARTS · 词根拆解</span><div className="parts-row">{dailyCurrentWord.parts.map((part,index)=><div className="part-chip" key={index}><b>{part.part}</b><small>{renderDictionaryText(part.meaning, dailyCurrentWord.term)}</small>{part.meaningZh && <small className="part-zh">{part.meaningZh}</small>}</div>)}</div></div>
              {dailyCurrentWord.example && <div className="daily-detail-section"><span>CLINICAL EXAMPLE · 医学例句</span><p className="example-en">{renderDictionaryText(dailyCurrentWord.example, dailyCurrentWord.term)}</p>{dailyCurrentWord.exampleZh && <p className="example-zh">{dailyCurrentWord.exampleZh}</p>}<div className="audio-controls"><button className="inline-audio" onClick={()=>playExample(dailyCurrentWord,1)}><Volume2 size={14}/> 播放例句</button></div></div>}
              <div className="daily-word-actions"><button className="secondary-button" onClick={()=>markReview(dailyCurrentWord)}><RotateCcw size={15}/> 加入复习</button><button className="secondary-button" onClick={()=>markKnown(dailyCurrentWord)}><Check size={15}/> 标记已掌握</button></div>
            </article>
            <div className="daily-word-navigation"><button className="secondary-button" onClick={previousDailyWord} disabled={progress.dailyStudyIndex===0}><ChevronLeft size={17}/> 上一个</button><span>{progress.dailyStudyIndex+1} / {dailyWords.length}</span><button className="primary-button" onClick={nextDailyWord}>{progress.dailyStudyIndex===dailyWords.length-1?"完成今日新词":"下一个"} <ChevronRight size={17}/></button></div>
          </div>}

          {progress.dailyStudyCompleted && !dailyShowList && <div className="daily-complete-card"><div className="daily-complete-icon"><Check size={30}/></div><span className="daily-kicker">STEP 3 · NEW WORDS COMPLETED</span><h2>今日新词学习完成！</h2><p>你已经逐个学习了今日词单中的 {progress.dailyCompletedIds.length} / {dailyWords.length} 个单词。接下来进入复习，巩固记忆。</p><div className="daily-complete-stats"><b>{dailyWords.length}</b><span>今日新词</span><b>{dailyPercent}%</b><span>学习进度</span></div><button className="primary-button" onClick={startReview}><Repeat2 size={17}/> 进入今日复习 <ArrowRight size={17}/></button><button className="daily-back-link" onClick={()=>setDailyShowList(true)}>查看今日词单</button></div>}
        </div>}


        {tab==="chapters" && <div className="page-content chapter-vocab-page">
          <div className="page-title-row">
            <div><div className="eyebrow">CHAPTER 1–22 · TEXTBOOK VOCABULARY</div><h1>22章独立单词表</h1><p>教材正文词汇索引 · 顺序学习 · 按章复习 · 与总词库共享进度</p></div>
            <div className="count-chip">{indexedChapterWordCount} INDEXED</div>
          </div>
          <div className="chapter-vocab-notice">
            <BookOpen size={17}/>
            <div><b>词条归属来自第13版 PDF 的章节正文</b><span>已将 Mini-Dictionary 的词条与第1–22章正文匹配，并按各章首次出现顺序排列。同一词可出现在多个章节；这里显示的是匹配到的词条，而不是出版社提供的完整章末词表。未匹配词仍保留在总词库。</span></div>
          </div>
          <div className="chapter-vocab-grid">
            <aside className="chapter-vocab-sidebar">
              <h3>选择教材章节</h3>
              <div className="chapter-vocab-scroll">
                {chapters.map(ch=>{
                  const stats=getChapterVocabularyStats(ch.number,progress);
                  return <button key={ch.number} onClick={()=>{
                    setSelectedChapter(ch.number);setChapterQuery("");setChapterFilter("all");
                  }} className={selectedChapter===ch.number?"active":""}>
                    <span className="chapter-vocab-no">{String(ch.number).padStart(2,"0")}</span>
                    <span className="chapter-vocab-mini"><b>{ch.title}</b><small>{stats.learned}/{stats.total} 已学习 · {stats.mastered} 已掌握</small></span>
                    <ChevronRight size={15}/>
                  </button>;
                })}
              </div>
            </aside>
            <section className="chapter-vocab-main">
              <div className="chapter-vocab-main-heading">
                <div><span className="eyebrow">CHAPTER {String(selectedChapter).padStart(2,"0")}</span>
                  <h2>{chapters[selectedChapter-1]?.title}</h2>
                  <p>{chapters[selectedChapter-1]?.phase==="Foundation"?"医学词根、结构与基础术语":chapters[selectedChapter-1]?.phase==="Specialties"?"医学专科与临床语言":"器官系统、诊断与检查操作"}</p>
                </div>
                <Link className="chapter-vocab-lesson-link" href={"/cpc/learn/?chapter="+selectedChapter}>学习本章医学课程 <ArrowRight size={14}/></Link>
              </div>
              <div className="chapter-vocab-stat-grid">
                <div><strong>{activeChapterStats.total}</strong><span>正文匹配词</span></div>
                <div><strong>{activeChapterStats.learned}</strong><span>已经学习</span></div>
                <div><strong>{activeChapterStats.mastered}</strong><span>已经掌握</span></div>
                <div><strong>{activeChapterStats.due}</strong><span>待复习</span></div>
              </div>
              <div className="chapter-vocab-progress"><span style={{width:(activeChapterStats.total?Math.round(activeChapterStats.learned/activeChapterStats.total*100):0)+"%"}}/></div>
              <div className="chapter-vocab-actions">
                <button className="primary-button" onClick={()=>startChapterNewWords(selectedChapter)} disabled={activeChapterStats.pending===0}>
                  <Play size={15}/> 学习本章新词（{progress.dailySize}词）
                </button>
                <button className="secondary-button" onClick={()=>selectChapterReview(selectedChapter)} disabled={!getChapterReviewWordIds(selectedChapter,progress).length}>
                  <Repeat2 size={15}/> 复习本章已学
                </button>
                <button className="secondary-button" onClick={()=>selectChapterReview(selectedChapter,true)}>
                  <PencilLine size={15}/> 全章词汇测验
                </button>
              </div>
              {activeChapterStats.pending===0 && <p className="chapter-vocab-complete"><Check size={15}/> 本章新词已经学完。你可以复习本章，也可以继续自动顺序学习下一章。</p>}
              <div className="chapter-vocab-filterbar">
                <label><Search size={15}/><input value={chapterQuery} onChange={e=>setChapterQuery(e.target.value)} placeholder="搜索本章英文、中文或解释"/></label>
                <select value={chapterFilter} onChange={e=>setChapterFilter(e.target.value as typeof chapterFilter)}>
                  <option value="all">全部单词</option><option value="pending">未学习</option>
                  <option value="learned">已学习</option><option value="known">已掌握</option>
                  <option value="review">待复习</option>
                </select>
              </div>
              <div className="chapter-vocab-list-heading"><b>章节词表</b><span>显示 {chapterFilteredWords.length} / {chapterWords.length} 项 · 顺序依据该词在本章正文首次出现的位置</span></div>
              <div className="chapter-vocab-word-list">
                {chapterFilteredWords.map((word,i)=>{
                  const mastered=progress.knownIds.includes(word.id);
                  const learned=mastered||progress.introducedIds.includes(word.id);
                  const due=progress.reviewIds.includes(word.id);
                  return <article key={word.id} className="chapter-vocab-word">
                    <span className="chapter-vocab-word-no">{String(i+1).padStart(3,"0")}</span>
                    <div className="chapter-vocab-word-main"><b>{word.term}</b><span>{word.meaning||"中文词义待补全"}</span><small>{word.definition}</small>
                      <em>{getWordChapters(word.id).length>1?"相关章节 "+getWordChapters(word.id).join("、"):"本章词汇"}</em>
                    </div>
                    <div className="chapter-vocab-word-buttons">
                      <span className={mastered?"is-mastered":due?"is-due":learned?"is-learned":"is-new"}>{mastered?"已掌握":due?"待复习":learned?"已学习":"新词"}</span>
                      <button onClick={()=>{
                        setSelected(word);setCategory("All");setQuery(word.term);changeTab("words");
                      }}>词条详情 <ChevronRight size={13}/></button>
                      <button onClick={()=>markReview(word)} disabled={due||mastered}><Repeat2 size={13}/> 加入复习</button>
                    </div>
                  </article>;
                })}
                {!chapterFilteredWords.length&&<div className="chapter-vocab-empty">本章没有符合筛选条件的词条。</div>}
              </div>
            </section>
          </div>
          <p className="chapter-vocab-footer">未在章节正文中精确匹配到的词共有 {unassignedSourceWords.length} 项，仍可在「词汇库」查询。新词自动路线会在第22章之后安排这些词，并保留手动添加的生词。原有历史学习记录不会清零。</p>
        </div>}

        {tab==="words" && <div className="page-content">
          <div className="page-title-row"><div><div className="eyebrow">MEDICAL TERMINOLOGY</div><h1>医学词汇库</h1><p>Search, study and master medical terms.</p></div><div className="count-chip">{allWords.length} TERMS</div></div>
          <div className="vocab-layout"><div className="vocab-list-panel"><div className="search-box"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="搜索英文、中文、词根…" /><span>{filteredWords.length}</span></div><div className="category-scroll">{categories.map(c=><button key={c} onClick={()=>setCategory(c)} className={category===c?"filter-active":""}>{c==="All"?"全部":c}</button>)}</div><div className="vocab-list">{filteredWords.map(w=><button key={w.id} className={`vocab-row ${selected.id===w.id?"selected":""}`} onClick={()=>setSelected(w)}><span className="word-initial">{w.term[0].toUpperCase()}</span><span className="vocab-row-text"><b>{w.term}</b><small>{w.meaning || w.definition}</small></span><span className="row-status">{progress.knownIds.includes(w.id)?<Check size={16}/>:<span/>}</span></button>)}{filteredWords.length===0&&<div className="empty-state">没有找到匹配词汇。<br/>Try another search.</div>}</div></div>
          <div className="word-detail"><div className="detail-top"><span className="detail-category">{selected.category}</span><div className="audio-controls"><button className="speaker-button" onClick={()=>playWord(selected,1)}><Volume2 size={18}/> 正常发音</button><button className="speaker-button" onClick={()=>playWord(selected,0.75)}>慢速</button></div></div><div className="detail-term">{selected.term}</div><div className="detail-meaning">{selected.meaning || "中文释义待补充"}</div>{selected.meaningSource === "machine-translation" && <div className="translation-source">自动翻译参考译名 · 建议结合英文定义核对</div>}{selected.pronunciation && <div className="pronunciation-guide">教材注音：{selected.pronunciation}</div>}<div className="detail-definition"><div className="definition-heading"><span>ENGLISH DEFINITION</span><small className="definition-hint">点击英文单词可翻译</small><button className="inline-audio" onClick={()=>playDefinition(selected)}><Volume2 size={14}/> 朗读定义</button></div><p>{renderDictionaryText(selected.definition, selected.term)}</p>{selected.definitionZh && <div className="detail-definition-zh"><span>中文解释</span><p>{selected.definitionZh}</p></div>}</div><div className="detail-block"><div className="block-label">WORD PARTS <span>词根拆解</span></div><div className="parts-row">{selected.parts.map((p,i)=><div className="part-chip" key={i}><b>{p.part}</b><small>{renderDictionaryText(p.meaning, selected.term)}</small>{p.meaningZh && <small className="part-zh">{p.meaningZh}</small>}</div>)}</div></div>{selected.example && <div className="detail-block"><div className="block-label">CLINICAL EXAMPLE <span>医学例句</span></div><p className="example-en">{renderDictionaryText(selected.example, selected.term)}</p>{selected.exampleZh && <p className="example-zh">{selected.exampleZh}</p>}<div className="audio-controls"><button className="inline-audio" onClick={()=>playExample(selected,1)}><Volume2 size={15}/> 正常播放</button><button className="inline-audio" onClick={()=>playExample(selected,0.75)}>慢速播放</button></div></div>}<div className="detail-actions"><button className="secondary-button" onClick={()=>markReview(selected)}><RotateCcw size={16}/> 加入复习</button><button className="primary-button" onClick={()=>markKnown(selected)}><Check size={17}/> 我已掌握</button></div><p className="detail-footnote">独立预生成的美式英语 MP3 音频 · 离线可播放 · 慢速播放 0.75×。不使用手机 TTS 或语音包。</p><div className="audio-help-actions"><button className="inline-audio" onClick={()=>playWord(selected,1)}><Volume2 size={15}/> 试听当前单词</button></div>
          <PronunciationFeedback term={selected.term}/><TranslationFeedback term={selected.term} meaning={selected.meaning}/></div></div>
        </div>}

        {tab==="review" && <div className="page-content narrow-content">
          <div className="page-title-row"><div><div className="eyebrow">DAILY MULTI-ROUND REVIEW</div><h1>每日多轮复习</h1><p>{reviewSourceLabel} · 选择复习轮数及方式，逐词回忆与拼写。</p></div><div className="count-chip">{reviewPool.length} TERMS</div></div>
          {!reviewActive && !reviewFinished && <div className="practice-card review-setup">
            <div className="dictation-symbol"><Repeat2 size={28}/></div>
            <h2>选择长期复习方式</h2>
            <p>默认以听音默写为主，也可以切换中译英或英译中。系统会记住你的选择。</p>
            <div className="review-mode-selector">
              <button className={reviewMode==="dictation"?"review-mode-active":""} onClick={()=>chooseReviewMode("dictation")}><b>默写</b><small>听发音，写出英文单词</small><span>主要模式</span></button>
              <button className={reviewMode==="zh-en"?"review-mode-active":""} onClick={()=>chooseReviewMode("zh-en")}><b>中译英</b><small>看到中文，写出英文</small></button>
              <button className={reviewMode==="en-zh"?"review-mode-active":""} onClick={()=>chooseReviewMode("en-zh")}><b>英译中</b><small>看到英文，写出中文</small></button>
            </div>
            <h3 className="review-round-title">今天复习几轮？</h3>
            <p>{reviewSourceLabel}，本轮共 {reviewPool.length} 个词。</p><button className="chapter-vocab-reset-review" onClick={()=>{setReviewSessionIds([]);setReviewSourceLabel("今日新词与长期复习");}}>切换为全局复习</button>
            <div className="round-selector">{[1,2,3,5,10].map(n=><button key={n} className={reviewRounds===n?"round-selected":""} onClick={()=>chooseReviewRounds(n)}>{n} 轮</button>)}</div>
            <button className="primary-button" onClick={startReview} disabled={!reviewPool.length}><Play size={16} fill="currentColor"/> 开始第 1 轮</button>
            {!reviewPool.length && <div className="answer-hint">请先完成今日新词学习，或在词汇库中将单词加入复习。</div>}
            <div className="answer-hint">每轮结束都会记录正确率；答错的词自动加入长期待复习列表。</div>
          </div>}
          {reviewActive && currentReviewWord && <div className="practice-card dictation-card">
            <div className="practice-progress"><span>ROUND {reviewRound} / {reviewRounds} · {reviewMode==="dictation"?"默写":reviewMode==="zh-en"?"中译英":"英译中"}</span><span>{reviewIndex+1} / {reviewPool.length}</span></div>
            <div className="dictation-symbol"><PencilLine size={28}/></div>
            {reviewMode==="dictation" && <>
              <h2>听音默写</h2><p>先听清发音，再独立写出完整的英文医学术语。</p>
              {words.some(word=>word.id===currentReviewWord.id)
                ? <button className="play-button" onClick={()=>playWord(currentReviewWord,0.85)}><Volume2 size={18}/> 播放单词</button>
                : <div className="dictation-prompt">{currentReviewWord.meaning || currentReviewWord.term}</div>}
            </>}
            {reviewMode==="zh-en" && <>
              <div className="prompt-label">CHINESE → ENGLISH</div>
              <div className="dictation-prompt">{currentReviewWord.meaning || "暂无中文释义"}</div>
              <p>根据中文释义，默写对应的英文医学术语。</p>
            </>}
            {reviewMode==="en-zh" && <>
              <div className="prompt-label">ENGLISH → CHINESE</div>
              <div className="dictation-prompt">{currentReviewWord.term}</div>
              <p className="review-definition-prompt">{currentReviewWord.definition}</p>
              <p>写出这个英文医学术语的中文释义。</p>
            </>}
            {currentReviewWord.pronunciation && reviewMode!=="en-zh" && <div className="pronunciation-guide">教材注音：{currentReviewWord.pronunciation}</div>}
            <div className="listen-answer">
              <label>{reviewMode==="en-zh"?"请输入中文释义":"请写出对应的英文医学术语"}</label>
              <input value={reviewAnswer} onChange={e=>{setReviewAnswer(e.target.value);setReviewFeedback(null);}} onKeyDown={e=>e.key==="Enter"&&submitReviewAnswer()} placeholder={reviewMode==="en-zh"?"输入中文释义…":"Type the medical term…"} />
              <button className="primary-button full-button" onClick={submitReviewAnswer} disabled={!reviewAnswer.trim() || Boolean(reviewFeedback)}>提交答案 <Check size={16}/></button>
              {reviewFeedback && <div className={`feedback ${reviewFeedback}`}>{reviewFeedback==="correct"?"✓ 正确！":(reviewMode==="en-zh"?"参考答案："+currentReviewWord.meaning:"正确答案："+currentReviewWord.term)}</div>}
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
          <div className="practice-card"><div className="practice-progress"><span>LISTENING · {listeningIndex+1}</span><span>{listeningIndex+1} / 10</span></div><div className="sound-visual"><div className="sound-orb"><AudioLines size={36}/></div><div className="sound-rings"/></div><h2>听一听，你听到了什么？</h2><p>点击播放按钮，仔细听清医学单词的发音。</p><button className="play-button" onClick={()=>playWord(words[listeningIndex%words.length],1)}><Play size={20} fill="currentColor"/> 播放单词</button><div className="listen-hint">American English · en-US</div><div className="practice-divider"/><div className="listen-answer"><label>你听到的单词是什么？</label><input value={answer} onChange={e=>{setAnswer(e.target.value);setFeedback(null);}} onKeyDown={e=>e.key==="Enter"&&setFeedback(normalize(answer)===normalize(words[listeningIndex%words.length].term)?"correct":"wrong")} placeholder="Type the medical term…" /><button className="primary-button full-button" onClick={()=>{const ok=normalize(answer)===normalize(words[listeningIndex%words.length].term);setFeedback(ok?"correct":"wrong");update({...progress,attempts:progress.attempts+1,correct:progress.correct+(ok?1:0)});}}>检查答案</button>{feedback&&<div className={`feedback ${feedback}`}>{feedback==="correct"?"✓ 正确！Great listening.":`正确答案：${words[listeningIndex%words.length].term}`}</div>}<button className="next-button" onClick={()=>{setListeningIndex(i=>i+1);setAnswer("");setFeedback(null);}}>下一题 <ArrowRight size={16}/></button></div></div>
        </div>}

        {tab==="dictation" && <div className="page-content narrow-content">
          <div className="page-title-row"><div><div className="eyebrow">ACTIVE RECALL TRAINING</div><h1>听力与默写</h1><p>Practice spelling, meaning, roots and clinical context.</p></div><div className="count-chip">5 MODES</div></div>
          <div className="mode-tabs">{([{id:"word",label:"听音拼写"},{id:"meaning",label:"中文释义"},{id:"definition",label:"英文定义"},{id:"root",label:"词根组合"},{id:"clinical",label:"临床语境"}] as {id:DictationMode;label:string}[]).map(m=><button key={m.id} className={dictationMode===m.id?"mode-active":""} onClick={()=>{setDictationMode(m.id);nextQuestion(m.id);}}>{m.label}</button>)}</div>
          <div className="practice-card dictation-card"><div className="practice-progress"><span>{promptFor(question,dictationMode).label.toUpperCase()}</span><button className="quiet-button" onClick={()=>nextQuestion()}><RotateCcw size={15}/> 换一题</button></div>{dictationMode==="word"?<><div className="dictation-symbol"><Headphones size={30}/></div><h2>听发音，写出单词</h2><p>点击播放按钮，听完后输入完整的医学术语。</p><button className="play-button" onClick={()=>playWord(question,1)}><Volume2 size={19}/> 播放发音</button></>:<><div className="prompt-label">{dictationMode==="meaning"?"CHINESE MEANING":dictationMode==="definition"?"ENGLISH DEFINITION":dictationMode==="root"?"WORD PARTS":"CLINICAL CONTEXT"}</div><div className="dictation-prompt">{promptFor(question,dictationMode).prompt}</div></>}<div className="listen-answer"><label>请输入英文医学术语</label><input value={answer} onChange={e=>{setAnswer(e.target.value);setFeedback(null);}} onKeyDown={e=>e.key==="Enter"&&submitAnswer()} placeholder="Type your answer…" /><button className="primary-button full-button" onClick={submitAnswer} disabled={!answer.trim()}>提交答案 <Check size={16}/></button>{feedback&&<div className={`feedback ${feedback}`}>{feedback==="correct"?"✓ 正确！Well done.":`再记一下：${question.term} — ${question.meaning}`}</div>}</div><div className="answer-hint"><CircleHelp size={15}/> 拼写需完整匹配；大小写和多余空格不影响判分。</div></div>
        </div>}

        {tab==="roots" && <div className="page-content">
          <div className="page-title-row"><div><div className="eyebrow">WORD BUILDING BLOCKS</div><h1>词根与词缀</h1><p>Understand how medical terms are constructed.</p></div><div className="count-chip">{wordParts.length} PARTS</div></div>
          <div className="roots-intro"><div className="roots-icon"><Brain size={25}/></div><div><b>拆解医学术语的构成</b><p>掌握常见 combining forms、prefixes 和 suffixes，帮助你理解陌生医学词汇。</p></div></div>
          <div className="roots-grid">{wordParts.map((p,i)=><div className="root-card" key={i}><span className="root-index">{String(i+1).padStart(2,"0")}</span><b>{p.part}</b><span>{renderDictionaryText(p.meaning, "词根词缀表")}</span>{p.meaningZh && <small className="root-card-zh">{p.meaningZh}</small>}<button onClick={()=>playPart(p.part,i)}><Volume2 size={14}/> 听发音</button></div>)}</div>
        </div>}

        {tab==="progress" && <div className="page-content">
          <div className="page-title-row"><div><div className="eyebrow">YOUR LEARNING ANALYTICS</div><h1>学习进度</h1><p>Track your vocabulary growth and practice accuracy.</p></div><div className="count-chip">LOCAL DATA</div></div>
          <div className="progress-overview"><div className="progress-ring" style={{background:`conic-gradient(#6759d8 ${allWords.length?progress.knownIds.length/allWords.length*360:0}deg,#e9eaf1 0deg)`}}><div><b>{Math.round(progress.knownIds.length/allWords.length*100)}%</b><span>掌握率</span></div></div><div className="progress-copy"><h2>持续学习，逐步建立词汇基础。</h2><p>你的学习记录保存在当前设备浏览器中。</p><div className="progress-metrics"><span><b>{progress.knownIds.length}</b> 已掌握</span><span><b>{dueWords.length}</b> 待复习</span><span><b>{progress.attempts}</b> 总练习</span><span><b>{accuracy}%</b> 正确率</span></div></div></div>
          <div className="section-heading"><div><h3>多轮复习记录</h3><p>Daily review history</p></div><span className="section-link">{progress.reviewHistory.length} rounds</span></div>
          <div className="word-preview">{progress.reviewHistory.length ? [...progress.reviewHistory].slice(-10).reverse().map((item,index)=><div className="preview-row" key={`${item.date}-${item.round}-${index}`}><span className="word-initial"><Repeat2 size={15}/></span><span className="preview-term"><b>{item.date} · 第 {item.round} 轮</b><small>完成 {item.total} 个词</small></span><span className="preview-zh">{item.correct}/{item.total} · {item.total?Math.round(item.correct/item.total*100):0}%</span></div>) : <div className="empty-state">完成第一轮复习后，这里会显示每轮的正确率。</div>}</div>
          <div className="section-heading"><div><h3>需要加强的词汇</h3><p>Review queue</p></div><span className="section-link">{dueWords.length} terms</span></div>
          <div className="word-preview">{dueWords.length?dueWords.map(w=><button key={w.id} className="preview-row" onClick={()=>{setSelected(w);changeTab("words");}}><span className="word-initial"><RotateCcw size={16}/></span><span className="preview-term"><b>{w.term}</b><small>{w.definition}</small></span><span className="preview-zh">{w.meaning || "查看英文释义"}</span><ArrowRight size={16}/></button>):<div className="empty-state">目前没有待复习词汇。完成练习后，答错的词会自动加入这里。</div>}</div>
          <ProgressBackup/>
          <button className="reset-button" onClick={()=>{if(window.confirm("确定清空本设备上的 CPC Academy 学习记录吗？")){update(emptyProgress);}}}>清空本地学习记录</button>
        </div>}
        {dictionaryOpen && <div className="dictionary-backdrop" onClick={()=>setDictionaryOpen(false)}>
          <section className="dictionary-modal" role="dialog" aria-modal="true" aria-label="英汉词典" onClick={event=>event.stopPropagation()}>
            <div className="dictionary-modal-top"><div><span className="daily-kicker">OFFLINE ENGLISH-CHINESE DICTIONARY</span><h2>单词翻译</h2></div><button className="dictionary-close" onClick={()=>setDictionaryOpen(false)} aria-label="关闭">×</button></div>
            <div className="dictionary-entry-word">{dictionaryWord}</div>
            {dictionaryLoading ? <p className="dictionary-status">正在读取内置离线词典…</p> : dictionaryTranslation ? <div className="dictionary-translation"><span>中文释义 · 离线词典</span><p>{dictionaryTranslation}</p></div> : <p className="dictionary-status">内置词典暂未收录该词。你仍可在下方补充中文释义并加入生词本。</p>}
            <label className="dictionary-input-label">中文释义（可修改）</label>
            <input className="dictionary-translation-input" value={dictionaryTranslation} onChange={event=>setDictionaryTranslation(event.target.value)} placeholder="输入或修改中文翻译…" />
            <TranslationFeedback term={dictionaryWord} meaning={dictionaryTranslation}/>
            <div className="dictionary-modal-actions">
              <button className="secondary-button" onClick={()=>setDictionaryOpen(false)}>关闭</button>
              <button className="primary-button" onClick={addDictionaryWord}>{allWords.some(word=>word.term.toLowerCase()===dictionaryWord.toLowerCase())?"加入待复习":"加入生词 · Other"}</button>
            </div>
          </section>
        </div>}
        <footer className="page-footer">CPC ACADEMY <span>·</span> PERSONAL STUDY EDITION <span>·</span> V{APP_VERSION}</footer>
      </section>

      <nav className="mobile-nav">{navItems.slice(0,5).map(item=>{const Icon=item.icon;return <button key={item.id} className={tab===item.id?"mobile-active":""} onClick={()=>changeTab(item.id)}><Icon size={19}/><span>{item.label}</span></button>;})}<Link className="cpc-mobile-link" href="/cpc/" prefetch={false} aria-label="进入医学课程和CPC专业编码学习中心"><BookOpen size={19}/><small>课程</small></Link></nav>
    </main>
  );
}
