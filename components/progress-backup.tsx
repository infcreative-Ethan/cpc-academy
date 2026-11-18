"use client";

import {useState} from "react";
import {ClipboardCopy,Download,FileUp,ShieldCheck} from "lucide-react";
import "./progress-backup.css";

const BACKUP_FORMAT="cpc-academy-local-records";
const BACKUP_VERSION=1;
const ALLOWED_KEY=/^cpc-academy-[a-zA-Z0-9_-]{1,100}$/;
const MAX_IMPORT_BYTES=4_000_000;
type BackupData={format:string;schema:number;exportedAt:string;origin:string;records:Record<string,string>};

/** Records-only backup; never includes the native PDF or other apps' storage. */
export default function ProgressBackup(){
 const [draft,setDraft]=useState("");
 const [message,setMessage]=useState("");
 const [busy,setBusy]=useState(false);
 function collect():BackupData{
  const records:Record<string,string>={};
  for(let i=0;i<localStorage.length;i++){
   const key=localStorage.key(i);
   if(key&&ALLOWED_KEY.test(key)){
    const value=localStorage.getItem(key);
    if(value!==null)records[key]=value;
   }
  }
  return {format:BACKUP_FORMAT,schema:BACKUP_VERSION,exportedAt:new Date().toISOString(),origin:"CPC Academy Android/WebView",records};
 }
 function exportJson(){
  const content=JSON.stringify(collect(),null,2);
  setDraft(content);
  try{
   const url=URL.createObjectURL(new Blob([content],{type:"application/json"}));
   const a=document.createElement("a");a.href=url;a.download="CPC-Academy-Study-Backup.json";
   document.body.appendChild(a);a.click();a.remove();
   window.setTimeout(()=>URL.revokeObjectURL(url),5000);
   setMessage("已创建学习记录备份；如果浏览器未保存文件，可复制下方 JSON 文本自行保存。");
  }catch{setMessage("无法直接下载，可复制下方 JSON 文本自行保存。");}
 }
 async function copy(){
  const text=draft||JSON.stringify(collect(),null,2);
  setDraft(text);
  try{await navigator.clipboard.writeText(text);setMessage("已复制备份文本，可保存在笔记或发送到自己的安全存储位置。");}
  catch{setMessage("自动复制失败，请在下方文本框中手动全选并复制。");}
 }
 async function loadFile(file:File|undefined){
  if(!file)return;
  if(file.size>MAX_IMPORT_BYTES){setMessage("备份文件超过4 MB，请检查是否选择了正确的 JSON 文件。");return;}
  setBusy(true);
  try{setDraft(await file.text());setMessage("已读取备份文件。请检查来源，确认后点击恢复。当前记录尚未修改。");}
  catch{setMessage("备份文件读取失败，请直接粘贴 JSON 文本。");}
  finally{setBusy(false);}
 }
 function restore(){
  setBusy(true);
  try{
   if(draft.length>MAX_IMPORT_BYTES)throw new Error("备份过大，超过4 MB。");
   const parsed=JSON.parse(draft) as BackupData;
   if(parsed.format!==BACKUP_FORMAT||parsed.schema!==BACKUP_VERSION||!parsed.records||typeof parsed.records!=="object"||Array.isArray(parsed.records))
    throw new Error("这不是 CPC Academy 的有效学习记录备份。");
   const entries=Object.entries(parsed.records);
   if(!entries.length||entries.length>150)throw new Error("备份记录数量无效。");
   for(const [key,value] of entries)
    if(!ALLOWED_KEY.test(key)||typeof value!=="string"||value.length>1_000_000)
     throw new Error("备份包含不允许的记录键或异常数据。");
   if(!window.confirm("即将使用备份中的"+entries.length+"项记录覆盖当前同名记录。建议先备份当前数据。确认恢复吗？"))return;
   for(const [key,value] of entries)localStorage.setItem(key,value);
   setMessage("已恢复"+entries.length+"项记录。正在刷新以重新读取学习进度。");
   window.location.reload();
  }catch(e){setMessage("恢复失败："+(e instanceof Error?e.message:String(e)));}
  finally{setBusy(false);}
 }
 return <section className="progress-backup">
  <div className="progress-backup-head"><ShieldCheck size={18}/><div><b>学习记录备份与恢复</b><small>保护章节词表、默写成绩、课程掌握度、病例、错音记录和图片标签</small></div></div>
  <p>不同 GitHub 调试版 APK 可能使用不同的签名，无法直接覆盖安装。安装新版本前，请先导出备份。本工具只处理本机学习记录，不能导出你自行导入的 PDF 文件。</p>
  <div className="progress-backup-actions"><button type="button" onClick={exportJson} disabled={busy}><Download size={14}/> 导出 JSON 备份</button><button type="button" onClick={copy} disabled={busy}><ClipboardCopy size={14}/> 复制备份文本</button><label><FileUp size={14}/> 选择备份文件 <input type="file" accept=".json,application/json,.txt" onChange={e=>void loadFile(e.target.files?.[0])}/></label></div>
  <details><summary>查看、复制或粘贴备份 JSON</summary><textarea rows={5} spellCheck={false} placeholder="此处将显示导出的 JSON，也可粘贴此前保存的备份。" value={draft} onChange={e=>setDraft(e.target.value)}/><button type="button" disabled={!draft.trim()||busy} onClick={restore}><FileUp size={14}/> 验证并恢复记录</button></details>
  {message&&<p className="progress-backup-result" role="status">{message}</p>}
  <p className="progress-backup-note">请勿将包含个人记录的备份公开发布。覆盖安装通常保留本机数据，但不同签名或卸载重装可能清除数据；书本 PDF 需在新安装环境中再次导入。</p>
 </section>;
}