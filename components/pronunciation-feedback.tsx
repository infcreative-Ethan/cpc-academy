"use client";

import {useEffect,useState} from "react";
import {CheckCircle2,ClipboardCopy,Flag} from "lucide-react";

const STORE="cpc-academy-pronunciation-issues-v1";
type IssueType="incorrect"|"clipped"|"incomplete";
type Issue={term:string;reason:IssueType;reportedAt:string};
const label:Record<IssueType,string>={
 incorrect:"读音不准确",
 clipped:"开头音节被吞掉",
 incomplete:"发音不完整/音频异常",
};
function loadIssues():Issue[]{
 try {
  const raw=localStorage.getItem(STORE);
  const rows=raw?JSON.parse(raw):[];
  return Array.isArray(rows)?rows.filter((row):row is Issue=>Boolean(row&&typeof row.term==="string"&&row.reason in label)):[];
 }catch{return [];}
}

/** Local-only pronunciation report list, ready to copy into a support message. */
export default function PronunciationFeedback({term,compact=false}:{term:string;compact?:boolean}){
 const [issues,setIssues]=useState<Issue[]>([]);
 const [type,setType]=useState<IssueType>("incorrect");
 const [notice,setNotice]=useState("");
 useEffect(()=>{setIssues(loadIssues());},[]);
 const flagged=issues.some(row=>row.term.toLowerCase()===term.toLowerCase());
 function report(){
  const previous=loadIssues();
  const newIssue:Issue={term,reason:type,reportedAt:new Date().toISOString()};
  const next=[...previous.filter(x=>!(x.term.toLowerCase()===term.toLowerCase()&&x.reason===type)),newIssue];
  try{
   localStorage.setItem(STORE,JSON.stringify(next));
   setIssues(next);
   setNotice("已记在本机，可复制下方问题清单发送给开发者。");
  }catch{setNotice("本机存储不可用，未能保存报告。");}
 }
 const exportText=issues.map(x=>x.term+" — "+label[x.reason]+"（"+x.reportedAt.slice(0,10)+"）").join("\n");
 async function copy(){
  try{await navigator.clipboard.writeText(exportText);setNotice("已复制错音清单，可以粘贴到聊天中。");}
  catch{setNotice("无法自动复制，可选中清单文字手动复制。");}
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
   <summary>查看本机发音问题清单（{issues.length}条）</summary>
   <textarea readOnly rows={Math.min(issues.length+1,7)} value={exportText} aria-label="可复制的发音问题清单"/>
   <button type="button" onClick={copy}><ClipboardCopy size={13}/> 复制问题清单</button>
  </details>}
 </div>;
}
