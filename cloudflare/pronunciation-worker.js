/**
 * Cloudflare Worker for CPC Academy pronunciation and Chinese-meaning reports.
 * All secrets remain server-side. Each accepted report creates a GitHub issue
 * that the project maintainer can view and ChatGPT can query via GitHub.
 */
const cors={
 "Access-Control-Allow-Origin":"*",
 "Access-Control-Allow-Methods":"POST,OPTIONS",
 "Access-Control-Allow-Headers":"content-type",
 "Cache-Control":"no-store",
};
function respond(body,status=200){
 return new Response(JSON.stringify(body),{status,headers:{...cors,"Content-Type":"application/json; charset=utf-8"}});
}
export default {
 async fetch(request,env){
  const url=new URL(request.url);
  if(request.method==="OPTIONS")return new Response(null,{status:204,headers:cors});
  if(url.pathname==="/health"&&request.method==="GET")return respond({ok:true});
  if(url.pathname!=="/report"||request.method!=="POST")return respond({error:"Not found"},404);
  if(!request.headers.get("content-type")?.toLowerCase().includes("application/json"))
   return respond({error:"Expected JSON"},415);
  if(Number(request.headers.get("content-length")||0)>4096)return respond({error:"Too large"},413);
  let row;
  try{
   const text=await request.text();
   if(text.length>4096)return respond({error:"Too large"},413);
   row=JSON.parse(text);
  }catch{return respond({error:"Invalid JSON"},400);}
  const term=typeof row?.term==="string"?row.term.trim():"";
  const id=typeof row?.id==="string"?row.id.trim():"";
  const kind=row?.kind==="translation"?"translation":"pronunciation";
  const reason=row?.reason;
  const reportedAt=typeof row?.reportedAt==="string"?row.reportedAt:"";
  const meaning=typeof row?.meaningSnapshot==="string"?row.meaningSnapshot.trim():"";
  const note=typeof row?.note==="string"?row.note.trim():"";
  const descriptions={
    incorrect:"读音不准确",
    clipped:"开头音节被吞掉",
    incomplete:"发音不完整或音频异常",
    "incorrect-meaning":"中文释义不准确",
    "missing-meaning":"中文释义缺失",
    formatting:"中文释义乱码/排版异常",
    other:"其他中文释义问题",
  };
  const allowed=kind==="translation"
    ?["incorrect-meaning","missing-meaning","formatting","other"]
    :["incorrect","clipped","incomplete"];
  if(!/^[A-Za-z][A-Za-z0-9 ,.'()/-]{0,119}$/.test(term)||
     !/^[A-Za-z0-9_-]{4,100}$/.test(id)||
     !allowed.includes(reason)||
     meaning.length>300||note.length>300||
     Number.isNaN(Date.parse(reportedAt)))
    return respond({error:"Invalid report"},400);
  if(!env.GITHUB_TOKEN)return respond({error:"Reporting service not configured"},503);
  if(env.REPORT_IDS&&await env.REPORT_IDS.get(id))return respond({ok:true,duplicate:true});
  const safe=(value)=>String(value).replace(/[\r\n|<>]/g," ").slice(0,300);
  const safeTerm=safe(term);
  const repo=env.GITHUB_REPO||"infcreative-Ethan/cpc-academy";
  const title=kind==="translation"?"[释义反馈] ":"[发音反馈] ";
  const issueBody=[
    kind==="translation"?"## CPC Academy 中文释义问题反馈":"## CPC Academy 发音错误反馈",
    "",
    "| 字段 | 记录 |",
    "|---|---|",
    "| 单词 | "+safeTerm+" |",
    "| 问题类型 | "+descriptions[reason]+" |",
    ...(kind==="translation"?[
      "| 当前中文释义 | "+safe(meaning)+" |",
      "| 用户补充建议 | "+safe(note)+" |",
    ]:[]),
    "| 手机记录时间 (UTC) | "+new Date(reportedAt).toISOString()+" |",
    "| 反馈 ID | "+id+" |",
    "",
    "> 自动反馈：不包含学习记录、设备身份或 PDF 文件。",
    "<!-- cpc-report-id:"+id+" -->",
  ].join("\n");
  try{
   const upstream=await fetch("https://api.github.com/repos/"+repo+"/issues",{
    method:"POST",
    headers:{
     "Authorization":"Bearer "+env.GITHUB_TOKEN,
     "Accept":"application/vnd.github+json",
     "X-GitHub-Api-Version":"2022-11-28",
     "User-Agent":"CPC-Academy-Report-Worker",
     "Content-Type":"application/json",
    },
    body:JSON.stringify({title:title+safeTerm,body:issueBody}),
   });
   if(!upstream.ok)return respond({error:"Cloud storage temporarily unavailable"},502);
   const issue=await upstream.json();
   if(env.REPORT_IDS)await env.REPORT_IDS.put(id,String(issue.number),{expirationTtl:31536000});
   return respond({ok:true,issue:issue.number},201);
  }catch{return respond({error:"Cloud storage temporarily unavailable"},502);}
 }
};
