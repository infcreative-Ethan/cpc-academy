"use client";

import {useCallback,useEffect,useState} from "react";
import {CheckCircle2,ClipboardCopy,Cloud,CloudOff,Flag,RefreshCw} from "lucide-react";

const STORE="cpc-academy-translation-issues-v1";
const ENDPOINT=(process.env.NEXT_PUBLIC_CPC_REPORT_ENDPOINT||"").trim();
type Reason="incorrect-meaning"|"missing-meaning"|"formatting"|"other";
type Report={id:string;kind:"translation";term:string;reason:Reason;meaningSnapshot:string;note:string;reportedAt:string;syncedAt?:string};
const labels:Record<Reason,string>={
 "incorrect-meaning":"中文释义不准确",
 "missing-meaning":"缺少中文释义",
 formatting:"释义乱码或排版问题",
 other:"其他中文释义问题",
};
function validateReason(reason:unknown):reason is Reason{
 return reason==="incorrect-meaning"||reason==="missing-meaning"||reason==="formatting"||reason==="other";
}
function loadReports():Report[]{
 try{
  const list:unknown=JSON.parse(localStorage.getItem(STORE)||"[]");
  if(!Array.isArray(list))return [];
  return list.flatMap((item):Report[]=>{
   if(!item||typeof item!=="object")return [];
   const row=item as Partial<Report>;
   if(typeof row.term!=="string"||!validateReason(row.reason)||
      typeof row.id!=="string"||typeof row.reportedAt!=="string")return [];
   return [{
    id:row.id,kind:"translation",term:row.term,reason:row.reason,
    meaningSnapshot:typeof row.meaningSnapshot==="string"?row.meaningSnapshot:"",
    note:typeof row.note==="string"?row.note:"",
    reportedAt:row.reportedAt,
    ...(typeof row.syncedAt==="string"?{syncedAt:row.syncedAt}:{})
   }];
  });
 }catch{return [];}
}
function saveReports(rows:Report[]){localStorage.setItem(STORE,JSON.stringify(rows));}

export default function TranslationFeedback({term,meaning}:{term:string;meaning:string}){
 const [reports,setReports]=useState<Report[]>([]);
 const [reason,setReason]=useState<Reason>("incorrect-meaning");
 const [note,setNote]=useState("");
 const [message,setMessage]=useState("");
 const [syncing,setSyncing]=useState(false);
 useEffect(()=>{setReports(loadReports());},[]);

 const sync=useCallback(async()=>{
  if(!ENDPOINT||!navigator.onLine)return;
  setSyncing(true);
  let count=0;
  try{
   for(const row of loadReports().filter(x=>!x.syncedAt)){
    const result=await fetch(ENDPOINT,{
     method:"POST",headers:{"Content-Type":"application/json"},
     body:JSON.stringify({
      id:row.id,kind:row.kind,term:row.term,reason:row.reason,
      meaningSnapshot:row.meaningSnapshot,note:row.note,reportedAt:row.reportedAt,
     }),
    });
    if(!result.ok)throw new Error("Cloud upload failed");
    const next=loadReports().map(x=>x.id===row.id?{...x,syncedAt:new Date().toISOString()}:x);
    saveReports(next);setReports(next);count++;
   }
   if(count)setMessage("已同步 "+count+" 条中文释义反馈。");
  }catch{setMessage("网络或云端暂不可用，反馈仍保存在本机，可稍后重试。");}
  finally{setSyncing(false);}
 },[]);
 useEffect(()=>{
  if(!ENDPOINT)return;
  void sync();
  const online=()=>{void sync();};
  window.addEventListener("online",online);
  return ()=>window.removeEventListener("online",online);
 },[sync]);

 const current=reports.some(x=>x.term.toLowerCase()===term.toLowerCase());
 const pending=reports.filter(x=>!x.syncedAt).length;
 function report(){
  try{
   const existing=loadReports();
   const value=note.trim().slice(0,300);
   const snapshot=meaning.slice(0,300);
   if(existing.some(x=>x.term.toLowerCase()===term.toLowerCase()&&x.reason===reason&&x.meaningSnapshot===snapshot&&x.note===value)){
    setMessage("相同问题已经记录。");return;
   }
   const id=typeof crypto.randomUUID==="function"?crypto.randomUUID():"feedback-"+Date.now()+"-"+Math.random().toString(36).slice(2);
   const next=[...existing,{id,kind:"translation" as const,term,reason,meaningSnapshot:snapshot,note:value,reportedAt:new Date().toISOString()}];
   saveReports(next);setReports(next);setNote("");
   setMessage(ENDPOINT?"已记录；正在尝试上传云端。":"已记录在本机；云端服务配置后才能自动上传。");
   void sync();
  }catch{setMessage("本机保存失败，未能记录。");}
 }
 const exportText=reports.map(x=>x.term+" — "+labels[x.reason]+
  (x.meaningSnapshot?"；原释义："+x.meaningSnapshot:"")+
  (x.note?"；建议："+x.note:"")+"（"+x.reportedAt.slice(0,10)+"）"+
  (x.syncedAt?" ☁已同步":" · 待同步")).join("\n");
 async function copy(){
  try{await navigator.clipboard.writeText(exportText);setMessage("已复制中文释义问题清单。");}
  catch{setMessage("无法自动复制，请手动选择清单文字复制。");}
 }
 return <div className="pron-feedback translation-feedback">
  <div className="pron-feedback-actions">
   <select aria-label="中文释义问题类型" value={reason} onChange={e=>setReason(e.target.value as Reason)}>
    <option value="incorrect-meaning">释义不准确</option>
    <option value="missing-meaning">释义缺失</option>
    <option value="formatting">显示乱码/排版</option>
    <option value="other">其他问题</option>
   </select>
   <button type="button" onClick={report}>
    {current?<CheckCircle2 size={14}/>:<Flag size={14}/>}
    {current?"记录中文释义问题（可继续补充）":"中文释义有误？记录"}
   </button>
  </div>
  <textarea className="translation-feedback-note" value={note} onChange={e=>setNote(e.target.value)}
   maxLength={300} rows={2} placeholder="可选：填写正确中文释义或问题描述"/>
  {message&&<p role="status">{message}</p>}
  {reports.length>0&&<details>
   <summary>查看中文释义反馈（{reports.length}条{pending?"，待同步 "+pending+" 条":""}）</summary>
   <div className="pron-feedback-sync-status">
    {ENDPOINT?<><Cloud size={14}/> 云端反馈通道已配置</>:<><CloudOff size={14}/> 暂为本地记录</>}
   </div>
   <textarea readOnly value={exportText} rows={Math.min(reports.length+1,7)} aria-label="可复制的中文释义错误记录"/>
   <button type="button" onClick={()=>void copy()}><ClipboardCopy size={13}/> 复制清单</button>
   {ENDPOINT&&<button type="button" disabled={!pending||syncing} onClick={()=>void sync()}>
    <RefreshCw size={13}/>{syncing?"同步中…":"重试同步"}
   </button>}
  </details>}
 </div>;
}
