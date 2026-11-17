"use client";

import {useState} from "react";
import {Capacitor,registerPlugin} from "@capacitor/core";
import {Download} from "lucide-react";

const REPO="infcreative-Ethan/cpc-academy";
const RELEASES="https://github.com/"+REPO+"/releases";
const API="https://api.github.com/repos/"+REPO+"/releases/latest";
const BUILD=Number(process.env.NEXT_PUBLIC_CPC_BUILD_CODE||"0");
type ReleaseAsset={name:string;browser_download_url:string;digest?:string|null};
type GitHubRelease={tag_name:string;assets:ReleaseAsset[];html_url:string};
type Update={build:number;url:string;sha256?:string};
type UpdaterNative={
 downloadAndInstall(options:{url:string;sha256?:string}):Promise<{status:string}>;
};
const nativeUpdater=registerPlugin<UpdaterNative>("CpcUpdater");

export default function AppUpdateButton(){
 const [checking,setChecking]=useState(false);
 const [update,setUpdate]=useState<Update|null>(null);
 const [message,setMessage]=useState("");
 async function check(){
  setChecking(true);setUpdate(null);setMessage("");
  try{
   const response=await fetch(API,{headers:{Accept:"application/vnd.github+json"},cache:"no-store"});
   if(!response.ok)throw new Error("GitHub HTTP "+response.status);
   const release=await response.json() as GitHubRelease;
   const match=/^v1\.0\.0-beta\.(\d+)$/.exec(release.tag_name);
   const asset=release.assets?.find(x=>x.name==="CPC-Academy.apk");
   if(!match||!asset?.browser_download_url)throw new Error("No signed APK in latest release");
   const available=Number(match[1]);
   if(BUILD>0&&available<=BUILD){
    setMessage("已是最新版本（Build "+BUILD+"）。");
    return;
   }
   if(!asset.browser_download_url.startsWith(RELEASES+"/download/"))
    throw new Error("Untrusted download address");
   setUpdate({build:available,url:asset.browser_download_url,
    ...(asset.digest?.startsWith("sha256:")?{sha256:asset.digest.slice(7)}:{})});
   setMessage("检测到新版 Build "+available+"，点击下载并安装。");
  }catch{
   setMessage("暂时无法检查更新，请确认网络或查看正式版本发布页。");
  }finally{setChecking(false);}
 }
 async function install(){
  if(!update)return;
  try{
   setMessage("开始下载 APK。下载完成后需要在 Android 系统界面确认安装。");
   if(Capacitor.isNativePlatform()&&Capacitor.getPlatform()==="android"){
    await nativeUpdater.downloadAndInstall({url:update.url,sha256:update.sha256});
   }else{
    window.open(update.url,"_blank","noopener,noreferrer");
   }
  }catch(error){
   setMessage("安装未启动，请授权“允许此来源安装应用”后重试。"+
    (error instanceof Error?" "+error.message:""));
  }
 }
 return <>
  <button className="update-button" onClick={()=>void check()} disabled={checking}>
   <Download size={14}/>{checking?"检查中…":"检查更新"}
  </button>
  {(message||update)&&<div className="update-notice" role="status">
   <span>{message}</span>
   {update&&<button className="update-download-now" onClick={()=>void install()}>
     <Download size={14}/> 下载并安装
   </button>}
   <a href={RELEASES} target="_blank" rel="noreferrer">版本页面</a>
   <button onClick={()=>{setUpdate(null);setMessage("");}} aria-label="关闭更新提示">×</button>
  </div>}
 </>;
}
