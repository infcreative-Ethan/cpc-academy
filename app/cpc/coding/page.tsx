"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, BookOpen, Check, CheckCircle2, ChevronDown, ChevronRight,
  ClipboardCheck, Clock3, ExternalLink, FileSearch, FileText, GraduationCap,
  ListChecks, Search, ShieldCheck, Stethoscope, Target
} from "lucide-react";
import { practiceCases } from "@/lib/cpc-curriculum";
import {
  codingTracks, codingUnits, codingVersions, codingWorkflow, cpcExamDomains,
  officialCodingResources, type CodingTrack
} from "@/lib/cpc-professional-curriculum";
import { codingLessonDetails } from "@/lib/cpc-coding-lesson-content";
import { caseBankSummary } from "@/lib/cpc-case-bank";
import "./coding.css";

type Tab = "path" | CodingTrack | "workspace" | "exam";
type Draft = {
  encounter: string;
  diagnosis: string;
  anatomy: string;
  laterality: string;
  procedure: string;
  codeSet: string;
  missing: string;
  rationale: string;
  checks: boolean[];
};
type SavedState = {
  completedLessons: string[];
  passedCodingLessons: Record<string,{score:number;date:string}>;
  completedCases: string[];
  drafts: Record<string, Draft>;
};

const STORAGE_KEY = "cpc-academy-professional-coding-v1";
const emptyDraft: Draft = {
  encounter: "Office / outpatient professional service",
  diagnosis: "",
  anatomy: "",
  laterality: "",
  procedure: "",
  codeSet: "ICD-10-CM",
  missing: "",
  rationale: "",
  checks: [false, false, false, false, false, false, false, false],
};
const emptySaved: SavedState = { completedLessons: [], passedCodingLessons: {}, completedCases: [], drafts: {} };
const tabs: { id: Tab; label: string; en: string }[] = [
  { id: "path", label: "学习路线", en: "Pathway" },
  { id: "icd10", label: "ICD-10-CM", en: "Diagnosis" },
  { id: "cpt", label: "CPT®", en: "Professional services" },
  { id: "hcpcs", label: "HCPCS", en: "Supplies & drugs" },
  { id: "compliance", label: "规则与合规", en: "Modifiers & edits" },
  { id: "workspace", label: "编码工作台", en: "Coding workspace" },
  { id: "exam", label: "考试蓝图", en: "CPC exam" },
];

export default function ProfessionalCodingPage() {
  const [tab, setTab] = useState<Tab>("path");
  const [saved, setSaved] = useState<SavedState>(emptySaved);
  const [ready, setReady] = useState(false);
  const [activeUnitId, setActiveUnitId] = useState("icd-foundations");
  const [quizChoice, setQuizChoice] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [caseId, setCaseId] = useState(practiceCases[0]?.id ?? "");
  const [caseAnswers, setCaseAnswers] = useState<Record<number, number>>({});
  const [caseSubmitted, setCaseSubmitted] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSaved({ ...emptySaved, ...JSON.parse(raw) });
    } catch {
      setSaved(emptySaved);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  }, [ready, saved]);

  const activeUnit = codingUnits.find((unit) => unit.id === activeUnitId) ?? codingUnits[0];
  const visibleUnits = useMemo(() => {
    if (tab === "path" || tab === "workspace" || tab === "exam") return codingUnits;
    return codingUnits.filter((unit) => unit.track === tab);
  }, [tab]);
  const filteredUnits = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return visibleUnits;
    return visibleUnits.filter((unit) =>
      [unit.title, unit.zh, unit.summary, ...unit.lessons, ...unit.keyPoints].join(" ").toLowerCase().includes(q)
    );
  }, [visibleUnits, search]);
  const selectedCase = practiceCases.find((item) => item.id === caseId) ?? practiceCases[0];
  const currentDraft = saved.drafts[caseId] ?? emptyDraft;
  const completedLessonCount = codingLessonDetails.filter(lesson => (saved.passedCodingLessons?.[lesson.id]?.score ?? 0) >= 80).length;
  const authoredLessonCount = codingLessonDetails.length;
  const totalLessonCount = codingUnits.reduce((sum, unit) => sum + unit.lessons.length, 0);
  const completedCaseCount = saved.completedCases.length;
  const totalExamQuestions = cpcExamDomains.reduce((sum, item) => sum + item.questions, 0);

  const saveDraft = (patch: Partial<Draft>) => {
    setSaved((prev) => ({
      ...prev,
      drafts: { ...prev.drafts, [caseId]: { ...(prev.drafts[caseId] ?? emptyDraft), ...patch } },
    }));
  };
  const selectTab = (next: Tab) => {
    setTab(next);
    setQuizChoice(null);
    setQuizSubmitted(false);
    if (next !== "path" && next !== "workspace" && next !== "exam") {
      const first = codingUnits.find((unit) => unit.track === next);
      if (first) setActiveUnitId(first.id);
    }
    if (next === "path") setSearch("");
  };
  const score = selectedCase
    ? selectedCase.questions.reduce((sum, question, index) => sum + (caseAnswers[index] === question.answer ? 1 : 0), 0)
    : 0;
  const caseAnsweredAll = selectedCase
    ? selectedCase.questions.every((_, index) => caseAnswers[index] !== undefined)
    : false;

  if (!ready) return <main className="coding-loading"><div className="coding-mark">C</div><p>CPC Professional Coding 正在加载…</p></main>;

  return (
    <main className="coding-shell">
      <header className="coding-topbar">
        <Link href="/cpc" className="coding-back"><ArrowLeft size={16} /> 返回 CPC Academy</Link>
        <div className="coding-brand"><span className="coding-mark">C</span><span><b>CPC Academy</b><small>PROFESSIONAL CODING</small></span></div>
        <span className="coding-version">CPC Academy · Course & Cases</span>
      </header>

      <section className="coding-content">
        <div className="coding-hero">
          <div>
            <span className="coding-eyebrow"><GraduationCap size={14} /> PROFESSIONAL CODING PATHWAY</span>
            <h1>从医学理解，<em>进入专业编码。</em></h1>
            <p>以完整病历为起点，学习 ICD-10-CM、CPT®、HCPCS Level II、编码规则和实际审核流程。</p>
            <div className="coding-shortcuts"><button className="coding-primary" onClick={() => selectTab("icd10")}>开始 ICD-10-CM <ArrowRight size={15} /></button><Link href="/cpc/coding/cases/" className="coding-shortcut-link">228份病例库 <FileSearch size={15}/></Link><Link href="/cpc/mock-exam/" className="coding-shortcut-link">100题模拟考试 <GraduationCap size={15}/></Link></div>
          </div>
          <div className="coding-hero-art" aria-hidden="true"><div className="coding-orbit one" /><div className="coding-orbit two" /><div className="coding-center"><Stethoscope size={38} /><b>RECORD</b><span>→ CODE → REVIEW</span></div></div>
        </div>

        <div className="coding-stats">
          <div><BookOpen size={17} /><strong>{codingUnits.length}</strong><span>专业课程单元</span></div>
          <div><ListChecks size={17} /><strong>{authoredLessonCount}</strong><span>已制作详细课时 · 共规划{totalLessonCount}节</span></div>
          <div><FileSearch size={17} /><strong>{caseBankSummary.total}</strong><span>短病例与综合病历</span></div>
          <div><CheckCircle2 size={17} /><strong>{completedLessonCount}/{authoredLessonCount}</strong><span>检测通过课时</span></div>
        </div>

        <nav className="coding-tabs" aria-label="专业编码课程">
          {tabs.map((item) => (
            <button key={item.id} className={tab === item.id ? "active" : ""} onClick={() => selectTab(item.id)}>
              <span>{item.label}</span><small>{item.en}</small>
            </button>
          ))}
        </nav>

        {tab === "path" && (
          <section className="coding-panel">
            <div className="coding-heading">
              <div><span className="coding-eyebrow">LEARNING ORDER</span><h2>先诊断编码，再学习专业服务编码</h2><p>推荐顺序：ICD-10-CM → CPT® → HCPCS Level II → Modifiers / Compliance → 病历实战。</p></div>
            </div>
            <div className="coding-version-grid">
              {codingVersions.map((item) => (
                <article className="coding-version-card" key={item.name}>
                  <div><b>{item.name}</b><span>{item.status}</span></div>
                  <strong>{item.effective}</strong>
                  <p>{item.note}</p>
                </article>
              ))}
            </div>
            <div className="coding-track-grid">
              {codingTracks.map((track, index) => {
                const units = codingUnits.filter((unit) => unit.track === track.id);
                const lessons = units.reduce((sum, unit) => sum + unit.lessons.length, 0);
                const available = codingLessonDetails.filter(item => item.unitId && units.some(unit => unit.id === item.unitId)).length;
                const done = codingLessonDetails.filter(item => units.some(unit => unit.id === item.unitId) && (saved.passedCodingLessons?.[item.id]?.score ?? 0) >= 80).length;
                return (
                  <button key={track.id} className="coding-track-card" onClick={() => selectTab(track.id)}>
                    <span className="coding-track-index">0{index + 1}</span><b>{track.title}</b><strong>{track.zh}</strong><p>{track.description}</p>
                    <div className="coding-progress"><i style={{ width: (available ? done / available * 100 : 0) + "%" }} /></div>
                    <small>已掌握 {done}/{available} · 规划{lessons}课时 <ArrowRight size={13} /></small>
                  </button>
                );
              })}
            </div>
            <div className="coding-two-col">
              <div className="coding-card">
                <div className="coding-card-title"><Target size={17} /><b>整体学习进度</b></div>
                <div className="coding-progress-label"><span>已制作专业课程的测验掌握度</span><b>{completedLessonCount} / {authoredLessonCount}</b></div>
                <div className="coding-progress"><i style={{ width: (completedLessonCount / Math.max(authoredLessonCount, 1) * 100) + "%" }} /></div>
                <p className="coding-muted">目前规划 {totalLessonCount} 节，已经提供 {authoredLessonCount} 节独立课程；其余课时仅为大纲，不能直接标记掌握。</p>
                <div className="coding-progress-label"><span>完成病例</span><b>{completedCaseCount} / {practiceCases.length}</b></div>
                <div className="coding-progress"><i style={{ width: (completedCaseCount / Math.max(practiceCases.length, 1) * 100) + "%" }} /></div>
                <p className="coding-muted">学习进度保存在本机。清除应用数据或卸载应用可能导致本地记录丢失。</p>
              </div>
              <div className="coding-card">
                <div className="coding-card-title"><ShieldCheck size={17} /><b>编码工作原则</b></div>
                <ul className="coding-principles">
                  <li>只编码完整病历中有依据的诊断和实际服务。</li>
                  <li>先确定服务日期与医疗场景，再选择编码规则。</li>
                  <li>Index 只负责定位，必须回到 Tabular 或代码书核验。</li>
                  <li>AI 可以辅助提取信息，但不能自行确诊或替代人工审核。</li>
                </ul>
              </div>
            </div>
          </section>
        )}

        {(tab === "icd10" || tab === "cpt" || tab === "hcpcs" || tab === "compliance") && (
          <section className="coding-panel">
            <div className="coding-heading">
              <div><span className="coding-eyebrow">STRUCTURED COURSE</span><h2>{codingTracks.find((item) => item.id === tab)?.title} · {codingTracks.find((item) => item.id === tab)?.zh}</h2><p>{codingTracks.find((item) => item.id === tab)?.description}</p></div>
              <span className="coding-priority">P0 = 核心必修 · P1 = 进阶</span>
            </div>
            <label className="coding-search"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="搜索课程、课时或知识点…" /></label>
            <div className="coding-learning-layout">
              <aside className="coding-unit-list">
                {filteredUnits.map((unit) => {
                  const available = codingLessonDetails.filter(item => item.unitId === unit.id).length;
                  const done = codingLessonDetails.filter(item => item.unitId === unit.id && (saved.passedCodingLessons?.[item.id]?.score ?? 0) >= 80).length;
                  return (
                    <button key={unit.id} className={activeUnitId === unit.id ? "active" : ""} onClick={() => { setActiveUnitId(unit.id); setQuizChoice(null); setQuizSubmitted(false); }}>
                      <span>{unit.track.toUpperCase()}</span><b>{unit.zh}</b><small>已掌握 {done}/{available} · 规划{unit.lessons.length}课时</small>
                    </button>
                  );
                })}
                {!filteredUnits.length && <p className="coding-empty">没有匹配课程。</p>}
              </aside>
              <article className="coding-unit-detail">
                <div className="coding-unit-top"><span>{activeUnit.priority} · {activeUnit.duration}</span><small>{activeUnit.title}</small></div>
                <h3>{activeUnit.zh}</h3>
                <p className="coding-summary">{activeUnit.summary}</p>
                <div className="coding-subsection"><b>学习目标</b><ul>{activeUnit.objectives.map((item) => <li key={item}>{item}</li>)}</ul></div>
                <div className="coding-subsection"><b>知识讲解</b><ul>{activeUnit.keyPoints.map((item) => <li key={item}>{item}</li>)}</ul></div>
                <div className="coding-subsection"><b>推荐工作流程</b><ol>{activeUnit.workflow.map((item) => <li key={item}>{item}</li>)}</ol></div>
                <div className="coding-caution"><ShieldCheck size={16} /><p>{activeUnit.caution}</p></div>
                <div className="coding-subsection"><b>本单元课时</b>
                  <p className="coding-muted">已制作课时可进入独立课堂，完成测验后才计入掌握度。尚未制作的课时只显示课程名称。</p>
                  <div className="coding-lesson-list">
                    {activeUnit.lessons.map((lesson, index) => {
                      const id = activeUnit.id + ":" + index;
                      const authored = codingLessonDetails.some(item => item.id === id);
                      const done = (saved.passedCodingLessons?.[id]?.score ?? 0) >= 80;
                      return authored ? <Link key={id} href={"/cpc/coding/lesson/?unit=" + activeUnit.id + "&lesson=" + index} className={done ? "done" : ""}><span>{done ? <CheckCircle2 size={16} /> : <span className="coding-lesson-number">{index + 1}</span>}</span><b>{lesson}</b><small>{done ? "已通过" : "进入学习"}</small></Link> :
                        <div key={id} className="coding-lesson-pending"><span className="coding-lesson-number">{index + 1}</span><b>{lesson}</b><small>详细课时待制作</small></div>;
                    })}
                  </div>
                </div>
                <div className="coding-quiz">
                  <div className="coding-subsection"><b>知识检查</b><p>{activeUnit.quiz.question}</p></div>
                  <div className="coding-options">
                    {activeUnit.quiz.options.map((option, index) => (
                      <button key={option} disabled={quizSubmitted} className={quizChoice === index ? "selected" : ""} onClick={() => setQuizChoice(index)}>
                        <span>{String.fromCharCode(65 + index)}</span>{option}
                      </button>
                    ))}
                  </div>
                  {!quizSubmitted ? <button className="coding-primary" disabled={quizChoice === null} onClick={() => setQuizSubmitted(true)}>提交答案</button> : (
                    <div className={quizChoice === activeUnit.quiz.answer ? "coding-feedback correct" : "coding-feedback wrong"}>
                      <b>{quizChoice === activeUnit.quiz.answer ? "回答正确" : "需要复习"}</b><p>{activeUnit.quiz.explanation}</p><button className="coding-text-button" onClick={() => { setQuizChoice(null); setQuizSubmitted(false); }}>再做一次</button>
                    </div>
                  )}
                </div>
              </article>
            </div>
          </section>
        )}

        {tab === "workspace" && (
          <section className="coding-panel">
            <div className="coding-heading"><div><span className="coding-eyebrow">DOCUMENTATION-FIRST PRACTICE</span><h2>实际编码工作台</h2><p>保留原有4份工作台病历，同时新增228份独立病例练习与本地记录功能。所有记录均为虚构教育用途。</p><Link href="/cpc/coding/cases/" className="coding-case-bank-link">进入228份病例库 <ArrowRight size={15}/></Link></div>
            <div className="coding-workspace-layout">
              <aside className="coding-case-list">
                {practiceCases.map((item) => (
                  <button key={item.id} className={caseId === item.id ? "active" : ""} onClick={() => { setCaseId(item.id); setCaseAnswers({}); setCaseSubmitted(false); }}>
                    <span>{item.system}</span><b>{item.title}</b><small>{item.level}</small>
                  </button>
                ))}
              </aside>
              <div className="coding-case-main">
                {selectedCase && (
                  <>
                    <div className="coding-record">
                      <div><FileText size={16} /><b>SIMULATED MEDICAL RECORD</b><span>FICTIONAL CASE</span></div>
                      <p>{selectedCase.record}</p>
                      <small>训练重点：{selectedCase.focus}</small>
                    </div>
                    <div className="coding-form-grid">
                      <label>医疗场景
                        <select value={currentDraft.encounter} onChange={(e) => saveDraft({ encounter: e.target.value })}>
                          <option>Office / outpatient professional service</option><option>Outpatient hospital</option><option>Ambulatory surgical center</option><option>Emergency department</option><option>Inpatient facility</option><option>Telehealth</option>
                        </select>
                      </label>
                      <label>诊断（只填写病历明确记录）
                        <input value={currentDraft.diagnosis} onChange={(e) => saveDraft({ diagnosis: e.target.value })} placeholder="Provider-documented diagnosis" />
                      </label>
                      <label>解剖部位 / 结构
                        <input value={currentDraft.anatomy} onChange={(e) => saveDraft({ anatomy: e.target.value })} placeholder="Anatomical site / structure" />
                      </label>
                      <label>侧别
                        <select value={currentDraft.laterality} onChange={(e) => saveDraft({ laterality: e.target.value })}>
                          <option value="">未确定 / 不适用</option><option>Right</option><option>Left</option><option>Bilateral</option><option>Not documented</option>
                        </select>
                      </label>
                      <label>实际完成的操作 / 服务
                        <input value={currentDraft.procedure} onChange={(e) => saveDraft({ procedure: e.target.value })} placeholder="Documented procedure or service" />
                      </label>
                      <label>需要查询的代码集
                        <select value={currentDraft.codeSet} onChange={(e) => saveDraft({ codeSet: e.target.value })}>
                          <option>ICD-10-CM</option><option>CPT®</option><option>HCPCS Level II</option><option>More than one code set</option>
                        </select>
                      </label>
                      <label className="wide">缺失或需要澄清的信息
                        <textarea value={currentDraft.missing} onChange={(e) => saveDraft({ missing: e.target.value })} placeholder="What information is missing or conflicting?" rows={3} />
                      </label>
                      <label className="wide">编码选择理由 / 官方依据
                        <textarea value={currentDraft.rationale} onChange={(e) => saveDraft({ rationale: e.target.value })} placeholder="Record the index path, tabular verification, code-set version and rule source." rows={3} />
                      </label>
                    </div>
                    <div className="coding-card">
                      <div className="coding-card-title"><ClipboardCheck size={17} /><b>最终审核清单</b></div>
                      <div className="coding-checklist">
                        {codingWorkflow.map((item, index) => (
                          <label key={item.title}><input type="checkbox" checked={currentDraft.checks[index] ?? false} onChange={(e) => { const next = [...currentDraft.checks]; next[index] = e.target.checked; saveDraft({ checks: next }); }} /><span><b>{item.zh}</b><small>{item.detail}</small></span></label>
                        ))}
                      </div>
                      <button className="coding-primary" disabled={!currentDraft.checks.every(Boolean)} onClick={() => setSaved((prev) => ({ ...prev, completedCases: Array.from(new Set([...prev.completedCases, caseId])) }))}>完成本次工作台训练 <Check size={15} /></button>
                      {saved.completedCases.includes(caseId) && <p className="coding-saved"><CheckCircle2 size={15} /> 本病例训练已完成，草稿和审核清单保存在本机。</p>}
                    </div>
                    <div className="coding-caution"><ShieldCheck size={16} /><p>此病例为教学模拟。不要在这里输入可识别真实患者身份的信息。代码选择必须回到适用年度的官方代码书和完整病历核验。</p></div>
                    <div className="coding-subsection"><b>病例知识检查</b>
                      <div className="coding-case-quiz">
                        {selectedCase.questions.map((question, index) => (
                          <div className="coding-case-question" key={question.prompt}>
                            <p><strong>{index + 1}.</strong> {question.prompt}</p>
                            <div className="coding-options">
                              {question.options.map((option, optionIndex) => (
                                <button key={option} disabled={caseSubmitted} className={caseAnswers[index] === optionIndex ? "selected" : ""} onClick={() => setCaseAnswers((prev) => ({ ...prev, [index]: optionIndex }))}>
                                  <span>{String.fromCharCode(65 + optionIndex)}</span>{option}
                                </button>
                              ))}
                            </div>
                            {caseSubmitted && <div className="coding-feedback"><b>{caseAnswers[index] === question.answer ? "正确" : "参考答案：" + question.options[question.answer]}</b><p>{question.explanation}</p></div>}
                          </div>
                        ))}
                      </div>
                      {!caseSubmitted ? <button className="coding-secondary" disabled={!caseAnsweredAll} onClick={() => setCaseSubmitted(true)}>提交病例知识检查</button> : <div className="coding-result">本次得分：{score} / {selectedCase.questions.length}</div>}
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>
        )}

        {tab === "exam" && (
          <section className="coding-panel">
            <div className="coding-heading"><div><span className="coding-eyebrow">AAPC CPC EXAM BLUEPRINT</span><h2>按官方考试领域分配复习时间</h2><p>按 AAPC 公布的17个专业知识领域和10个独立病例题组织；正式考试以 AAPC 最新公告为准。</p></div></div>
            <div className="coding-exam-quick"><Link href="/cpc/mock-exam/" className="coding-primary">开始100题计时模拟 <ArrowRight size={15}/></Link><Link href="/cpc/coding/cases/" className="coding-secondary">练习综合病历 <FileText size={15}/></Link></div><div className="coding-exam-summary">
              <div><strong>100</strong><span>选择题</span></div><div><strong>240</strong><span>分钟</span></div><div><strong>70%</strong><span>通过标准</span></div><div><strong>17</strong><span>专业知识领域（另有10个病例题）</span></div>
            </div>
            <div className="coding-card">
              <div className="coding-card-title"><GraduationCap size={17} /><b>100题考试领域分布</b><span>{totalExamQuestions} / 100</span></div>
              <div className="coding-domain-list">
                {cpcExamDomains.map((domain) => (
                  <div className="coding-domain-row" key={domain.name}>
                    <div><b>{domain.name}</b><span>{domain.zh}</span></div><strong>{domain.questions}</strong>
                    <div className="coding-domain-track"><i style={{ width: (domain.questions / 10 * 100) + "%" }} /></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="coding-card">
              <div className="coding-card-title"><BookOpen size={17} /><b>官方考试参考资料</b></div>
              <p className="coding-muted">AAPC 当前说明允许使用当年度 CPT® Professional Edition、ICD-10-CM 和 HCPCS Level II 代码书。考试期间不允许携带手机、平板等电子设备。</p>
              <a className="coding-resource-link" href="https://www.aapc.com/certifications/cpc-and-cpb/taking-the-cpc-and-cpb-exams" target="_blank" rel="noreferrer">查看 AAPC 考试规则 <ExternalLink size={14} /></a>
            </div>
          </section>
        )}

        <div className="coding-resources">
          <div><b>官方资料入口</b><small>规则、代码文件和版本信息以官方来源为准</small></div>
          <div className="coding-resource-grid">
            {officialCodingResources.map((item) => <a href={item.url} target="_blank" rel="noreferrer" key={item.url}><span><b>{item.label}</b><small>{item.note}</small></span><ExternalLink size={14} /></a>)}
          </div>
        </div>
      </section>

      <footer className="coding-footer">CPC ACADEMY · PROFESSIONAL CODING · EDUCATIONAL EDITION <span>Educational simulation — verify all coding against current official references.</span></footer>
    </main>
  );
}
