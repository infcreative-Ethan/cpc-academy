"use client";

import type {MedicalDiagram} from "@/lib/cpc-medical-lessons";

const labelColor="#534b94";
const tissue="#d9d8f2";

function Caption({children}:{children:React.ReactNode}){return <p className="learn-advanced-caption">{children}</p>;}
export default function AdvancedMedicalDiagram({kind}:{kind:MedicalDiagram}){
 if(kind==="skeletal")return <div className="learn-anatomy-board">
  <div className="learn-anatomy-heading"><b>骨骼和关节 · Skeletal anatomy</b><span>原创结构示意</span></div>
  <svg viewBox="0 0 560 325" role="img" aria-label="头骨脊柱骨盆及四肢骨骼结构示意">
   <g fill="none" stroke="#a7a4c9" strokeWidth="13" strokeLinecap="round">
    <path d="M173 93L169 187L132 235L115 298M172 184L204 232L220 298"/>
    <path d="M170 110L115 117L88 177L71 229M173 110L230 118L253 176L271 229"/>
   </g>
   <g fill="#e6e4fa" stroke="#8076b6" strokeWidth="2">
    <ellipse cx="170" cy="46" rx="35" ry="34"/><rect x="151" y="78" width="37" height="113" rx="16"/>
    <path d="M112 105Q170 76 231 105L222 141Q170 168 120 141Z" opacity=".65"/>
    <path d="M129 182Q169 160 209 182L223 204L173 218L119 203Z"/>
    <circle cx="169" cy="113" r="12" fill="#bab4e2"/><circle cx="169" cy="145" r="12" fill="#bab4e2"/>
    <circle cx="133" cy="213" r="9" fill="#ddd9f0"/><circle cx="203" cy="215" r="9" fill="#ddd9f0"/>
   </g>
   <g fill={labelColor} fontSize="13" fontWeight="700">
    <text x="330" y="53">Skull · 颅骨</text><text x="330" y="100">Vertebrae · 椎骨</text>
    <text x="330" y="149">Ribs · 肋骨</text><text x="330" y="199">Pelvis · 骨盆</text>
    <text x="330" y="246">Femur · 股骨</text><text x="330" y="293">Tibia · 胫骨</text>
   </g>
   <g stroke="#b4afd6" strokeWidth="1.5" strokeDasharray="4 5">
    <path d="M205 45H320M192 115H320M219 143H320M225 197H320M194 247H320M213 291H320"/>
   </g>
  </svg>
  <Caption>示意图突出骨与关节的部位关系，简化了真实人体解剖与骨骼数量。</Caption>
 </div>;
 if(kind==="skin")return <div className="learn-anatomy-board">
  <div className="learn-anatomy-heading"><b>皮肤层次与附属器 · Skin</b><span>原创组织分层</span></div>
  <svg viewBox="0 0 560 260" role="img" aria-label="表皮真皮皮下组织及毛囊汗腺位置">
   <path d="M20 46H359V86H20Z" fill="#efd3e1" stroke="#dcb0cb"/>
   <path d="M20 86H359V181H20Z" fill="#f6d9bd" stroke="#d8b88d"/>
   <path d="M20 181H359V234H20Z" fill="#f3e9b3" stroke="#dbc96e"/>
   {Array.from({length:6},(_,i)=><path key={i} d={"M"+(32+i*54)+" 198Q"+(56+i*49)+" 216 "+(27+i*53)+" 230"} stroke="#d6c96d" strokeWidth="4" fill="none"/>)}
   <path d="M100 17L110 139" stroke="#564974" strokeWidth="5" strokeLinecap="round"/>
   <path d="M103 82Q132 111 114 150Q94 153 92 136Z" fill="#b4a1c8" opacity=".8" stroke="#9c78aa"/>
   <path d="M259 109Q230 137 260 157Q289 176 259 194Q230 213 261 221" stroke="#ae90b7" strokeWidth="5" fill="none" strokeLinecap="round"/>
   <path d="M260 110Q260 68 292 56" stroke="#9d80af" strokeWidth="3" strokeDasharray="4 4" fill="none"/>
   <g fill={labelColor} fontSize="14" fontWeight="700">
    <text x="384" y="67">Epidermis · 表皮</text>
    <text x="384" y="122">Dermis · 真皮</text>
    <text x="384" y="203">Subcutaneous · 皮下</text>
   </g>
   <g stroke="#a9a3c6" strokeWidth="1.5" strokeDasharray="3 4"><path d="M359 65H380M359 121H380M359 202H380"/></g>
   <text x="24" y="250" fontSize="11" fill="#8c7396">Follicle · 毛囊</text><text x="214" y="250" fontSize="11" fill="#8c7396">Sweat gland · 汗腺</text>
  </svg>
  <Caption>用于认识皮肤层次及附属器，并非组织切片或具有实际比例的医学插图。</Caption>
 </div>;
 if(kind==="sense-eye")return <div className="learn-anatomy-board">
  <div className="learn-anatomy-heading"><b>眼球横截面 · Eye</b><span>原创简化解剖图</span></div>
  <svg viewBox="0 0 560 255" role="img" aria-label="角膜晶状体视网膜视神经示意">
   <circle cx="215" cy="128" r="95" fill="#dbe6fa" stroke="#a6a3cd" strokeWidth="5"/>
   <path d="M165 45Q107 126 165 211" fill="#eaf6ff" stroke="#7c9dc8" strokeWidth="4"/>
   <ellipse cx="158" cy="128" rx="24" ry="43" fill="#fff9ed" stroke="#d4bc94" strokeWidth="3"/>
   <path d="M196 34Q305 64 305 128Q305 211 196 223" fill="none" stroke="#cf969f" strokeWidth="8"/>
   <path d="M308 128H372" stroke="#c6abda" strokeWidth="22" strokeLinecap="round"/>
   <circle cx="195" cy="128" r="9" fill="#665baa"/>
   <g fontSize="13" fill={labelColor} fontWeight="700">
    <text x="384" y="49">Retina · 视网膜</text>
    <text x="384" y="105">Lens · 晶状体</text>
    <text x="384" y="164">Optic nerve · 视神经</text>
    <text x="384" y="211">Cornea · 角膜</text>
   </g>
   <g stroke="#aba6c8" strokeWidth="1.5" strokeDasharray="4 4">
    <path d="M296 46H379M176 107H379M331 152H379M131 192H379"/>
   </g>
  </svg>
  <Caption>展示光学通路相关结构的相对位置，图中视神经与晶状体尺寸均作了教学性简化。</Caption>
 </div>;
 if(kind==="sense-ear")return <div className="learn-anatomy-board">
  <div className="learn-anatomy-heading"><b>外耳、中耳和内耳 · Ear</b><span>原创结构示意</span></div>
  <svg viewBox="0 0 560 250" role="img" aria-label="耳廓外耳道鼓膜听小骨耳蜗结构图">
   <path d="M80 74Q38 41 39 123Q41 174 84 160Q124 126 90 100" fill="none" stroke="#d09aab" strokeWidth="20" strokeLinecap="round"/>
   <path d="M85 125H198" stroke="#dcb2bb" strokeWidth="25" strokeLinecap="round"/>
   <path d="M202 92L202 155" stroke="#9787c4" strokeWidth="7"/>
   <path d="M211 121L239 103L264 125L287 115" stroke="#b29bc2" strokeWidth="10" strokeLinecap="round" fill="none"/>
   <path d="M353 119Q365 85 338 75Q301 57 297 111Q296 157 338 167Q373 173 370 137Q365 112 342 126Q318 142 337 146" fill="none" stroke="#9ab5d8" strokeWidth="16" strokeLinecap="round"/>
   <path d="M356 160L408 198" stroke="#c8a8d7" strokeWidth="12" strokeLinecap="round"/>
   <g fill={labelColor} fontSize="13" fontWeight="700">
    <text x="31" y="219">External ear · 外耳</text><text x="202" y="219">Middle ear · 中耳</text><text x="368" y="61">Inner ear · 内耳</text>
    <text x="390" y="126">Cochlea</text><text x="390" y="146">耳蜗</text>
   </g>
   <g stroke="#b9b3d9" strokeDasharray="4 4" strokeWidth="2"><path d="M179 58V181M290 58V181"/></g>
  </svg>
  <Caption>表示外耳道、鼓膜、听小骨与耳蜗的传声联系；内耳细节与真实空间结构已经简化。</Caption>
 </div>;
 if(kind==="endocrine")return <div className="learn-anatomy-board">
  <div className="learn-anatomy-heading"><b>内分泌腺位置 · Endocrine system</b><span>部位与功能概览</span></div>
  <svg viewBox="0 0 560 328" role="img" aria-label="垂体、甲状腺、肾上腺、胰腺和性腺位置示意">
   <g stroke="#a4a2c3" fill="#eceafa" strokeWidth="2">
    <circle cx="158" cy="48" r="31"/><rect x="126" y="85" width="65" height="143" rx="29"/>
    <path d="M136 220L124 302M181 220L193 302" strokeWidth="18" strokeLinecap="round"/>
   </g>
   <circle cx="161" cy="54" r="7" fill="#a187d6"/><path d="M145 91Q158 106 173 91Q177 118 158 124Q141 114 145 91" fill="#b8a5da"/>
   <ellipse cx="147" cy="177" rx="13" ry="9" fill="#d79fc5"/><ellipse cx="179" cy="177" rx="13" ry="9" fill="#d79fc5"/>
   <ellipse cx="164" cy="203" rx="35" ry="8" fill="#cfb886"/>
   <ellipse cx="139" cy="274" rx="9" ry="7" fill="#bc92c8"/><ellipse cx="186" cy="274" rx="9" ry="7" fill="#bc92c8"/>
   <g stroke="#b9b3d3" strokeWidth="1.5" strokeDasharray="4 4">
    <path d="M168 54H305M179 105H305M191 177H305M201 203H305M198 274H305"/>
   </g>
   <g fill={labelColor} fontSize="14" fontWeight="700">
    <text x="319" y="59">Pituitary · 垂体</text><text x="319" y="110">Thyroid · 甲状腺</text>
    <text x="319" y="182">Adrenals · 肾上腺</text><text x="319" y="208">Pancreas · 胰腺</text>
    <text x="319" y="279">Gonads · 性腺</text>
   </g>
  </svg><Caption>此图仅示意常见腺体大致位置，不按人体器官比例或实际复杂腺体形态绘制。</Caption>
 </div>;
 const graph={
  oncology:{title:"肿瘤诊疗的四层信息",nodes:[["Signs / symptoms","症状或发现"],["Pathology / diagnosis","病理与临床诊断"],["Grade / stage","分级与分期"],["Treatment actually given","实际给予的治疗"]]},
  radiology:{title:"影像工作流程",nodes:[["Order","检查医嘱"],["Acquisition","实际影像获取"],["Interpretation","阅片与报告"],["Code verification","按服务核验代码"]]},
  pharma:{title:"药物处理与编码",nodes:[["Prescription","医嘱或处方"],["Drug and route","药物、剂量和途径"],["Administration","实际给药"],["Coding and review","代码、单位和审核"]]},
  psychiatry:{title:"精神卫生服务文档",nodes:[["Reported symptoms","患者报告的症状"],["Clinical assessment","专业评估与诊断"],["Therapeutic modality","实际治疗方法"],["Service documentation","时长、内容与服务记录"]]}
 } as const;
 const key=kind as keyof typeof graph;
 if(!(key in graph))return null;
 const g=graph[key];
 return <div className="learn-anatomy-board learn-advanced-flow">
   <div className="learn-anatomy-heading"><b>{g.title}</b><span>原创学习路径示意</span></div>
   {g.nodes.map((x,i)=><div className="learn-advanced-node" key={x[0]}>
     <div><b>{x[0]}</b><small>{x[1]}</small></div>{i<g.nodes.length-1&&<span aria-hidden="true">↓</span>}
   </div>)}
   <Caption>流程用来区分概念和记录层级，不代表医疗判断标准或真实索赔决定。</Caption>
 </div>;
}
