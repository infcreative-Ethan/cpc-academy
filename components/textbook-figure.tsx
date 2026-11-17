"use client";

import {useEffect,useMemo,useState} from "react";
import {BookOpen,CheckCircle2,ChevronDown,FileUp,Image as ImageIcon,Info,LoaderCircle,Maximize2,RotateCcw,Save,ScanSearch,Tags,Trash2,ZoomIn} from "lucide-react";
import type {MedicalLesson} from "@/lib/cpc-medical-lessons";
import {figuresForChapter,suggestFigures,textbookSource,type FigureRecord} from "@/lib/textbook-index";
import {
 textbookPdf,supportsNativePdf,readFigureCustomizations,storeFigureCustomizations,
 type PdfCrop,type PdfFileStatus,type RenderedPdfPage,type FigureCustomizations,type FigureLabel,
 EMPTY_FIGURE_CUSTOMIZATIONS
} from "@/lib/textbook-pdf";
import "./textbook-figure.css";

const FULL:PdfCrop={x:0,y:0,w:1,h:1};
const inputPercent=(v:number)=>Math.round(v*100);
const pct=(v:number)=>Math.max(0,Math.min(100,Math.round(v)));

/**
 * Reads an imported user-owned PDF one page at a time through Android PdfRenderer.
 * No textbook pages/figures are shipped in the app or sent to any server.
 */
export default function TextbookFigure({chapter,lesson}:{chapter:number;lesson?:MedicalLesson|null}){
 const [native,setNative]=useState(false);
 const [status,setStatus]=useState<PdfFileStatus|null>(null);
 const [loading,setLoading]=useState(true);
 const [importing,setImporting]=useState(false);
 const [selectedId,setSelectedId]=useState("");
 const [image,setImage]=useState<RenderedPdfPage|null>(null);
 const [error,setError]=useState("");
 const [fullPage,setFullPage]=useState(false);
 const [renderWidth,setRenderWidth]=useState(900);
 const [customPage,setCustomPage]=useState(1);
 const [settings,setSettings]=useState<FigureCustomizations>(EMPTY_FIGURE_CUSTOMIZATIONS);
 const [editingCrop,setEditingCrop]=useState(false);
 const [draftCrop,setDraftCrop]=useState<PdfCrop>(FULL);
 const [addingLabels,setAddingLabels]=useState(false);
 const [pendingLabel,setPendingLabel]=useState<{x:number;y:number}|null>(null);
 const [labelTerm,setLabelTerm]=useState("");
 const [labelZh,setLabelZh]=useState("");
 const [quiz,setQuiz]=useState(false);
 const [revealed,setRevealed]=useState<string[]>([]);
 const recommended=useMemo(()=>suggestFigures(chapter,lesson,8),[chapter,lesson?.id]);
 const allFigures=useMemo(()=>figuresForChapter(chapter),[chapter]);
 const pinned=lesson?.id?settings.pinned[lesson.id]:undefined;
 const current=allFigures.find(f=>f.id===selectedId)??recommended[0]??allFigures[0];
 const crop=settings.crops[current?.id??""]??current?.crop??FULL;
 const markers=(current&&settings.labels[current.id])??[];
 const validMapping=status?.editionMatched===true;
 const pageNumber=validMapping?(current?.page??customPage):customPage;
 const actualCrop=fullPage||!validMapping?FULL:crop;

 useEffect(()=>{
  let cancelled=false;
  const isNative=supportsNativePdf();
  setNative(isNative);
  setSettings(readFigureCustomizations());
  if(!isNative){setLoading(false);return;}
  textbookPdf.getStatus().then(st=>{if(!cancelled)setStatus(st);}).catch(e=>{
   if(!cancelled)setError("无法连接 Android PDF 模块："+String(e));
  }).finally(()=>{if(!cancelled)setLoading(false);});
  return()=>{cancelled=true;};
 },[]);
 useEffect(()=>{
  const preferred=(lesson?.id?settings.pinned[lesson.id]:undefined);
  setSelectedId(preferred&&allFigures.some(f=>f.id===preferred)?preferred:recommended[0]?.id??"");
  setFullPage(false);setEditingCrop(false);setAddingLabels(false);setQuiz(false);setRevealed([]);
 },[chapter,lesson?.id,settings.pinned[lesson?.id??""],recommended[0]?.id]);
 useEffect(()=>{
  if(!current)return;
  setDraftCrop(settings.crops[current.id]??current.crop);
  setPendingLabel(null);setRevealed([]);
 },[current?.id]);
 useEffect(()=>{
  if(!native||!status?.available||!current){setImage(null);return;}
  let cancelled=false;
  setImage(null);setError("");
  textbookPdf.renderPage({page:pageNumber,width:renderWidth,crop:actualCrop}).then(value=>{
   if(!cancelled)setImage(value);
  }).catch(e=>{if(!cancelled)setError(String(e));});
  return()=>{cancelled=true;};
 },[native,status?.available,status?.sha256,current?.id,pageNumber,actualCrop.x,actualCrop.y,actualCrop.w,actualCrop.h,renderWidth]);

 function store(next:FigureCustomizations){setSettings(next);storeFigureCustomizations(next);}
 function changeFigure(id:string){
  setSelectedId(id);setFullPage(false);setEditingCrop(false);setAddingLabels(false);
  if(lesson?.id)store({...settings,pinned:{...settings.pinned,[lesson.id]:id}});
 }
 async function pickPdf(){
  setImporting(true);setError("");
  try{
   const result=await textbookPdf.importPdf();
   setStatus(result);setImage(null);
   if(!result.editionMatched)setCustomPage(1);
  }catch(e){setError(String(e));}
  finally{setImporting(false);}
 }
 async function removePdf(){
  if(!window.confirm("只删除本 App 内保存的教材 PDF 副本；保留学习进度和图片标签。确定吗？"))return;
  setImporting(true);
  try{setStatus(await textbookPdf.removePdf());setImage(null);}
  catch(e){setError(String(e));}
  finally{setImporting(false);}
 }
 function editCropValue(key:keyof PdfCrop,value:number){
  const base={...draftCrop};
  const next=pct(value)/100;
  if(key==="x")base.x=Math.min(next,1-base.w);
  if(key==="y")base.y=Math.min(next,1-base.h);
  if(key==="w")base.w=Math.min(Math.max(.05,next),1-base.x);
  if(key==="h")base.h=Math.min(Math.max(.05,next),1-base.y);
  setDraftCrop(base);
 }
 function saveCrop(){
  if(!current)return;
  store({...settings,crops:{...settings.crops,[current.id]:draftCrop}});
  setEditingCrop(false);setFullPage(false);
 }
 function resetCrop(){
  if(!current)return;
  const copy={...settings.crops};delete copy[current.id];
  store({...settings,crops:copy});setDraftCrop(current.crop);setEditingCrop(false);
 }
 function setMarker(event:React.MouseEvent<HTMLDivElement>){
  if(!addingLabels||!image||quiz)return;
  const el=event.currentTarget.getBoundingClientRect();
  if(el.width<=0||el.height<=0)return;
  setPendingLabel({x:Math.max(0,Math.min(1,(event.clientX-el.left)/el.width)),y:Math.max(0,Math.min(1,(event.clientY-el.top)/el.height))});
 }
 function addMarker(){
  if(!current||!pendingLabel||!labelTerm.trim())return;
  const next:FigureLabel={id:Date.now().toString(36),x:pendingLabel.x,y:pendingLabel.y,term:labelTerm.trim(),zh:labelZh.trim()};
  store({...settings,labels:{...settings.labels,[current.id]:[...markers,next]}});
  setPendingLabel(null);setLabelTerm("");setLabelZh("");
 }
 function removeMarker(id:string){
  if(!current)return;
  store({...settings,labels:{...settings.labels,[current.id]:markers.filter(x=>x.id!==id)}});
 }
 return <section className="pdf-figure-widget">
  <div className="pdf-figure-heading"><span><ImageIcon size={17}/> 教材图谱 · Textbook Figure Link</span><small>本机 PDF · 不上传 · 不打包教材图片</small></div>
  {!native&&<div className="pdf-figure-warning"><Info size={16}/> 此模块使用 Android 原生 PDF 阅读器。请在最新版 Android APK 中使用；网页版不保存或上传教材文件。</div>}
  {native&&<div className="pdf-figure-import">
   {loading?<span><LoaderCircle size={15}/> 检查本机教材…</span>:
    status?.available?<div className="pdf-figure-imported">
     <CheckCircle2 size={18}/><span><b>{status.name||"已导入教材"}</b><small>{status.pageCount}页 · {(status.bytes/1024/1024).toFixed(1)} MB · {validMapping?"第13版 PDF 已精确校验":"版本或排版未匹配，需手动指定页码"}</small></span>
     <button type="button" onClick={pickPdf} disabled={importing}>替换 PDF</button><button type="button" className="danger" onClick={removePdf} disabled={importing}><Trash2 size={13}/></button>
    </div>:<div className="pdf-figure-import-empty"><div><b>首次只需导入一次你自己的教材 PDF</b><small>导入后保存在 App 私有存储，覆盖升级后仍可离线调用，无需重复选择。</small></div><button type="button" disabled={importing} onClick={pickPdf}><FileUp size={15}/>{importing?"正在读取并校验…":"导入教材 PDF"}</button></div>}
   {importing&&<p className="pdf-figure-hint">正在本机复制并校验 PDF，请在导入操作完成前保持此页面开启。文件不会上传。</p>}
  </div>}
  {status?.available&&!validMapping&&<div className="pdf-figure-warning">⚠️ 所选 PDF 与预设第13版原始文件的 SHA-256 或页数不同。为防止错配，自动图片裁切已禁用；请在下面输入实际 PDF 页码并查看整页。</div>}
  {native&&status?.available&&<>
   <div className="pdf-figure-selector"><label>本章教材图片（{allFigures.length}张）
    <select value={current?.id??""} onChange={e=>changeFigure(e.target.value)} disabled={!allFigures.length}>
     {allFigures.map(f=><option value={f.id} key={f.id}>Figure {f.id} · PDF 第{f.page}页{f.confidence==="full-page"?" · 需核对裁切":""}</option>)}
    </select></label>
    <div className="pdf-figure-toggles"><button type="button" onClick={()=>setFullPage(x=>!x)} disabled={!validMapping}><Maximize2 size={13}/>{fullPage?"图片区域":"查看原始整页"}</button>
     <button type="button" onClick={()=>setRenderWidth(x=>x>=1500?900:1600)}><ZoomIn size={13}/>{renderWidth>=1500?"正常清晰度":"高清放大"}</button>
    </div>
   </div>
   {!validMapping&&<label className="pdf-figure-manual-page">指定 PDF 页面 <input type="number" min="1" max={status.pageCount} value={customPage} onChange={e=>setCustomPage(Math.max(1,Math.min(status.pageCount,Number(e.target.value)||1)))}/></label>}
   <div className="pdf-figure-render">
    {image?<div className="pdf-figure-image-wrap" onClick={setMarker} role={addingLabels?"button":undefined}>
     {/* Images are generated on the user's Android device, not remote URLs. */}
     {/* eslint-disable-next-line @next/next/no-img-element */}
     <img src={image.dataUrl} alt={validMapping?"你本机PDF的 Figure "+current?.id:"你本机PDF第"+pageNumber+"页"} draggable={false}/>
     {!fullPage&&validMapping&&markers.map(mark=>{
      const visible=!quiz||revealed.includes(mark.id);
      return <button type="button" key={mark.id} className="pdf-figure-marker" style={{left:(mark.x*100)+"%",top:(mark.y*100)+"%"}}
       onClick={event=>{event.stopPropagation();if(quiz)setRevealed(xs=>xs.includes(mark.id)?xs:[...xs,mark.id]);}}
       aria-label={visible?mark.term+" "+mark.zh:"点击揭晓该结构名称"}>
       {visible?<><b>{mark.term}</b>{mark.zh&&<small>{mark.zh}</small>}</>:<span>?</span>}
      </button>;
     })}
     {addingLabels&&pendingLabel&&<span className="pdf-figure-pending-dot" style={{left:(pendingLabel.x*100)+"%",top:(pendingLabel.y*100)+"%"}}>+</span>}
    </div>:<div className="pdf-figure-image-loading"><LoaderCircle size={20}/><span>正在从手机本地 PDF 渲染第 {pageNumber} 页…</span></div>}
   </div>
   <div className="pdf-figure-image-caption"><span>{validMapping?"Figure "+current?.id+" · PDF 第"+pageNumber+"页":"未匹配版式 · PDF 第"+pageNumber+"页"}</span><small>定位来源：预提取元数据（编号、页码、图片矩形），非图像智能识别；必要时手动调整。</small></div>
   {validMapping&&!fullPage&&<div className="pdf-figure-editor">
    <div className="pdf-figure-editor-actions">
     <button type="button" onClick={()=>setEditingCrop(v=>!v)}><ScanSearch size={14}/>{editingCrop?"收起裁切校正":"调整图片区域"}</button>
     <button type="button" onClick={()=>{setAddingLabels(v=>!v);setQuiz(false);}}><Tags size={14}/>{addingLabels?"退出标注":"添加双语标签"}</button>
     <button type="button" onClick={()=>{setQuiz(v=>!v);setAddingLabels(false);setRevealed([]);}} disabled={!markers.length}><BookOpen size={14}/>{quiz?"退出认图":"隐藏标签测验"}</button>
    </div>
    {editingCrop&&<div className="pdf-figure-crop"><p>调整相对于原页的矩形范围（百分比），保存后会永久记住此 Figure 的图片区域。标注与图片区域相关，修改后应检查标签位置。</p>
     {(["x","y","w","h"] as const).map(key=><label key={key}>{({x:"左边界 X",y:"顶部边界 Y",w:"宽度",h:"高度"})[key]}：{inputPercent(draftCrop[key])}%
      <input type="range" min={key==="w"||key==="h"?5:0} max={100} value={inputPercent(draftCrop[key])} onChange={e=>editCropValue(key,Number(e.target.value))}/></label>)}
     <div><button type="button" onClick={saveCrop}><Save size={13}/> 保存并预览</button><button type="button" onClick={resetCrop}><RotateCcw size={13}/> 恢复自动位置</button></div>
    </div>}
    {addingLabels&&<div className="pdf-figure-label-editor"><p>点击图片上的实际器官位置，然后为标记填写英文和中文。标签只保存在本机，不修改教材 PDF。</p>
     {pendingLabel&&<div className="pdf-figure-label-inputs"><input placeholder="English term" value={labelTerm} onChange={e=>setLabelTerm(e.target.value)}/><input placeholder="中文名称" value={labelZh} onChange={e=>setLabelZh(e.target.value)}/><button type="button" onClick={addMarker} disabled={!labelTerm.trim()}>保存标签</button></div>}
     {lesson&&<div className="pdf-figure-term-suggestions">{lesson.terminology.map(term=><button type="button" key={term.term} onClick={()=>{setLabelTerm(term.term);setLabelZh(term.zh);}}>{term.term} · {term.zh}</button>)}</div>}
     {markers.map(mark=><div key={mark.id} className="pdf-figure-mark-list"><span>{mark.term} · {mark.zh||"未添加中文"}</span><button type="button" onClick={()=>removeMarker(mark.id)}>移除</button></div>)}
    </div>}
    {quiz&&<div className="pdf-figure-quiz-status">点击图中问号揭晓结构：已揭晓 {revealed.length}/{markers.length} 个。<button type="button" onClick={()=>setRevealed([])}>重新测试</button></div>}
   </div>}
  </>}
  {error&&<p className="pdf-figure-error" role="alert">{error}</p>}
  <p className="pdf-figure-footer">书中图片仅由你自行导入的电子版在当前 Android 设备上显示。公开 APK 不含原版插图。图片定位不能替代原书阅读与医学专业核实。</p>
 </section>;
}