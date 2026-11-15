"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, BookMarked, BookOpen, Brain, Check, CheckCircle2,
  ChevronDown, ChevronRight, ClipboardCheck, Code2, ExternalLink, FileSearch,
  FileText, GraduationCap, ListChecks, ShieldCheck, Stethoscope, Target, X
} from "lucide-react";
import { appendices, bodySystems, chapters, codeSets, officialResources, practiceCases } from "@/lib/cpc-curriculum";

type Panel = "overview" | "book" | "anatomy" | "cases" | "coding";
type SavedProgress = { completedChapters: number[]; completedCases: string[]; caseScores: Record<string, number> };
const STORAGE_KEY = "cpc-academy-coding-progress-v1";
const emptyProgress: SavedProgress = { completedChapters: [], completedCases: [], caseScores: {} };
const panels: { id: Panel; label: string; en: string }[] = [
  { id: "overview", label: "学习总览", en: "Overview" },
  { id: "book", label: "教材章节", en: "22 Chapters" },
  { id: "anatomy", label: "人体解剖", en: "Anatomy" },
  { id: "cases", label: "病历实战", en: "Case Practice" },
  { id: "coding", label: "编码基础", en: "Code Sets" },
];

export default function CpcLearningCenter() {
  const [panel, setPanel] = useState<Panel>("overview");
  const [saved, setSaved] = useState<SavedProgress>(emptyProgress);
  const [ready, setReady] = useState(false);
  const [expandedChapter, setExpandedChapter] = useState<number | null>(1);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSaved({ ...emptyProgress, ...JSON.parse(raw) });
    } catch {
      setSaved(emptyProgress);
    }
    setReady(true);
  }, []);

  const persist = (next: SavedProgress) => {
    setSaved(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };
  const selectedCase = useMemo(
    () => practiceCases.find((item) => item.id === selectedCaseId) ?? null,
    [selectedCaseId]
  );
  const score = selectedCase
    ? selectedCase.questions.reduce((total, question, index) => total + (answers[index] === question.answer ? 1 : 0), 0)
    : 0;
  const answeredAll = selectedCase ? selectedCase.questions.every((_, index) => answers[index] !== undefined) : false;
  const completedCount = saved.completedChapters.length;
  const caseCount = saved.completedCases.length;

  const toggleChapterComplete = (number: number) => {
    const completed = saved.completedChapters.includes(number)
      ? saved.completedChapters.filter((item) => item !== number)
      : [...saved.completedChapters, number];
    persist({ ...saved, completedChapters: completed });
  };
  const openCase = (id: string) => {
    setSelectedCaseId(id);
    setAnswers({});
    setSubmitted(false);
    setPanel("cases");
  };
  const backToCases = () => {
    setSelectedCaseId(null);
    setAnswers({});
    setSubmitted(false);
  };
  const submitCase = () => {
    if (!selectedCase || !answeredAll) return;
    persist({
      ...saved,
      completedCases: Array.from(new Set([...saved.completedCases, selectedCase.id])),
      caseScores: { ...saved.caseScores, [selectedCase.id]: score },
    });
    setSubmitted(true);
  };

  if (!ready) return <main className="cpc-loading"><div className="cpc-brand-mark">C</div><p>CPC Learning Center 正在加载…</p></main>;

  return (
    <main className="cpc-shell">
      <header className="cpc-topbar">
        <Link href="/" className="cpc-back"><ArrowLeft size={17} /> 返回词汇学习</Link>
        <div className="cpc-top-brand"><span className="cpc-brand-mark">C</span><span><b>CPC Academy</b><small>CODING LEARNING CENTER</small></span></div>
        <span className="cpc-version">V1.0 BETA</span>
      </header>

      <section className="cpc-content">
        <div className="cpc-hero">
          <div className="cpc-hero-copy">
            <span className="cpc-eyebrow"><GraduationCap size={14} /> MEDICAL CODING PATHWAY</span>
            <h1>从看懂医学记录，<br /><em>到理解编码逻辑。</em></h1>
            <p>医学术语、人体解剖、临床记录与美国医疗编码基础，形成一条完整学习路径。</p>
            <button className="cpc-primary" onClick={() => setPanel("cases")}>开始病历训练 <ArrowRight size={16} /></button>
          </div>
          <div className="cpc-hero-graphic" aria-hidden="true">
            <div className="cpc-graphic-ring ring-a" />
            <div className="cpc-graphic-ring ring-b" />
            <div className="cpc-graphic-center"><Stethoscope size={48} /><span>DOCUMENT<br />→ CODE</span></div>
          </div>
        </div>

        <div className="cpc-stat-grid">
          <div className="cpc-stat"><BookOpen size={18} /><strong>22</strong><span>教材章节</span></div>
          <div className="cpc-stat"><Brain size={18} /><strong>12</strong><span>人体系统专题</span></div>
          <div className="cpc-stat"><FileSearch size={18} /><strong>4</strong><span>模拟病历</span></div>
          <div className="cpc-stat"><CheckCircle2 size={18} /><strong>{caseCount}/4</strong><span>已完成病例</span></div>
        </div>

        <nav className="cpc-tabs" aria-label="CPC学习模块">
          {panels.map((item) => (
            <button key={item.id} className={panel === item.id ? "active" : ""} onClick={() => { setPanel(item.id); if (item.id !== "cases") backToCases(); }}>
              <span>{item.label}</span><small>{item.en}</small>
            </button>
          ))}
        </nav>

        {panel === "overview" && (
          <section className="cpc-panel">
            <div className="cpc-section-heading"><div><span className="cpc-eyebrow">YOUR LEARNING ROUTE</span><h2>四个阶段，建立编码能力</h2><p>先建立医学理解，再学习编码规则；不要跳过病历阅读。</p></div></div>
            <div className="cpc-route-grid">
              <button className="cpc-route-card" onClick={() => setPanel("book")}><span className="route-no">01</span><BookOpen size={22} /><b>医学术语基础</b><p>原书 Chapters 1–4：词根、词缀、身体整体结构。</p><small>从词汇结构开始 <ArrowRight size={13} /></small></button>
              <button className="cpc-route-card" onClick={() => setPanel("anatomy")}><span className="route-no">02</span><Brain size={22} /><b>人体解剖与系统</b><p>原书 Chapters 5–18：器官、组织、疾病与检查。</p><small>按人体系统学习 <ArrowRight size={13} /></small></button>
              <button className="cpc-route-card" onClick={() => setPanel("cases")}><span className="route-no">03</span><FileSearch size={22} /><b>临床病历阅读</b><p>提取诊断、部位、侧别、实际操作和文档依据。</p><small>练习病例分析 <ArrowRight size={13} /></small></button>
              <button className="cpc-route-card" onClick={() => setPanel("coding")}><span className="route-no">04</span><ClipboardCheck size={22} /><b>编码体系与规则</b><p>理解 ICD-10-CM、CPT®、HCPCS Level II 的职责。</p><small>进入编码基础 <ArrowRight size={13} /></small></button>
            </div>
            <div className="cpc-two-col">
              <div className="cpc-card">
                <div className="cpc-card-title"><div><Target size={18} /><b>学习进度</b></div><span>保存在本机</span></div>
                <div className="cpc-progress-row"><span>教材章节</span><b>{completedCount} / 22</b></div>
                <div className="cpc-progress-track"><i style={{ width: String(completedCount / 22 * 100) + "%" }} /></div>
                <div className="cpc-progress-row"><span>模拟病历</span><b>{caseCount} / 4</b></div>
                <div className="cpc-progress-track"><i style={{ width: String(caseCount / 4 * 100) + "%" }} /></div>
                <p className="cpc-muted-note">学习记录保存在当前设备。清除浏览器数据或卸载应用可能导致本地记录丢失。</p>
              </div>
              <div className="cpc-card cpc-workflow-card">
                <div className="cpc-card-title"><div><ShieldCheck size={18} /><b>编码工作的基本原则</b></div></div>
                <ul>
                  <li>以病历中有依据的记录为准，不自行推断诊断。</li>
                  <li>区分患者症状、医生确立的诊断和实际提供的服务。</li>
                  <li>编码前核对适用年份、官方规则、说明和修饰符。</li>
                  <li>文档不充分时，先识别缺失信息，不猜测代码。</li>
                </ul>
              </div>
            </div>
            <div className="cpc-notice"><ShieldCheck size={17} /><div><b>学习版边界</b><p>当前 V1.0 是医学理解与编码流程训练工具，不是自动编码器。真实编码必须查阅适用日期的正式代码集、完整病历和付款方规则。</p></div></div>
          </section>
        )}

        {panel === "book" && (
          <section className="cpc-panel">
            <div className="cpc-section-heading"><div><span className="cpc-eyebrow">THE LANGUAGE OF MEDICINE · 13TH EDITION</span><h2>按原书目录学习 22 章</h2><p>章节标题与主题根据你提供的第13版目录整理；这里提供学习导航，不复制教材正文。</p></div><span className="cpc-pill">{completedCount}/22 已完成</span></div>
            <div className="cpc-phase-intro">
              <div><b>01 · Foundation</b><span>Chapters 1–4 · 医学词汇与人体整体结构</span></div>
              <div><b>02 · Body Systems</b><span>Chapters 5–18 · 人体器官系统</span></div>
              <div><b>03 · Specialties</b><span>Chapters 19–22 · 医学专科</span></div>
            </div>
            <div className="cpc-chapter-list">
              {chapters.map((chapter) => {
                const expanded = expandedChapter === chapter.number;
                const done = saved.completedChapters.includes(chapter.number);
                return (
                  <article className={expanded ? "cpc-chapter expanded" : "cpc-chapter"} key={chapter.number}>
                    <button className="cpc-chapter-head" onClick={() => setExpandedChapter(expanded ? null : chapter.number)}>
                      <span className="cpc-chapter-no">{String(chapter.number).padStart(2, "0")}</span>
                      <span className="cpc-chapter-name"><b>{chapter.title}</b><small>{chapter.phase === "Foundation" ? "基础知识" : chapter.phase === "Body Systems" ? "人体系统" : "医学专科"} · {chapter.topics.length} 个主题</small></span>
                      {done && <CheckCircle2 className="cpc-done-icon" size={18} />}
                      {expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                    </button>
                    {expanded && (
                      <div className="cpc-chapter-body">
                        <div className="cpc-topic-list">{chapter.topics.map((topic) => <span key={topic}>{topic}</span>)}</div>
                        <div className="cpc-connection"><b>与 CPC 工作的联系</b><p>{chapter.codingConnection}</p></div>
                        <button className={done ? "cpc-secondary" : "cpc-primary"} onClick={() => toggleChapterComplete(chapter.number)}>
                          {done ? <><Check size={15} /> 已完成 · 取消标记</> : <>标记本章已学完 <CheckCircle2 size={15} /></>}
                        </button>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
            <div className="cpc-card cpc-appendices"><div className="cpc-card-title"><div><BookMarked size={18} /><b>原书参考部分</b></div></div><div className="cpc-appendix-grid">{appendices.map((item) => <span key={item}>{item}</span>)}</div></div>
          </section>
        )}

        {panel === "anatomy" && (
          <section className="cpc-panel">
            <div className="cpc-section-heading"><div><span className="cpc-eyebrow">ANATOMY BY BODY SYSTEM</span><h2>人体解剖学习地图</h2><p>先确认结构与位置，再阅读病历中的诊断和操作描述。</p></div></div>
            <div className="cpc-anatomy-banner">
              <div><b>解剖定位四要素</b><p>Site（部位） · Laterality（侧别） · Structure（具体结构） · Depth / Approach（深度或操作入路）</p></div>
              <div className="cpc-direction-tags"><span>Anterior / Posterior</span><span>Medial / Lateral</span><span>Proximal / Distal</span><span>Superficial / Deep</span></div>
            </div>
            <div className="cpc-anatomy-grid">
              {bodySystems.map((system) => (
                <article className="cpc-anatomy-card" key={system.id}>
                  <div className="cpc-anatomy-card-top"><span>{system.zh}</span><small>CH {system.chapters}</small></div>
                  <h3>{system.name}</h3>
                  <div className="cpc-structure-list">{system.structures.map((structure) => <span key={structure}>{structure}</span>)}</div>
                  <div className="cpc-anatomy-focus"><b>CPC 阅读重点</b><p>{system.focus}</p></div>
                  <button onClick={() => setPanel("book")}>查看相关教材章节 <ArrowRight size={14} /></button>
                </article>
              ))}
            </div>
            <div className="cpc-notice"><Brain size={17} /><div><b>学习提示</b><p>人体结构卡片用于建立解剖定位框架。涉及具体病例时，仍应以病历原文、影像报告和手术记录为准。</p></div></div>
          </section>
        )}

        {panel === "cases" && (
          <section className="cpc-panel">
            <div className="cpc-section-heading"><div><span className="cpc-eyebrow">CLINICAL DOCUMENTATION PRACTICE</span><h2>{selectedCase ? selectedCase.title : "模拟病历实战"}</h2><p>{selectedCase ? "逐题分析病历中明确记录的事实。" : "练习从英文临床记录中提取信息。所有病例均为教学模拟。"}</p></div>{selectedCase && <button className="cpc-secondary" onClick={backToCases}>返回病例列表</button>}</div>
            {!selectedCase && (
              <div className="cpc-case-grid">
                {practiceCases.map((item) => {
                  const done = saved.completedCases.includes(item.id);
                  const caseLabel = done ? "已完成 · " + (saved.caseScores[item.id] ?? 0) + "/" + item.questions.length : item.questions.length + " 道题";
                  return (
                    <button className="cpc-case-card" key={item.id} onClick={() => openCase(item.id)}>
                      <div className="cpc-case-top"><span>{item.system}</span><small>{item.level}</small></div>
                      <h3>{item.title}</h3><p>{item.focus}</p>
                      <div className="cpc-case-bottom"><span>{caseLabel}</span>{done ? <CheckCircle2 size={17} /> : <ArrowRight size={17} />}</div>
                    </button>
                  );
                })}
              </div>
            )}
            {selectedCase && (
              <div className="cpc-case-workspace">
                <div className="cpc-record-card">
                  <div className="cpc-record-heading"><FileText size={18} /><b>SIMULATED CLINICAL NOTE</b><span>教学模拟 · 非真实患者资料</span></div>
                  <p>{selectedCase.record}</p>
                  <div className="cpc-focus-line"><b>训练重点</b><span>{selectedCase.focus}</span></div>
                </div>
                <div className="cpc-question-list">
                  {selectedCase.questions.map((question, index) => (
                    <article className="cpc-question" key={selectedCase.id + "-" + index}>
                      <div className="cpc-question-title"><span>{String(index + 1).padStart(2, "0")}</span><b>{question.prompt}</b></div>
                      <div className="cpc-options">
                        {question.options.map((option, optionIndex) => {
                          const chosen = answers[index] === optionIndex;
                          const correct = submitted && optionIndex === question.answer;
                          const wrong = submitted && chosen && optionIndex !== question.answer;
                          const optionClass = "cpc-option" + (chosen ? " selected" : "") + (correct ? " correct" : "") + (wrong ? " wrong" : "");
                          return (
                            <button key={option} disabled={submitted} className={optionClass} onClick={() => setAnswers((current) => ({ ...current, [index]: optionIndex }))}>
                              <span>{String.fromCharCode(65 + optionIndex)}</span>{option}
                              {correct && <CheckCircle2 size={16} />}{wrong && <X size={16} />}
                            </button>
                          );
                        })}
                      </div>
                      {submitted && <div className="cpc-explanation"><b>{answers[index] === question.answer ? "回答正确" : "参考解释"}</b><p>{question.explanation}</p></div>}
                    </article>
                  ))}
                </div>
                {!submitted ? (
                  <div className="cpc-submit-row"><span>已答 {Object.keys(answers).length} / {selectedCase.questions.length}</span><button className="cpc-primary" disabled={!answeredAll} onClick={submitCase}>提交并查看解析 <Check size={15} /></button></div>
                ) : (
                  <div className="cpc-result-card"><div><b>本次得分</b><strong>{score} / {selectedCase.questions.length}</strong><span>{Math.round(score / selectedCase.questions.length * 100)}% · 结果已保存在本机</span></div><button className="cpc-primary" onClick={backToCases}>返回病例列表 <ArrowRight size={15} /></button></div>
                )}
              </div>
            )}
          </section>
        )}

        {panel === "coding" && (
          <section className="cpc-panel">
            <div className="cpc-section-heading"><div><span className="cpc-eyebrow">U.S. MEDICAL CODE SETS</span><h2>三大编码体系与工作流程</h2><p>先弄清楚每套代码回答什么问题，再学习查找和核验。</p></div></div>
            <div className="cpc-code-grid">
              {codeSets.map((item, index) => (
                <article className="cpc-code-card" key={item.name}>
                  <div className={"cpc-code-icon code-" + index}><Code2 size={22} /></div>
                  <span className="cpc-code-zh">{item.zh}</span><h3>{item.name}</h3><p>{item.purpose}</p>
                  <div className="cpc-code-workflow"><b>学习查找流程</b><ol>{item.workflow.map((step) => <li key={step}>{step}</li>)}</ol></div>
                  <small className="cpc-source-label">参考来源：{item.source}</small>
                </article>
              ))}
            </div>
            <div className="cpc-card cpc-checklist-card">
              <div className="cpc-card-title"><div><ListChecks size={18} /><b>病历到编码：建议工作顺序</b></div></div>
              <div className="cpc-checklist">
                {[
                  ["Read the full record", "先阅读完整病历，确认本次就诊目的与服务场景。"],
                  ["Extract documented facts", "提取医生明确记录的诊断、症状、部位、侧别和实际操作。"],
                  ["Choose the code set", "诊断通常查 ICD-10-CM；专业服务和操作查 CPT®；许多设备、药物及用品查 HCPCS Level II。"],
                  ["Locate and verify", "使用适用版本的索引与表格，核对包含/排除说明、附加编码指示和章节规则。"],
                  ["Check date and edits", "确认服务日期对应的版本，并核对修饰符、编辑规则及付款方政策。"],
                  ["Document the rationale", "记录代码选择依据；信息不足时按合规流程请求澄清，不要猜测。"],
                ].map(([title, description], index) => <div className="cpc-check-row" key={title}><span>{index + 1}</span><div><b>{title}</b><p>{description}</p></div></div>)}
              </div>
            </div>
            <div className="cpc-warning"><ShieldCheck size={18} /><div><b>重要：CPT® 版权与授权</b><p>CPT® 由 American Medical Association（AMA）维护并享有版权。此版本不内置 CPT 代码表或描述；若要在电子产品中展示或分发 CPT 内容，需要确认相应许可。实际编码请使用当年授权的 CPT® Professional Edition 或其他获授权资源。</p><a href="https://www.ama-assn.org/practice-management/cpt/cpt-licensing-frequently-asked-questions-faqs" target="_blank" rel="noreferrer">查看 AMA 授权说明 <ExternalLink size={13} /></a></div></div>
            <div className="cpc-card cpc-resources-card">
              <div className="cpc-card-title"><div><BookMarked size={18} /><b>官方学习与更新入口</b></div><span>外部链接需要网络</span></div>
              <div className="cpc-resource-list">
                {officialResources.map((resource) => <a key={resource.url} href={resource.url} target="_blank" rel="noreferrer"><span><b>{resource.label}</b><small>{resource.note}</small></span><ExternalLink size={15} /></a>)}
              </div>
            </div>
          </section>
        )}
      </section>

      <footer className="cpc-footer">CPC ACADEMY · PERSONAL STUDY EDITION · V1.0 BETA <span>Educational tool — verify all coding against current official references.</span></footer>
    </main>
  );
}
