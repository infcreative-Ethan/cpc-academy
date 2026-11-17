"use client";

import {useEffect,useState} from "react";
import Link from "next/link";
import {ArrowLeft,BookOpen,FileSearch,Image as ImageIcon} from "lucide-react";
import {chapters} from "@/lib/cpc-curriculum";
import {medicalLessons} from "@/lib/cpc-medical-lessons";
import {figuresForChapter,textbookSource} from "@/lib/textbook-index";
import TextbookFigure from "@/components/textbook-figure";
import "./textbook.css";

export default function TextbookPictureLibrary(){
 const [chapter,setChapter]=useState(1);
 const [lessonId,setLessonId]=useState("");
 useEffect(()=>{
  const params=new URLSearchParams(window.location.search);
  const chapterQuery=Number(params.get("chapter"));
  if(Number.isInteger(chapterQuery)&&chapterQuery>=1&&chapterQuery<=22)setChapter(chapterQuery);
  const wanted=params.get("lesson")??"";setLessonId(wanted);
 },[]);
 const lessons=medicalLessons.filter(x=>x.chapter===chapter);
 const lesson=lessons.find(l=>l.id===lessonId)??null;
 return <main className="pdf-library-shell"><header className="pdf-library-top"><Link href="/cpc/" className="pdf-library-back"><ArrowLeft size={15}/> 学习中心</Link><b>Textbook Figure Link</b><Link href="/cpc/knowledge/" className="pdf-library-back">知识点索引 <BookOpen size={15}/></Link></header>
  <div className="pdf-library-container"><section className="pdf-library-hero"><span><ImageIcon size={16}/> PRIVATE PDF · PAGE & FIGURE MAP</span><h1>教材 PDF 图谱</h1>
   <p>只导入一次你自己的《The Language of Medicine, 13th Edition》PDF。434个编号图位可按章节查找；课时可自动推荐图片，也可手动选择、更正裁切、标注中英术语与认图测验。</p>
   <p>匹配基准为特定 PDF 文件（{textbookSource.pageCount}页）。不同版本或重新排版的 PDF 会禁用自动定位，避免显示错图。</p>
  </section>
  <div className="pdf-library-controls"><label>查看章节<select value={chapter} onChange={e=>{setChapter(Number(e.target.value));setLessonId("");}}>{chapters.map(ch=><option key={ch.number} value={ch.number}>Chapter {ch.number} · {ch.title}</option>)}</select></label>
   <label>与课程关联<select value={lessonId} onChange={e=>setLessonId(e.target.value)}><option value="">本章全部图片</option>{lessons.map(l=><option key={l.id} value={l.id}>{l.zh}</option>)}</select></label>
   <span><FileSearch size={15}/> {figuresForChapter(chapter).length}张图位</span></div>
  <TextbookFigure key={chapter+":"+lessonId} chapter={chapter} lesson={lesson}/>
  <section className="pdf-library-guide"><h2>使用规则与注意事项</h2><p>首次导入在 Android 上打开系统文件选择器，选中的 PDF 会复制到 App 私有目录，升级 App 无需再次选择；卸载或清理数据时可能需要重新导入。</p><p>自动定位根据你提供的具体 PDF 版本识别图号、PDF 页码、图像范围；并不是实时识别医学结构。每课的推荐图片可改选，裁切和中文/英文标签都保存在本机。</p><p>公开 GitHub 和 APK 中没有收录教材原图或原文；本功能不上传 PDF、不访问云端。</p></section>
  </div></main>;
}