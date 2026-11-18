"use client";

import {useCallback,useEffect,useState} from "react";
import {CheckCircle2,ClipboardCopy,Cloud,CloudOff,Flag,RefreshCw} from "lucide-react";

/** Keep the legacy key so updates preserve previously reported pronunciation issues. */
const STORE="cpc-academy-pronunciation-issues-v1";
const ENDPOINT=(process.env.NEXT_PUBLIC_CPC_REPORT_ENDPOINT||"").trim();
type IssueType="incorrect"|"clipped"|"incomplete";
type Issue={id:string;term:string;reason:IssueType;reportedAt:string;syncedAt?:string};
const label:Record<IssueType,string>={
 incorrect:"读音不准确",clipped:"开头音节被吞掉",incomplete:"发音不完整/音频异常",
};
function validReason(value:unknown):value is IssueType{
 return value==="incorrect"||value==="clipped"||value==="incomplete";
}
function legacyId(term:string,reason:IssueType,time:string){
 return "legacy-"+Array.from(term+"|"+reason+"|"+time).reduce((a,c)=>((a*31+c.charCodeAt(0))>>>0),0).toString(16);
}
function loadIssues():Issue[]{
 try{
  const rows:unknown=JSON.parse(localStorage.getItem(STORE)||"[]");
  if(!Array.isArray(rows))return [];
  return rows.flatMap((row):Issue[]=>{
   if(!row||typeof row!=="object")return [];
   const item=row as Partial<Issue>;
   if(typeof item.term!=="string"||!item.term.trim()||!validReason(item.reason))return [];
   const date=typeof item.reportedAt==="string"?item.reportedAt:new Date(0).toISOString();
   return [{id:typeof item.id==="string"&&item.id?item.id:legacyId(item.term,item.reason,date),
    term:item.term,reason:item.reason,reportedAt:date,
    ...(typeof item.syncedAt==="string"?{syncedAt:item.syncedAt}:{})}];
  });
 }catch{return [];}
}
function persist(rows:Issue[]){localStorage.setItem(STORE,JSON.stringify(rows));}

export default function PronunciationFeedback({term,compact=false}:{term:string;compact?:boolean}){
 const [issues,setIssues]=useState<Issue[]>([]);
 const [type,setType]=useState<IssueType>("incorrect");
 const [notice,setNotice]=useState("");
 const [syncing,setSyncing]=useState(false);
 useEffect(()=>{setIssues(loadIssues());},[]);

 const syncPending=useCallback(async()=>{
  if(!ENDPOINT||!navigator.onLine)return;
  setSyncing(true);
  let uploaded=0;
  try{
   for(const issue of loadIssues().filter(row=>!row.syncedAt)){
    const response=await fetch(ENDPOINT,{
     method:"POST",headers:{"Content-Type":"application/json"},
     body:JSON.stringify({id:issue.id,term:issue.term,reason:issue.reason,reportedAt:issue.reportedAt}),
    });
    if(!response.ok)throw new Error("HTTP "+response.status);
    const next=loadIssues().map(row=>row.id===issue.id?{...row,syncedAt:new Date().toISOString()}:row);
    persist(next);setIssues(next);uploaded++;
   }
   if(uploaded)setNotice("已将 "+uploaded+" 条发音反馈同步到云端。");
  }catch{setNotice("云端暂不可用，反馈已保存在本机；联网后可以重试。");}
  finally{setSyncing(false);}
 },[]);

 useEffect(()=>{
  if(!ENDPOINT)return;
  void syncPending();
  const retry=()=>{void syncPending();};
  window.addEventListener("online",retry);
  return ()=>window.removeEventListener("online",retry);
 },[syncPending]);

 const flagged=issues.some(row=>row.term.toLowerCase()===term.toLowerCase());
 const pending=issues.filter(row=>!row.syncedAt).length;
 function report(){
  try{
   const previous=loadIssues();
   const exists=previous.some(row=>row.term.toLowerCase()===term.toLowerCase()&&row.reason===type);
   if(exists){setIssues(previous);setNotice("该单词的这类问题已经记录。");void syncPending();return;}
   const id=typeof crypto.randomUUID==="function"?crypto.randomUUID():String(Date.now())+"-"+Math.random().toString(36).slice(2);
   const newIssue:Issue={id,term,reason:type,reportedAt:new Date().toISOString()};
   const next=[...previous,newIssue];
   persist(next);setIssues(next);
   setNotice(ENDPOINT?"已记录，正在尝试同步云端。":"已保存在本机；云端反馈服务尚未配置，可先复制清单。");
   void syncPending();
  }catch{setNotice("本机存储不可用，未能保存报告。");}
 }
 const exportText=issues.map(x=>x.term+" — "+label[x.reason]+"（"+x.reportedAt.slice(0,10)+"）"+
  (x.syncedAt?" ☁已同步":" · 待同步")).join("\n");
 async function copy(){
  try{await navigator.clipboard.writeText(exportText);setNotice("已复制问题清单。");}
  catch{setNotice("无法自动复制，可选择清单文字手动复制。");}
 }
 return <div className={compact?"pron-feedback compact":"pron-feedback"}>
  <div className="pron-feedback-actions">
   {!compact&&<select aria-label="发音问题类型" value={type} onChange={e=>setType(e.target.value as IssueType)}>
    <option value="incorrect">读音不准确</option>
    <option value="clipped">开头音节被吞掉</option>
    <option value="incomplete">发音不完整/异常</option>
   </select>}
   <button type="button" onClick={report} title={"记录 "+term+" 的发音问题"}>
    {flagged?<CheckCircle2 size={14}/>:<Flag size={14}/>}
    {flagged?"已记录发音问题":"发音有误？记录"}
   </button>
  </div>
  {notice&&<p role="status">{notice}</p>}
  {!compact&&issues.length>0&&<details>
   <summary>查看发音问题清单（{issues.length}条{pending?"，"+pending+"条待同步":""}）</summary>
   <div className="pron-feedback-sync-status">
    {ENDPOINT?<><Cloud size={14}/> 已连接云端反馈通道</>:<><CloudOff size={14}/> 本机模式（未配置云端地址）</>}
   </div>
   <textarea readOnly rows={Math.min(issues.length+1,7)} value={exportText} aria-label="可复制的发音问题清单"/>
   <button type="button" onClick={copy}><ClipboardCopy size={13}/> 复制问题清单</button>
   {ENDPOINT&&<button type="button" disabled={syncing||!pending} onClick={()=>void syncPending()}>
    <RefreshCw size={13}/>{syncing?"同步中…":"重新同步"}
   </button>}
  </details>}
 </div>;
}
