export type CodingTrack = "icd10" | "cpt" | "hcpcs" | "compliance";

export type CodingUnit = {
  id: string;
  track: CodingTrack;
  title: string;
  zh: string;
  priority: "P0" | "P1";
  duration: string;
  summary: string;
  objectives: string[];
  lessons: string[];
  keyPoints: string[];
  workflow: string[];
  caution: string;
  quiz: { question: string; options: string[]; answer: number; explanation: string };
};

export const codingTracks: { id: CodingTrack; title: string; zh: string; description: string }[] = [
  { id: "icd10", title: "ICD-10-CM", zh: "诊断编码", description: "从 Index、Tabular List 到官方指南和临床诊断案例" },
  { id: "cpt", title: "CPT®", zh: "专业服务与操作", description: "手术、放射学、实验室、Medicine、E/M 和麻醉" },
  { id: "hcpcs", title: "HCPCS Level II", zh: "用品、药物与设备", description: "DME、用品、药物、剂量单位和季度更新" },
  { id: "compliance", title: "Rules & Compliance", zh: "编码规则与合规", description: "Modifiers、NCCI、MUE、Medical Necessity 和审核" },
];

export const codingUnits: CodingUnit[] = [
  {
    id: "icd-foundations", track: "icd10", title: "ICD-10-CM Foundations", zh: "诊断编码基础与年度版本", priority: "P0", duration: "4 lessons",
    summary: "理解 ICD-10-CM 的用途、结构、适用场景和服务日期版本原则。",
    objectives: ["区分诊断编码与操作编码", "理解字母数字代码结构和章节组织", "根据 Date of Service 选择适用版本"],
    lessons: ["ICD-10-CM 的用途与适用范围", "代码结构、类别与子类别", "FY 年度版本与生效日期", "ICD-10-CM 与 ICD-10-PCS 的区别"],
    keyPoints: ["ICD-10-CM 用于诊断、疾病、症状及就诊原因分类。", "ICD-10-PCS 是独立的住院操作编码体系，不等同于 CPT®。", "FY2027 ICD-10-CM 适用于 2026-10-01 至 2027-09-30 的相应就诊日期。", "编码版本必须与服务日期匹配，不能只看当前年份。"],
    workflow: ["确认服务日期", "确认医疗场景和编码任务", "选择对应年度的 ICD-10-CM 文件", "记录所用版本和官方来源"],
    caution: "不要把 ICD-10-CM 诊断编码、ICD-10-PCS 住院操作编码和 CPT® 专业服务编码混为一谈。",
    quiz: { question: "FY2027 ICD-10-CM 的适用起始日期是什么？", options: ["2026-01-01", "2026-04-01", "2026-10-01", "2027-01-01"], answer: 2, explanation: "FY2027 ICD-10-CM 自 2026 年 10 月 1 日起生效。实际编码仍应核对官方文件和具体服务日期。" }
  },
  {
    id: "icd-index", track: "icd10", title: "Alphabetic Index", zh: "字母索引查询", priority: "P0", duration: "4 lessons",
    summary: "学会从临床诊断术语定位主词、次级词条和候选代码。",
    objectives: ["识别 Main Term 与 Subterm", "使用交叉引用和修饰词", "避免仅凭 Index 直接定码"],
    lessons: ["Index 的结构和查找入口", "Main Term 与 Subterm", "See / See Also 交叉引用", "诊断表达与索引词条匹配"],
    keyPoints: ["先确定医生明确记录的诊断概念，再寻找索引主词。", "逐级阅读缩进的次级词条和修饰词。", "See 表示需要转到另一个主词；See Also 提示可能存在相关入口。", "Index 给出查询路径，不是最终核码步骤。"],
    workflow: ["提取病历中的诊断原词", "定位 Main Term", "逐级检查 Subterm", "遵循交叉引用", "记录候选代码并进入 Tabular List"],
    caution: "不要只用搜索引擎片段或 Alphabetic Index 的候选结果作为最终编码依据。",
    quiz: { question: "在 ICD-10-CM 查询中，找到 Alphabetic Index 的候选代码后，下一步应当做什么？", options: ["直接提交代码", "在 Tabular List 核对代码和说明", "改用 CPT®", "只查看搜索结果摘要"], answer: 1, explanation: "必须进入 Tabular List 核对完整代码、有效性、说明和所有适用的 instructional notes。" }
  },
  {
    id: "icd-tabular", track: "icd10", title: "Tabular List Verification", zh: "表格核对", priority: "P0", duration: "4 lessons",
    summary: "将 Index 查询结果放入 Tabular List，确认代码层级、说明和适用条件。",
    objectives: ["理解类目、子类目和完整代码", "核对 Includes 与 Excludes", "识别需要进一步编码的说明"],
    lessons: ["Tabular List 的层级结构", "完整代码与 billable specificity", "Includes、Excludes1、Excludes2", "Tabular notes 与代码有效性"],
    keyPoints: ["核对完整代码，不停留在未完成的类别层级。", "阅读代码所属类别及上级标题中的说明。", "Excludes1 通常表示排除在外；特定无关情况的处理须按官方指南判断。", "Excludes2 表示所列条件不包含在该代码中；两种情况同时存在时可能需要分别报告。"],
    workflow: ["从 Index 获取候选代码", "在 Tabular List 定位", "检查上级类别说明", "检查 Includes / Excludes", "确认完整代码和生效日期"],
    caution: "Excludes1 和 Excludes2 不能简化成无条件的“永远不能一起编码”或“总能一起编码”。应按官方指南和具体记录判断。",
    quiz: { question: "Tabular List 核对时，哪项做法正确？", options: ["只看代码标题", "只看 Index", "检查完整代码及上级层级的说明", "忽略 Excludes notes"], answer: 2, explanation: "代码说明可能位于当前代码、子类目或上级类别层级，必须检查所有适用说明。" }
  },
  {
    id: "icd-conventions", track: "icd10", title: "Coding Conventions", zh: "编码惯例与符号", priority: "P0", duration: "5 lessons",
    summary: "掌握 ICD-10-CM 代码表中的惯例、缩写、符号和占位符。",
    objectives: ["区分 NEC 与 NOS", "理解括号和方括号等符号", "识别 placeholder 与第七位字符"],
    lessons: ["NEC 与 NOS", "括号、方括号和冒号", "Placeholder X", "7th Character", "Laterality 与代码细化"],
    keyPoints: ["NEC = Not Elsewhere Classified，表示已有更具体描述但分类中没有单独列项。", "NOS = Not Otherwise Specified，表示记录没有提供更具体的信息。", "某些代码要求使用 X 作为占位符，以保持字符位置。", "第七位字符只在相关类别要求时使用，可能还需要占位符。", "Laterality 可能要求区分右侧、左侧或双侧。"],
    workflow: ["查看类别是否要求完整字符数", "检查占位符要求", "检查第七位字符要求", "核对侧别和具体部位", "再次确认代码完整有效"],
    caution: "不能把 NEC 和 NOS 当作同义词；不能自行补出病历未记录的侧别或细节。",
    quiz: { question: "NOS 通常表达什么情况？", options: ["分类系统没有更具体的代码", "病历没有提供更具体的信息", "必须使用第七位字符", "必须同时编码两个疾病"], answer: 1, explanation: "NOS 表示记录或描述未进一步说明；NEC 则表示已知更具体内容，但分类中没有更细的单独代码。" }
  },
  {
    id: "icd-instructions", track: "icd10", title: "Instructional Notes & Sequencing", zh: "指示说明与编码顺序", priority: "P0", duration: "4 lessons",
    summary: "理解 Code First、Use Additional Code、Code Also 等指示及其对顺序的影响。",
    objectives: ["识别编码顺序指示", "理解病因与表现编码关系", "按 Tabular instructions 完成多代码组合"],
    lessons: ["Code First", "Use Additional Code", "Code Also", "Etiology / Manifestation 与 Sequencing"],
    keyPoints: ["Code First 提示需要先报告相关基础疾病或病因，具体顺序依说明而定。", "Use Additional Code 提示在适用时还需报告补充信息。", "Code Also 提示可能需要另一个代码，但不一定单独规定顺序。", "Etiology / Manifestation 组合必须遵循相关编码说明和官方指南。"],
    workflow: ["读取代码旁边的全部指示", "确认是否要求额外代码", "确定顺序规则", "检查组合是否完整", "记录规则依据"],
    caution: "不要仅凭诊断名称推断代码顺序；必须按当前 Tabular List 和适用官方指南核对。",
    quiz: { question: "看到 Code First 指示时，编码员应当怎样做？", options: ["忽略该指示", "检查并按指示先报告相关基础疾病或病因", "自动加 Modifier 59", "改用 HCPCS"], answer: 1, explanation: "Code First 是编码顺序指示，需要检查相关基础疾病或病因及适用的代码说明。" }
  },
  {
    id: "icd-general", track: "icd10", title: "General Coding Guidelines", zh: "通用诊断编码指南", priority: "P0", duration: "5 lessons",
    summary: "学习官方指南如何与分类表惯例共同使用，并应用到常见诊断情形。",
    objectives: ["理解官方指南与分类表惯例的关系", "区分症状与已确诊疾病", "理解组合编码和多重编码"],
    lessons: ["Official Guidelines 的作用", "Signs and Symptoms", "Combination Codes", "Multiple Coding", "Unspecified 与 Other Specified"],
    keyPoints: ["ICD-10-CM 分类表中的惯例和指示优先于指南中的一般说明。", "症状可能在没有确诊时作为编码对象；已确诊疾病与症状的报告需按具体规则判断。", "Combination Code 可在一个代码中表达多个相关临床概念。", "Other Specified 与 Unspecified 的选择取决于记录内容和分类结构。"],
    workflow: ["完整阅读本次就诊记录", "确认医生确立的诊断", "检查症状是否另有报告要求", "核对组合代码和多重编码说明", "检查年度官方指南"],
    caution: "实验室数值、影像发现或患者自述不能由编码员自行转化为医生未记录的诊断。",
    quiz: { question: "ICD-10-CM 分类表惯例与官方指南发生冲突时，通常应优先遵循哪项？", options: ["分类表中的惯例和指示", "网络搜索结果", "旧版培训笔记", "个人习惯"], answer: 0, explanation: "FY2027 Official Guidelines 明确说明分类系统中的 instructions and conventions take precedence over guidelines。" }
  },
  {
    id: "icd-settings", track: "icd10", title: "Outpatient & Inpatient Coding", zh: "门诊与住院编码原则", priority: "P0", duration: "4 lessons",
    summary: "区分门诊 First-listed Diagnosis 与住院 Principal Diagnosis，并理解不确定诊断的场景差异。",
    objectives: ["识别医疗场景", "区分 first-listed 与 principal diagnosis", "理解不确定诊断的场景规则"],
    lessons: ["Outpatient encounter basics", "First-listed diagnosis", "Inpatient principal diagnosis", "Uncertain diagnoses by setting"],
    keyPoints: ["必须先识别 encounter setting，再应用对应规则。", "门诊专业服务常围绕本次服务的 first-listed diagnosis 展开。", "Principal Diagnosis 是非门诊住院场景中的专门概念，不应随意套用于医师门诊索赔。", "门诊不确定诊断通常不按已确诊疾病编码；住院出院时的不确定诊断有特定规则和适用条件。"],
    workflow: ["确认场景和服务类型", "确定本次就诊目的", "阅读诊断确定程度", "应用相应场景的官方指南", "检查 first-listed / principal diagnosis 的术语是否使用正确"],
    caution: "不要把住院设施编码规则直接套用到 physician professional claims；实际工作还要核对 payer 和 setting。",
    quiz: { question: "Principal Diagnosis 主要属于哪类编码概念？", options: ["所有门诊服务", "非门诊住院场景", "所有 HCPCS 用品", "仅放射学报告"], answer: 1, explanation: "Principal Diagnosis 是住院非门诊编码中的专门概念；门诊和医师专业服务通常使用相应的 first-listed diagnosis 规则。" }
  },
  {
    id: "icd-chapters", track: "icd10", title: "Chapter-Specific Guidelines", zh: "疾病章节专项指南", priority: "P0", duration: "6 lessons",
    summary: "按疾病系统学习专项指南，并与《The Language of Medicine》的22章医学课程建立关联。",
    objectives: ["定位疾病所属 ICD-10-CM 章节", "识别章节专属规则", "结合医学术语理解诊断记录"],
    lessons: ["Infectious diseases 与 resistance", "Neoplasms", "Diabetes 与 endocrine conditions", "Circulatory / respiratory / digestive conditions", "Pregnancy 与 perinatal coding", "Injuries、poisoning、symptoms 与 Z codes"],
    keyPoints: ["不同疾病章节可能存在额外的报告、顺序或组合编码要求。", "肿瘤编码需区分原发部位、继发部位、当前状态和病史等记录。", "糖尿病编码需核对类型、并发症和分类表指示。", "妊娠相关编码需考虑孕期、分娩和产后情境及官方指南。", "损伤和中毒可能要求第七位字符及适用的 encounter character。"],
    workflow: ["确定诊断所属章节", "打开该章节的 Official Guidelines", "核对 Tabular instructions", "提取病历中支持专项规则的信息", "按规则完成代码和顺序核验"],
    caution: "本单元只教授查询与规则应用，不允许仅凭病理、化验或常识自行确定肿瘤、糖尿病并发症或妊娠诊断。",
    quiz: { question: "学习某个 ICD-10-CM 疾病章节时，除了通用规则还必须检查什么？", options: ["只查医学词典", "该章节的 Chapter-Specific Guidelines", "只查 CPT® Index", "只看历史版本"], answer: 1, explanation: "Official Guidelines 包含与 ICD-10-CM 章节对应的专项指南，必须结合分类表指示一起使用。" }
  },
  {
    id: "icd-documentation", track: "icd10", title: "Documentation, Query & Audit", zh: "病历文档、查询与审核", priority: "P0", duration: "4 lessons",
    summary: "从临床记录中识别支持编码的证据、矛盾信息和需要澄清的缺口。",
    objectives: ["区分 provider documentation 与其他信息", "识别文档不充分或矛盾", "理解合规的 provider query"],
    lessons: ["Medical record review", "Conflicting or incomplete documentation", "Provider query principles", "Coding audit and rationale"],
    keyPoints: ["编码必须有符合规则的病历依据。", "编码员不能自行补写诊断或推断并发症。", "遇到矛盾、缺失或不清晰记录时，按机构和合规政策处理 query。", "审核记录应能说明代码选择依据和所用规则版本。"],
    workflow: ["检查完整病历", "标记支持编码的记录位置", "识别矛盾或缺失", "判断是否需要 query", "保存审核理由和来源"],
    caution: "AI 提取结果只能作为辅助；最终编码判断必须由合格人员根据完整记录和适用规则核实。",
    quiz: { question: "病历没有记录糖尿病并发症，但 AI 根据实验室结果推测存在并发症，编码员应如何处理？", options: ["直接编码并发症", "用最常见代码代替", "不得自行推断，按需要走澄清流程", "改用 CPT®"], answer: 2, explanation: "编码员不能把 AI 推测或实验室数值自行转化为未记录的诊断；必要时按合规流程向 provider 澄清。" }
  },
  {
    id: "cpt-foundations", track: "cpt", title: "CPT® Fundamentals & Codebook Navigation", zh: "CPT基础与编码书导航", priority: "P0", duration: "4 lessons",
    summary: "理解 CPT® 的用途、类别、书籍结构、索引和章节说明。",
    objectives: ["区分 CPT® 与 ICD-10-CM / HCPCS Level II", "使用 CPT Index 定位候选服务", "阅读 section guidelines 和 parenthetical instructions"],
    lessons: ["CPT® 的用途与类别", "CPT Codebook 结构", "Alphabetic Index 查询", "Section Guidelines 与 Parenthetical Notes"],
    keyPoints: ["CPT® 报告医师及其他合格专业人员提供的专业服务和操作。", "Category I、II、III 的用途不同，必须按当前 CPT 版说明学习。", "Index 用于定位，必须进一步核对具体章节、代码说明和所有注释。", "CPT® 描述和表格受 AMA 版权及授权约束。"],
    workflow: ["明确实际提供的服务", "使用获授权的当年度 CPT® 书", "通过 Index 定位", "阅读章节 Guidelines 和括号说明", "核对代码选择和付款方要求"],
    caution: "本 App 不内置未经授权的 CPT® 完整代码表或描述；实际查码使用合法授权的当年度资料。",
    quiz: { question: "使用 CPT® Index 找到候选项目后，正确的下一步是什么？", options: ["直接提交", "核对具体章节、代码说明和注释", "用 ICD-10-CM 替代", "忽略 parenthetical notes"], answer: 1, explanation: "CPT Index 是定位工具，最终选择需要核对代码书中的章节规则、描述和附加说明。" }
  },
  {
    id: "cpt-surgery", track: "cpt", title: "Surgery & Operative Report Coding", zh: "手术编码与手术记录", priority: "P0", duration: "6 lessons",
    summary: "将手术记录中的解剖部位、操作目标、方法和实际工作转化为可核验的 CPT 查询路径。",
    objectives: ["阅读手术记录", "区分 procedure、approach 和 anatomy", "识别未记录或不确定的关键细节"],
    lessons: ["Operative report structure", "Procedure objective and anatomy", "Approach and technique", "Surgical services by body system", "Add-on / separate procedure concepts", "Integrated operative cases"],
    keyPoints: ["必须编码实际执行并由记录支持的服务，而不是仅根据术前计划。", "区分手术目标、具体解剖结构、操作方法和入路。", "同一临床名称可能对应不同工作内容，不能仅凭俗称定码。", "阅读 CPT 手术章节的专属 Guidelines 和 parenthetical notes。"],
    workflow: ["先阅读完整 operative report", "提取实际操作和目标结构", "记录侧别、入路和技术", "用 CPT Index 查询", "核对章节规则及代码说明", "检查是否有附加或组合报告要求"],
    caution: "没有完整手术记录时，不要仅凭诊断名称或手术标题猜测 CPT® 代码。",
    quiz: { question: "选择手术 CPT® 代码时，最重要的临床依据是什么？", options: ["患者问题列表中的手术计划", "实际完成的手术记录和相关代码说明", "只看患者年龄", "网络搜索中的常见代码"], answer: 1, explanation: "编码要反映实际执行的服务，并根据完整 operative report 和当年度 CPT® 规则核验。" }
  },
  {
    id: "cpt-specialties", track: "cpt", title: "CPT® Surgery by Specialty", zh: "按专科学习手术编码", priority: "P0", duration: "6 lessons",
    summary: "按 CPT 手术章节组织学习，并与教材22章的人体系统课程关联。",
    objectives: ["理解主要手术专科章节", "建立 anatomy-to-procedure 关联", "按专科规则阅读病例"],
    lessons: ["10000 series：Integumentary", "20000 series：Musculoskeletal", "30000 series：Respiratory / Cardiovascular / Hemic-Lymphatic", "40000 series：Digestive", "50000 series：Urinary / Reproductive / Endocrine", "60000 series：Nervous system（按 CPC 考试蓝图）"],
    keyPoints: ["10000 系列主要关联皮肤、皮下组织及乳腺相关服务。", "20000 系列主要关联肌肉骨骼系统。", "30000 系列关联呼吸、心血管、血液和淋巴等手术领域。", "40000 系列关联消化系统。", "50000 系列关联泌尿、生殖、产科和内分泌等领域。", "60000 系列在 AAPC CPC 考试蓝图中对应神经系统手术；眼科、耳科服务应按授权版 CPT 的具体章节和代码说明独立查询。"],
    workflow: ["先确定操作的解剖系统", "选择相应 CPT 专科章节", "阅读该章节 Guidelines", "使用 Index 定位", "核对代码说明和其他规则"],
    caution: "本单元展示的是学习导航，不是完整 CPT 目录或可直接用于索赔的代码表；最终范围以授权版 CPT 为准。",
    quiz: { question: "CPT 20000 series 的主要学习关联是什么？", options: ["Musculoskeletal procedures", "Digestive procedures", "Radiology only", "Psychiatry only"], answer: 0, explanation: "20000 系列主要涉及肌肉骨骼系统手术操作，需结合具体年度 CPT 章节说明核验。" }
  },
  {
    id: "cpt-radiology-lab", track: "cpt", title: "Radiology & Pathology/Laboratory", zh: "放射学与病理实验室编码", priority: "P0", duration: "4 lessons",
    summary: "理解影像和实验室服务的文档组成、专业/技术部分以及检查方法。",
    objectives: ["识别影像 modality 与部位", "理解 professional / technical component", "区分实验室方法和诊断结论"],
    lessons: ["Radiology service documentation", "Professional and technical components", "Pathology and laboratory services", "Integrated imaging and lab cases"],
    keyPoints: ["影像编码需要核对实际 modality、部位、视图、对比剂和报告等适用信息。", "Professional Component 与 Technical Component 是不同服务组成，按具体 CPT 规则和支付方要求核验。", "实验室编码需要理解检测方法、标本、项目组合和服务记录。", "不能仅凭异常检验结果自行推断诊断。"],
    workflow: ["识别服务类别", "核对实际完成的检查", "阅读报告和服务记录", "查询授权版 CPT", "核对 component、modifier 和支付方规则"],
    caution: "不要假设每一项影像服务都能同时报告专业部分和技术部分；需要核对实际服务和适用规则。",
    quiz: { question: "影像服务编码前，哪组信息最值得核对？", options: ["只看诊断名称", "modality、检查部位、实际服务及报告", "只看预约时间", "患者偏好的医院"], answer: 1, explanation: "需要根据实际执行的影像服务、部位、报告和代码说明确定编码。" }
  },
  {
    id: "cpt-medicine", track: "cpt", title: "Medicine Services", zh: "Medicine 专业服务", priority: "P0", duration: "4 lessons",
    summary: "学习 CPT Medicine 部分常见服务类别和专业记录要求。",
    objectives: ["识别 Medicine 服务类别", "阅读治疗和诊断服务记录", "区分服务项目与药品供应"],
    lessons: ["Medicine section navigation", "Therapeutic and diagnostic services", "Drug administration and immunization concepts", "Integrated Medicine cases"],
    keyPoints: ["Medicine 部分涵盖多种专业服务，必须按具体章节和代码说明核验。", "给药服务、药品本身和药品供应可能涉及不同报告项目。", "服务时间、执行人员、给药途径和实际操作可能影响编码。", "每个服务都必须有适用的记录支持。"],
    workflow: ["识别具体 Medicine 服务", "核对执行人员和记录", "区分药物与给药服务", "查询当前 CPT / HCPCS 资料", "检查单位、modifier 和支付方要求"],
    caution: "不要把药物名称、给药服务和药物计费单位视为同一个编码对象。",
    quiz: { question: "药物相关记录中，编码员需要区分哪几项？", options: ["药物本身、给药服务和计费单位", "只有品牌名", "只有患者年龄", "只需要 ICD-10-PCS"], answer: 0, explanation: "药物、给药服务和计费单位是不同概念，需分别核对适用代码集和记录。" }
  },
  {
    id: "cpt-em", track: "cpt", title: "Evaluation and Management (E/M)", zh: "评估与管理服务", priority: "P0", duration: "5 lessons",
    summary: "按 E/M 服务类别学习场景、患者状态、Medical Decision Making 和时间规则。",
    objectives: ["识别 E/M 服务类别", "理解 MDM 与时间选择路径", "核对服务场景和文档要求"],
    lessons: ["E/M code family and place of service", "New vs established patient", "Medical Decision Making", "Time-based selection", "Preventive, hospital, ED and critical care overview"],
    keyPoints: ["E/M 不是单一代码族，不同服务场景有不同规则。", "New / Established patient 定义需按对应 CPT 指南判断。", "MDM 需按适用的组成部分和层级标准核验。", "以时间选择时必须按对应服务类别和当前规则记录可计入的时间。", "服务地点和服务类别会影响适用代码族。"],
    workflow: ["确定 E/M 服务类别和地点", "确认患者状态", "选择适用的 MDM 或时间路径", "核对记录是否支持", "检查当年度 CPT 指南和支付方政策"],
    caution: "不能把所有 E/M 服务都按同一套 MDM 或时间规则处理；必须先确定具体 E/M 类别。",
    quiz: { question: "选择 E/M 代码前，最先需要确定什么？", options: ["患者喜欢的医生", "具体 E/M 服务类别和场景", "只看诊断严重程度", "只看账单金额"], answer: 1, explanation: "不同 E/M 类别有不同的代码选择规则；先确定服务类别和场景，再应用对应规则。" }
  },
  {
    id: "cpt-anesthesia", track: "cpt", title: "Anesthesia Coding", zh: "麻醉编码", priority: "P1", duration: "3 lessons",
    summary: "理解麻醉服务记录、时间、physical status 和 qualifying circumstances。",
    objectives: ["识别麻醉服务对象", "核对麻醉时间记录", "识别适用的修饰符和附加条件"],
    lessons: ["Anesthesia service basics", "Time and physical status", "Qualifying circumstances and case practice"],
    keyPoints: ["麻醉服务编码与手术操作编码不同。", "麻醉时间、服务记录和适用的物理状态修饰符必须按当年度规则核对。", "Qualifying circumstances 需有相应记录支持。"],
    workflow: ["识别麻醉服务", "确认麻醉记录和时间", "核对适用的 physical status", "查询授权版 CPT", "检查附加条件和支付方要求"],
    caution: "不能仅根据手术类型或患者病情推断麻醉时间或 physical status。",
    quiz: { question: "麻醉编码中的时间应依据什么？", options: ["手术预约时长", "符合规则的麻醉记录", "患者到院时间", "术后恢复室全部时间自动相加"], answer: 1, explanation: "麻醉时间应按适用规则和麻醉记录核算，不能使用预约时长或任意时间段代替。" }
  },
  {
    id: "cpt-modifiers", track: "cpt", title: "CPT® Modifiers & Reporting", zh: "CPT修饰符与报告规则", priority: "P0", duration: "5 lessons",
    summary: "学习 Modifier 的功能、适用条件和常见误用，结合实际服务记录进行判断。",
    objectives: ["理解 modifier 不改变基础服务定义的原则", "区分常见 modifier 场景", "避免为绕过编辑而添加 modifier"],
    lessons: ["Modifier fundamentals", "E/M modifiers 24 / 25 / 57", "Professional / technical and bilateral concepts", "Distinct and repeat service concepts", "Postoperative and discontinued service concepts"],
    keyPoints: ["Modifier 必须由实际情况和记录支持。", "Modifier 25 与 57 的适用情境不同，不能互换。", "Modifier 26 / TC 涉及专业部分与技术部分。", "Modifier 59 及 X{EPSU} 系列用于特定可区分服务情形，不是通用的编辑绕过工具。", "需使用当年度 CPT 和适用 payer policy 核对。"],
    workflow: ["先确认基础代码正确", "识别是否存在符合条件的特殊情形", "阅读 modifier 定义和章节说明", "检查 NCCI 编辑及 payer policy", "记录使用依据"],
    caution: "不能为了让两个代码同时支付而自动添加 Modifier 59；必须证明符合适用的独立服务条件。",
    quiz: { question: "Modifier 的正确使用原则是什么？", options: ["用于绕过所有 NCCI 编辑", "只要付款被拒就添加", "必须有符合定义的临床事实和文档支持", "可替代正确的基础 CPT 代码"], answer: 2, explanation: "Modifier 必须由真实服务情况和记录支持，不能作为绕过编辑的通用工具。" }
  },
  {
    id: "hcpcs-foundations", track: "hcpcs", title: "HCPCS Level II Fundamentals", zh: "HCPCS Level II 基础", priority: "P0", duration: "4 lessons",
    summary: "理解 HCPCS Level II 的用途、结构、字母数字类别和官方季度更新。",
    objectives: ["区分 HCPCS Level I 与 Level II", "理解用品、设备和部分药物的编码对象", "使用有效季度文件"],
    lessons: ["HCPCS Level II purpose and scope", "Alpha-numeric code structure", "CMS quarterly files", "Effective dates and deleted/revised items"],
    keyPoints: ["HCPCS Level II 补充描述许多 CPT Level I 未涵盖的产品、用品、设备和部分服务。", "CMS 按季度发布 HCPCS Level II 更新文件。", "代码存在并不自动代表 Medicare 或其他 payer 会覆盖该项目。", "必须按服务日期选择有效版本。"],
    workflow: ["识别实际提供的 item / supply / drug / service", "查 CMS 当前季度文件", "核对描述和单位", "确认有效日期", "检查 coverage 和 payer policy"],
    caution: "HCPCS code assignment 与 coverage / payment determination 是不同问题。",
    quiz: { question: "拥有 HCPCS Level II 代码是否自动保证项目获得 Medicare 覆盖？", options: ["是", "否，覆盖和支付另有政策判断", "只要是药物就保证", "只要医生开单就保证"], answer: 1, explanation: "CMS 明确说明 HCPCS Level II 代码的存在本身不决定项目是否覆盖或支付。" }
  },
  {
    id: "hcpcs-dme-drugs", track: "hcpcs", title: "DME, Supplies, Drugs & Units", zh: "设备、用品、药物与单位", priority: "P0", duration: "4 lessons",
    summary: "从实际提供的物品、药物、剂量和计费单位识别 HCPCS Level II 查询要求。",
    objectives: ["识别 DME 和用品记录", "区分药物剂量与代码单位", "核对药物和设备描述"],
    lessons: ["Durable Medical Equipment", "Prosthetics, orthotics and supplies", "Drugs and biologicals", "Dosage, units and documentation"],
    keyPoints: ["编码对象应与实际提供的设备、用品或药物相符。", "药物剂量和 HCPCS 计费单位并不总是相同。", "必须核对代码描述中的单位、剂量和适用说明。", "供应商记录、订单和医疗必要性文件可能是重要审核资料。"],
    workflow: ["读取医嘱和供应商记录", "识别实际提供的物品或药品", "核对单位与剂量", "查询当前 HCPCS 文件", "核验文档和 coverage policy"],
    caution: "不得仅凭药物名称或商品品牌推断 HCPCS 代码和单位。",
    quiz: { question: "HCPCS 药物编码中，剂量与计费单位应如何处理？", options: ["始终视为相同", "根据代码描述和官方单位规则分别核对", "只看药品包装", "忽略给药记录"], answer: 1, explanation: "实际剂量与代码单位是不同概念，必须依据适用代码描述和官方规则核对。" }
  },
  {
    id: "hcpcs-modifiers", track: "hcpcs", title: "HCPCS Modifiers", zh: "HCPCS修饰符", priority: "P1", duration: "3 lessons",
    summary: "理解 HCPCS Level II modifier 的用途及其与具体供应、设备和服务的关系。",
    objectives: ["区分 CPT 与 HCPCS modifier 使用场景", "核对设备和供应商文档", "按 payer 规则验证"],
    lessons: ["HCPCS modifier structure", "DME and supply modifier concepts", "Documentation and payer verification"],
    keyPoints: ["HCPCS modifier 的适用范围需按代码集和具体政策核对。", "同一 modifier 在不同支付场景下可能有不同要求。", "必须检查供应商文件、使用情况和有效日期。"],
    workflow: ["确认 HCPCS 基础代码", "核对 modifier 定义", "检查实际设备或服务情况", "核对 payer policy", "记录文档依据"],
    caution: "不能把 CPT modifier 的使用条件不加区分地套用到 HCPCS Level II。",
    quiz: { question: "HCPCS Level II modifier 应依据什么确定？", options: ["只凭 CPT 经验", "适用代码集定义、实际服务和 payer policy", "任意选择一个相近 modifier", "只看设备品牌"], answer: 1, explanation: "必须结合 HCPCS 定义、实际项目和具体支付方规则核对。" }
  },
  {
    id: "compliance-ncci", track: "compliance", title: "NCCI PTP & MUE", zh: "国家正确编码编辑与单位编辑", priority: "P0", duration: "4 lessons",
    summary: "理解 NCCI Procedure-to-Procedure edits 与 Medically Unlikely Edits 的作用和限制。",
    objectives: ["区分 PTP 与 MUE", "理解编辑文件和有效日期", "识别 modifier indicator 的审核意义"],
    lessons: ["NCCI purpose and scope", "PTP edit pairs", "MUE and units of service", "Quarterly update and audit workflow"],
    keyPoints: ["PTP edits 用于识别通常不应同时报告的代码组合。", "MUE 用于检查单个代码在特定日期、提供者类型或服务单位情形下的数量合理性。", "PTP 和 MUE 文件可能按季度更新。", "编辑结果需要结合服务记录、适用 modifier 和具体政策判断。"],
    workflow: ["确认服务日期和 provider type", "选择相应季度文件", "检查代码对或单位编辑", "核对是否存在符合条件的 modifier 情形", "记录审核结果"],
    caution: "NCCI 是正确编码编辑机制，不等同于 prior authorization、coverage determination 或 medical necessity 判断。",
    quiz: { question: "MUE 主要用于检查什么？", options: ["诊断拼写", "单个代码在特定日期的服务单位数量", "患者年龄", "CPT 版权许可"], answer: 1, explanation: "MUE 是 Medically Unlikely Edit，主要涉及单个 HCPCS/CPT 代码的单位数量编辑。" }
  },
  {
    id: "compliance-global", track: "compliance", title: "Global Surgery & Medical Necessity", zh: "全球手术服务包与医疗必要性", priority: "P0", duration: "4 lessons",
    summary: "区分手术全球期、相关术后服务、医疗必要性和支付方覆盖政策。",
    objectives: ["理解 global surgical package 概念", "区分 coding correctness 与 coverage", "核对 payer-specific policy"],
    lessons: ["Global surgery concept", "Related and unrelated postoperative services", "Medical necessity", "NCD / LCD and payer policies"],
    keyPoints: ["Global surgical package 规定特定手术前后相关服务的报告方式。", "术后期间发生的服务需判断与原手术的关系及适用规则。", "Medical necessity 与代码描述正确性是不同审核问题。", "NCD、LCD 和商业 payer policy 可能影响覆盖与支付。"],
    workflow: ["确认原手术及日期", "识别当前服务与原手术的关系", "核对 global period 和适用 modifier", "检查 medical necessity / coverage policy", "记录结论和依据"],
    caution: "不能仅因为服务在术后期间发生就自动认定包含或不包含；需要结合服务性质和适用规则判断。",
    quiz: { question: "Medical Necessity 与 coding correctness 是什么关系？", options: ["完全相同", "不同的审核问题，需要分别核对", "Medical necessity 可替代代码查询", "代码正确就必然覆盖"], answer: 1, explanation: "代码选择正确不代表 payer 一定覆盖；medical necessity 和 coverage policy 需要单独核验。" }
  },
  {
    id: "compliance-privacy", track: "compliance", title: "HIPAA, Fraud, Compliance & Audit", zh: "隐私、合规、欺诈与审核", priority: "P1", duration: "4 lessons",
    summary: "建立专业编码员的隐私保护、合规意识、审计和升级处理流程。",
    objectives: ["理解 HIPAA 基础要求", "识别不当编码和潜在风险", "建立审计证据链"],
    lessons: ["HIPAA privacy and security basics", "Fraud, waste and abuse concepts", "Coding audit and error categories", "Escalation, query and record retention"],
    keyPoints: ["PHI 应按适用隐私和安全要求保护。", "编码员不能为了提高报销而改变或夸大临床记录。", "审计需要保留记录依据、代码版本和规则来源。", "发现系统性错误时应按机构合规流程升级处理。"],
    workflow: ["保护和最小化使用患者信息", "按完整记录编码", "记录代码和规则依据", "识别异常或冲突", "按流程 query、纠正和升级"],
    caution: "学习模拟病例不得包含可识别真实患者的信息；本 App 的病例应使用虚构或充分脱敏资料。",
    quiz: { question: "合规编码的基本原则是什么？", options: ["尽量选择报销最高的代码", "按完整文档和适用规则准确报告服务", "缺少信息时自行补充", "忽略审计记录"], answer: 1, explanation: "编码必须准确反映文档支持的服务，不能为了支付结果而夸大或推断。" }
  },
];

export const cpcExamDomains = [
  { name: "Medical Terminology", zh: "医学术语", questions: 4 },
  { name: "Anatomy", zh: "解剖学", questions: 4 },
  { name: "Compliance and Regulatory", zh: "合规与监管", questions: 3 },
  { name: "Coding Guidelines", zh: "编码指南与修饰符", questions: 7 },
  { name: "ICD-10-CM", zh: "诊断编码", questions: 5 },
  { name: "HCPCS Level II", zh: "用品与药物编码", questions: 3 },
  { name: "CPT 10000 Series", zh: "皮肤与乳腺手术", questions: 6 },
  { name: "CPT 20000 Series", zh: "肌肉骨骼手术", questions: 6 },
  { name: "CPT 30000 Series", zh: "呼吸、心血管、血液和淋巴手术", questions: 6 },
  { name: "CPT 40000 Series", zh: "消化系统手术", questions: 6 },
  { name: "CPT 50000 Series", zh: "泌尿、生殖和内分泌手术", questions: 6 },
  { name: "CPT 60000 Series", zh: "神经系统手术", questions: 6 },
  { name: "Radiology", zh: "放射学", questions: 6 },
  { name: "Pathology and Laboratory", zh: "病理与实验室", questions: 6 },
  { name: "Medicine", zh: "Medicine 专业服务", questions: 6 },
  { name: "Evaluation and Management", zh: "评估与管理", questions: 6 },
  { name: "Anesthesia", zh: "麻醉", questions: 4 },
  { name: "Medical Record Cases", zh: "综合病历案例", questions: 10 },
];

export const codingVersions = [
  { name: "ICD-10-CM FY2027", status: "当前适用", effective: "2026-10-01 至 2027-09-30", note: "按服务日期选择 FY2027 官方文件。" },
  { name: "CPT® 2026", status: "当前服务日期版本", effective: "2026-01-01 至 2026-12-31", note: "CPT® 2027 自 2027-01-01 起生效；请使用授权版编码书。" },
  { name: "HCPCS Level II 2026 Q4", status: "当前适用", effective: "2026-10-01 起，按 CMS 文件说明", note: "CMS 已发布 2027 年 1 月季度文件，预定 2027-01-01 生效。" },
  { name: "NCCI PTP 2026 Q4", status: "按服务日期核验", effective: "使用对应季度文件", note: "CMS 已公布 Version 33.0，计划 2027-01-01 生效。" },
];

export const officialCodingResources = [
  { label: "AAPC — CPC Exam Format & Blueprint", url: "https://www.aapc.com/certifications/cpc-and-cpb/taking-the-cpc-and-cpb-exams", note: "100题、4小时、考试领域分布和批准的参考书。" },
  { label: "CMS — ICD-10-CM / PCS Official Files", url: "https://www.cms.gov/medicare/coding-billing/ICD-10-codes", note: "年度诊断和住院操作编码文件及更新。" },
  { label: "CMS — FY2027 ICD-10-CM Official Guidelines", url: "https://www.cms.gov/files/document/fy-2027-icd-10-cm-coding-guidelines.pdf", note: "FY2027 官方诊断编码指南。" },
  { label: "CMS — HCPCS Level II Quarterly Update", url: "https://www.cms.gov/medicare/coding-billing/healthcare-common-procedure-system/quarterly-update", note: "HCPCS Level II 官方季度文件和生效日期。" },
  { label: "CMS — NCCI Edits and Policy Manual", url: "https://www.cms.gov/medicare/coding-billing/national-correct-coding-initiative-ncci-edits", note: "PTP、MUE 和 NCCI 政策资料。" },
  { label: "CMS — NCCI FAQ", url: "https://www.cms.gov/medicare/coding-billing/national-correct-coding-initiative-ncci-edits/medicare-ncci-faq-library", note: "NCCI 编辑、更新频率和适用说明。" },
  { label: "AMA — CPT Licensing FAQ", url: "https://www.ama-assn.org/practice-management/cpt/cpt-licensing-frequently-asked-questions-faqs", note: "CPT® 版权与电子产品授权说明。" },
];

export const codingWorkflow = [
  { title: "Receive the complete record", zh: "接收并阅读完整病历", detail: "确认服务日期、就诊场景、provider、完整记录和本次服务目的。" },
  { title: "Identify the encounter", zh: "确认医疗场景", detail: "区分 office、outpatient hospital、ASC、ED、inpatient、telehealth 等适用场景。" },
  { title: "Extract documented facts", zh: "提取有依据的临床信息", detail: "提取医生诊断、症状、解剖部位、侧别、实际操作、检查和支持文档。" },
  { title: "Assign diagnosis codes", zh: "查询 ICD-10-CM", detail: "Index 定位、Tabular 核对、阅读说明、检查有效版本和场景规则。" },
  { title: "Assign service / supply codes", zh: "查询 CPT® / HCPCS", detail: "根据实际专业服务、操作、用品或药物选择正确代码集并核对说明。" },
  { title: "Apply edits and policies", zh: "核对编辑和支付政策", detail: "按适用情况检查 modifiers、NCCI、MUE、global surgery 和 payer coverage。" },
  { title: "Document the rationale", zh: "记录编码依据", detail: "保留文档位置、代码版本、官方来源、判断理由和待澄清事项。" },
  { title: "Final review", zh: "完成最终审核", detail: "检查完整性、准确性、合规性和所有未解决的文档缺口。" },
];
