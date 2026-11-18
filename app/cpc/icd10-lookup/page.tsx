"use client";

import {useDeferredValue,useEffect,useMemo,useState} from "react";
import Link from "next/link";
import {ArrowLeft,BookOpen,CheckCircle2,ExternalLink,FileSearch,Search,ShieldCheck,Star} from "lucide-react";
import "../coding/coding.css";
import "./lookup.css";

type Entry=[code:string,longDescription:string,billable:0|1];
type Catalog={
 metadata:{
  available:boolean;fiscalYear:number;effectiveFrom:string;effectiveUntil:string;
  count:number;billableCount:number;source:string;sourceUrl:string;notice:string;
 };
 codes:Entry[];
};
const FAVORITES="cpc-academy-icd10-favorites-fy2027";

export default function ICD10LookupPage(){
 const [catalog,setCatalog]=useState<Catalog|null>(null);
 const [loading,setLoading]=useState(true);
 const [error,setError]=useState("");
 const [search,setSearch]=useState("");
 const deferred=useDeferredValue(search);
 const [billableOnly,setBillableOnly]=useState(false);
 const [favorites,setFavorites]=useState<string[]>([]);
 const [showFavorites,setShowFavorites]=useState(false);
 useEffect(()=>{
  try{const old=localStorage.getItem(FAVORITES);if(old)setFavorites(JSON.parse(old) as string[]);}catch{}
  let stopped=false;
  fetch("/icd10cm-fy2027.json").then(res=>{
   if(!res.ok)throw new Error("离线数据文件未打包。请使用官方 ICD-10-CM 资源。");
   return res.json() as Promise<Catalog>;
  }).then(data=>{
   if(stopped)return;
   if(data.metadata.fiscalYear!==2027)throw new Error("离线版本不匹配。");
   setCatalog(data);setLoading(false);
  }).catch(e=>{if(!stopped){setError(e instanceof Error?e.message:"数据加载失败");setLoading(false);}});
  return()=>{stopped=true;};
 },[]);
 useEffect(()=>{try{localStorage.setItem(FAVORITES,JSON.stringify(favorites));}catch{}},[favorites]);
 const entries=useMemo(()=>{
  if(!catalog?.metadata.available)return [];
  const needle=deferred.trim().toLowerCase();
  if(needle.length<2&&!showFavorites)return [];
  const normalized=needle.replaceAll(".","");
  const result:Entry[]=[];
  for(const entry of catalog.codes){
   const [code,description,billable]=entry;
   if(billableOnly&&billable!==1)continue;
   if(showFavorites&&!favorites.includes(code))continue;
   if(needle&&!code.toLowerCase().replaceAll(".","").includes(normalized)&&!description.toLowerCase().includes(needle))continue;
   result.push(entry);
   if(result.length>=80)break;
  }
  return result;
 },[catalog,deferred,billableOnly,favorites,showFavorites]);
 const toggle=(code:string)=>setFavorites(prev=>prev.includes(code)?prev.filter(x=>x!==code):[...prev,code]);
 return <main className="icd-shell">
  <header className="icd-top"><Link href="/cpc/coding/" className="icd-back"><ArrowLeft size={16}/> 返回专业编码学院</Link><b>CPC Academy · ICD-10-CM</b><span>FY2027 Offline</span></header>
  <div className="icd-container">
   <section className="icd-hero"><span><FileSearch size={17}/> OFFLINE DIAGNOSIS CODE REFERENCE</span><h1>ICD-10-CM 诊断代码查询</h1>
    <p>从官方 FY2027 CDC/CMS 分类数据生成可离线搜索的代码、英文描述及是否可报告的结构信息。只用于检索起点，不能替代 Alphabetic Index、Tabular List 和官方指南。</p>
   </section>
   <div className="icd-stat">
    <div><b>{catalog?.metadata.available?catalog.metadata.count.toLocaleString():"—"}</b><small>代码与类别条目</small></div>
    <div><b>{catalog?.metadata.available?catalog.metadata.billableCount.toLocaleString():"—"}</b><small>可报告完整代码</small></div>
    <div><b>FY2027</b><small>2026-10-01 至 2027-09-30</small></div>
   </div>
   <section className="icd-card">
    <div className="icd-search-header"><h2><Search size={18}/> 搜索诊断术语或代码</h2><span>英文描述 · 不支持自动定码</span></div>
    <div className="icd-search-box"><Search size={18}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="例如 E11、I10、diabetes、fracture…" autoComplete="off" /></div>
    <div className="icd-filters"><label><input type="checkbox" checked={billableOnly} onChange={e=>setBillableOnly(e.target.checked)}/> 只显示完整可报告代码</label><label><input type="checkbox" checked={showFavorites} onChange={e=>setShowFavorites(e.target.checked)}/> 只看我的收藏（{favorites.length}）</label></div>
    {loading?<p className="icd-loading">正在加载本地代码文件…</p>:
     error?<p className="icd-warning">{error}</p>:
     !catalog?.metadata.available?<p className="icd-warning">官方数据下载没有成功，本版没有包含代码表。请前往 CDC 或 CMS 官方页面查阅，不能使用旧版代替。</p>:
     <><div className="icd-results-heading"><span>最多显示前80条结果</span><span>{entries.length} 条显示中</span></div>
      {deferred.trim().length<2&&!showFavorites?<div className="icd-placeholder"><BookOpen size={25}/><b>请输入至少两个字符</b><p>输入疾病英文描述、术语片段或 ICD-10-CM 代码开始查询。</p></div>:
      entries.length===0?<p className="icd-empty">没有匹配结果。尝试英文同义词或更简短的代码前缀。</p>:
      <div className="icd-results">{entries.map(([code,description,billable])=><article key={code}>
       <div className="icd-code-line"><strong>{code}</strong><span className={billable?"icd-billable":"icd-category"}>{billable?"完整代码":"类目/标题，需细化"}</span><button onClick={()=>toggle(code)} className={favorites.includes(code)?"active":""} aria-label={(favorites.includes(code)?"取消收藏":"收藏")+code}><Star size={17}/></button></div>
       <p>{description}</p>
      </article>)}</div>}
     </>}
   </section>
   <section className="icd-card icd-caution"><h2><ShieldCheck size={18}/> 真实编码之前的必查流程</h2>
    <ol><li>先从病历确认医生明确记录的诊断或就诊原因。</li><li>在官方 Alphabetic Index 定位主词，并遵循 See / See also。</li><li>去 Tabular List 查看完整代码、排除项、Code First、Use Additional Code、第七位字符等指示。</li><li>核查服务日期、就诊场景、文档完整性及相关支付方规则。</li></ol>
    <p>本查询数据仅为代码描述和完整代码标志，不包含全部分类表说明。未授权分发 CPT® 描述及其代码书不在此模块内。</p>
   </section>
   <div className="icd-links">
    <a href="https://www.cdc.gov/nchs/icd/icd-10-cm/files.html" target="_blank" rel="noreferrer">CDC 官方 FY2027 文件 <ExternalLink size={14}/></a>
    <a href="https://www.cms.gov/medicare/coding-billing/ICD-10-codes" target="_blank" rel="noreferrer">CMS 官方 ICD-10 文件 <ExternalLink size={14}/></a>
   </div>
  </div>
 </main>;
}
