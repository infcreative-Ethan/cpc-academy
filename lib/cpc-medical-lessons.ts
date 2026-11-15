import { medicalLessons1012 } from "./cpc-medical-lessons-10-12";
import { medicalLessons1314 } from "./cpc-medical-lessons-13-14";
import { moreMedicalLessons57 } from "./cpc-medical-lessons-5-7";
import { moreMedicalLessons79 } from "./cpc-medical-lessons-7-9";

/**
 * CPC Academy authored lesson pilots.
 *
 * Section titles align with the Table of Contents of The Language of Medicine,
 * 13th edition, supplied by the learner. The Chinese educational explanations,
 * example cases and quiz questions are independently authored; textbook prose
 * and end-of-chapter questions are not reproduced here.
 */
export type MedicalDiagram = "word" | "hierarchy" | "quadrants" | "spine" | "planes" | "digestive" | "nervous" | "heart" | "respiratory" | "blood" | "immune";
export type LessonQuestion = {
  question: string;
  options: [string,string,string,string];
  answer: number;
  explanation: string;
};
export type MedicalLesson = {
  id: string;
  chapter: number;
  textbookSection: string;
  title: string;
  zh: string;
  minutes: number;
  objectives: string[];
  teaching: { heading: string; body: string }[];
  diagram?: MedicalDiagram;
  terminology: { term: string; zh: string; note: string }[];
  clinical: { heading: string; note: string; task: string; takeaway: string };
  questions: [LessonQuestion, LessonQuestion];
};

export const medicalLessons: MedicalLesson[] = [
  {
    id:"med-1-word-analysis",chapter:1,textbookSection:"Word Analysis",title:"Elements of Medical Terms",zh:"词根、前缀和后缀",minutes:16,
    objectives:["认识 root、prefix、suffix 的作用","从词尾开始分析常见医学术语","区分医学词汇和疾病诊断"],
    teaching:[
      {heading:"为什么要拆词",body:"许多医学术语由可重复使用的组成部分构成。root 表达基础概念，prefix 位于词前，suffix 位于词尾。掌握构词方式，比孤立记忆每个单词更有效。"},
      {heading:"从后缀向前解读",body:"例如 cardiology：cardi 指心脏，-logy 指研究领域，合起来是心脏学。拆词帮助理解含义，但不能由词根直接推断患者已患某种疾病。"},
      {heading:"在病历中的用途",body:"病历中的术语可能代表症状、诊断、解剖结构、检查或操作。阅读时先解释术语，再核实医生究竟记录了什么事实。"}
    ],diagram:"word",
    terminology:[{term:"cardiology",zh:"心脏学",note:"cardi/o + -logy"},{term:"nephritis",zh:"肾炎",note:"nephr + -itis"},{term:"dermatology",zh:"皮肤病学",note:"dermat/o + -logy"},{term:"gastritis",zh:"胃炎",note:"gastr + -itis"}],
    clinical:{heading:"Clinical note · 医学术语辨认",note:"The patient was referred to cardiology for evaluation of intermittent palpitations.",task:"区分 cardiology（专科）和 palpitations（症状）。病历是否已经确认某一种心脏疾病？",takeaway:"没有。转诊专科和患者描述的症状都不能替代医生明确记录的最终诊断。"},
    questions:[
      {question:"cardiology 中的 -logy 表示什么？",options:["切除","研究领域","疼痛","炎症"],answer:1,explanation:"-logy 表示研究或学科，cardiology 即心脏学。"},
      {question:"病历写 referred to cardiology，正确理解是什么？",options:["已经确诊心肌梗死","说明患者有某种已确诊心脏病","说明转诊到心脏专科，不能单独确诊","说明进行了心脏手术"],answer:2,explanation:"专科名称本身不证明某项疾病已由医生确立。"}
    ]
  },
  {
    id:"med-1-combining",chapter:1,textbookSection:"Word Analysis",title:"Combining Forms and Vowels",zh:"组合形式与连接元音",minutes:14,
    objectives:["解释 combining form","识别医学词汇里的连接元音","了解多词根词汇的组合"],
    teaching:[
      {heading:"Combining form 是什么",body:"结合形式通常是词根加连接元音，常写成 gastr/o、cardi/o。这种写法说明该词根能够在组合时与其他组成部分连接。"},
      {heading:"Connecting vowel 连接规则",body:"两个词根之间通常保留连接元音，例如 gastroenterology 中 gastr/o 和 enter/o 的连接。接元音开头的后缀时常省略连接元音，例如 gastritis。"},
      {heading:"为什么不能机械套用",body:"医学词汇里也存在历史拼写和例外；拆词是学习工具。遇到不熟悉的术语，应当核对词典定义，而不是凭规则造词。"}
    ],diagram:"word",
    terminology:[{term:"gastroenterology",zh:"胃肠病学",note:"gastr/o + enter/o + -logy"},{term:"gastritis",zh:"胃炎",note:"gastr + -itis"},{term:"cardiomyopathy",zh:"心肌病",note:"cardi/o + my/o + -pathy"},{term:"hematology",zh:"血液学",note:"hemat/o + -logy"}],
    clinical:{heading:"Clinical note · 术语拆解",note:"A gastroenterology consultation was requested after the abdominal pain persisted.",task:"请先分析 gastroenterology 的组成部分；它描述的是什么？",takeaway:"这是消化系统相关医学专科/学科，并不等同于本次就诊已确诊的疾病。"},
    questions:[
      {question:"gastr/o 中的 /o 主要是什么？",options:["症状","连接元音","诊断代码","修饰符"],answer:1,explanation:"/o 是 combining vowel，gastr/o 是 combining form。"},
      {question:"gastritis 为什么通常不写成 gastroitis？",options:["-itis 以元音开头","gastr 不是词根","-itis 是前缀","所有疾病都不能有 o"],answer:0,explanation:"连接元音在元音开头的后缀前通常省略。"}
    ]
  },
  {
    id:"med-1-rules",chapter:1,textbookSection:"Word Analysis",title:"Word-Building Practice",zh:"医学构词规则与临床分类",minutes:18,
    objectives:["把熟悉的词根组合成术语","区分手术、炎症和检查词尾","把拆词结果连接到临床记录"],
    teaching:[
      {heading:"把 -itis 与 -ectomy 分开",body:"-itis 常用于炎症名称；-ectomy 表示手术切除。前者通常与诊断概念相关，后者通常与操作概念相关，但都要结合实际病历判断。"},
      {heading:"检查不等于诊断",body:"-scopy 常指使用内镜观察的检查/操作；检查名称不是检查结果。阅读病历时，需要把 procedure performed 和 provider assessment 分开记录。"},
      {heading:"第一章的正确学习结果",body:"完成本章后应会解释词汇结构，并能说明它属于什么类型的信息。无需记忆具体 ICD-10-CM 或 CPT 代码。"}
    ],diagram:"word",
    terminology:[{term:"appendectomy",zh:"阑尾切除术",note:"append + -ectomy"},{term:"colonoscopy",zh:"结肠镜检查",note:"colon/o + -scopy"},{term:"arthritis",zh:"关节炎",note:"arthr + -itis"},{term:"neuralgia",zh:"神经痛",note:"neur + -algia"}],
    clinical:{heading:"Clinical note · Procedure versus diagnosis",note:"Assessment: appendicitis. Procedure: laparoscopic appendectomy.",task:"找出医生诊断与实际操作；指出哪一部分需要诊断编码、哪一部分需要专业服务编码查询。",takeaway:"appendicitis 是诊断，appendectomy 是操作；编码前还需查核完整记录与适用代码书。"},
    questions:[
      {question:"-ectomy 常见含义是什么？",options:["炎症","出血","手术切除","内镜观察"],answer:2,explanation:"-ectomy 表示切除术。"},
      {question:"病历里的 colonoscopy 是哪一类信息？",options:["通常为检查/操作名称","一定是癌症确诊","药物名称","人体方位术语"],answer:0,explanation:"colonoscopy 是结肠镜操作；检查结果和诊断须另外核对。"}
    ]
  },
  {
    id:"med-2-organization",chapter:2,textbookSection:"Structural Organization of the Body",title:"From Cells to Organ Systems",zh:"从细胞到器官系统",minutes:18,
    objectives:["掌握 cell → tissue → organ → organ system","区分四类基本组织","理解同一器官可能含多类组织"],
    teaching:[
      {heading:"人体的组织层级",body:"细胞是生命活动的重要结构单位；具有相关功能的细胞组合形成组织；多种组织共同构成器官，器官再参与器官系统的工作。"},
      {heading:"四类基本组织",body:"Epithelial tissue 覆盖体表及器官内表面；connective tissue 支撑与连接；muscle tissue 收缩产生运动；nervous tissue 传递神经信号。"},
      {heading:"编码实践中的意义",body:"同一器官可能涉及不同病理组织。病理报告中的 tissue 和 organ 并非同一层次，编码员需要按文档确认实际取材或手术部位。"}
    ],diagram:"hierarchy",
    terminology:[{term:"cell",zh:"细胞",note:"基本结构和功能单位"},{term:"tissue",zh:"组织",note:"同类细胞共同承担功能"},{term:"organ",zh:"器官",note:"多种组织组成的结构"},{term:"epithelial",zh:"上皮的",note:"覆盖及衬里的组织"}],
    clinical:{heading:"Clinical note · Tissue sample",note:"A small biopsy of epithelial tissue was obtained from the lining of the stomach.",task:"区分 tissue、organ、procedure 三层信息；医生是否记录了一个组织切片还是整个胃切除？",takeaway:"记录描述为胃黏膜相关组织活检，不是胃切除。编码需核实具体操作记录和部位。"},
    questions:[
      {question:"哪一个层级顺序正确？",options:["器官→细胞→组织→系统","细胞→组织→器官→器官系统","组织→器官→细胞→系统","系统→细胞→器官→组织"],answer:1,explanation:"从细胞开始，逐步组织成组织、器官、器官系统。"},
      {question:"Epithelial tissue 的典型作用是？",options:["主要进行关节运动","主要覆盖体表或器官衬里","只存在于骨骼中","只存在于心肌"],answer:1,explanation:"上皮组织可构成体表覆盖与器官内部衬里。"}
    ]
  },
  {
    id:"med-2-cavities",chapter:2,textbookSection:"Structural Organization of the Body",title:"Body Cavities and Membranes",zh:"人体腔室与浆膜",minutes:17,
    objectives:["区分 dorsal 与 ventral cavities","定位 thoracic、abdominal、pelvic cavities","理解 pleura 与 peritoneum"],
    teaching:[
      {heading:"背侧与腹侧",body:"背侧腔室主要包含 cranial cavity 和 spinal cavity；腹侧腔室主要包含 thoracic cavity 和 abdominopelvic cavity。不同腔室容纳不同器官。"},
      {heading:"胸腹部的界限",body:"Diaphragm（膈肌）将胸腔与腹腔隔开；腹腔和盆腔共同构成腹盆腔区域。"},
      {heading:"浆膜词汇",body:"Pleura（胸膜）与肺和胸腔有关；peritoneum（腹膜）与腹盆腔器官及腹壁有关。看到 effusion、ascites 等术语时，要核对所描述的腔室。"}
    ],
    terminology:[{term:"pleura",zh:"胸膜",note:"胸腔、肺相关浆膜"},{term:"peritoneum",zh:"腹膜",note:"腹盆腔相关浆膜"},{term:"diaphragm",zh:"膈肌",note:"分隔胸腔和腹腔"},{term:"thoracic",zh:"胸部的",note:"与胸腔有关"}],
    clinical:{heading:"Clinical note · Localization",note:"Imaging reported a small pleural effusion on the right side.",task:"定位 pleural effusion 的解剖区域，并判断 side 有什么信息。",takeaway:"胸膜相关积液，记录明确右侧；这只是影像发现，是否报告具体诊断须按临床记录及规则判断。"},
    questions:[
      {question:"胸腔与腹腔主要由什么结构分隔？",options:["胃","膈肌","胸膜","腹膜"],answer:1,explanation:"Diaphragm 即膈肌，是胸腔与腹腔的主要分隔。"},
      {question:"Pleura 最直接关联什么区域？",options:["胸腔与肺","颅腔","骨髓腔","膝关节"],answer:0,explanation:"Pleura（胸膜）与肺和胸腔相关。"}
    ]
  },
  {
    id:"med-2-quadrants",chapter:2,textbookSection:"Abdominopelvic Regions and Quadrants",title:"Abdominal Quadrants and Regions",zh:"腹部四象限与九区",minutes:20,
    objectives:["按患者的解剖方向识别 RUQ、LUQ、RLQ、LLQ","认识九区的分区逻辑","理解症状部位不等于确诊疾病"],
    teaching:[
      {heading:"四象限定位",body:"腹部四象限是 RUQ（右上）、LUQ（左上）、RLQ（右下）和 LLQ（左下）。右、左以患者自身方向为准，面对患者时与观察者的左右相反。"},
      {heading:"九区",body:"从上到下分为右/左 hypochondriac 与 epigastric，中间右/左 lumbar 与 umbilical，下方右/左 inguinal 与 hypogastric。这套分区比四象限更具体。"},
      {heading:"对 CPC 的意义",body:"诊断、症状和操作部位可能使用不同定位方式。阅读病历要记录准确区域，但不能由 RUQ pain 自动推断胆囊疾病。"}
    ],diagram:"quadrants",
    terminology:[{term:"right upper quadrant",zh:"右上腹象限",note:"RUQ"},{term:"left lower quadrant",zh:"左下腹象限",note:"LLQ"},{term:"epigastric",zh:"上腹部的",note:"腹部九区中央上部"},{term:"umbilical",zh:"脐部的",note:"腹部九区中部中央"}],
    clinical:{heading:"Clinical note · Abdominal pain",note:"Chief complaint: right lower quadrant abdominal pain. Imaging pending.",task:"明确定位 RLQ。病历中是否已经确立 appendicitis（阑尾炎）？",takeaway:"还没有。疼痛定位不等于阑尾炎的诊断，必须以医生后续记录为准。"},
    questions:[
      {question:"RLQ 是什么意思？",options:["右上腹","左上腹","右下腹","左下腹"],answer:2,explanation:"RLQ = Right Lower Quadrant，以患者身体方向为准。"},
      {question:"仅有 RUQ pain，能否直接确认胆囊炎？",options:["可以，RUQ 永远是胆囊炎","不能，需根据医生记录判断","可以，只要疼痛持续一天","可改成胃炎"],answer:1,explanation:"部位和症状不能单独推断确诊疾病。"}
    ]
  },
  {
    id:"med-2-spine",chapter:2,textbookSection:"Divisions of the Back (Spinal Column)",title:"Spinal Column and Vertebral Regions",zh:"脊柱的解剖分区",minutes:16,
    objectives:["识别颈椎、胸椎、腰椎、骶骨、尾骨区域","读懂 C、T、L、S 椎体水平","准确记录病历中的椎体位置"],
    teaching:[
      {heading:"五个主要区域",body:"Cervical 颈椎通常7节；thoracic 胸椎12节；lumbar 腰椎5节；sacral 骶骨通常5个融合椎骨；coccygeal 尾骨通常由约4个融合尾椎构成。"},
      {heading:"编号代表位置",body:"L4–L5 表示第四和第五腰椎之间的水平；T12 与 L1 位于胸腰交界附近。读手术记录时必须区分 vertebra（椎骨）与 intervertebral disc（椎间盘）。"},
      {heading:"编码中的细节",body:"脊柱部位、操作节段和侧别可能影响编码，但仅凭 L4–L5 还无法确定手术类型。"}
    ],diagram:"spine",
    terminology:[{term:"cervical",zh:"颈部的",note:"C1–C7"},{term:"thoracic",zh:"胸部的",note:"T1–T12"},{term:"lumbar",zh:"腰部的",note:"L1–L5"},{term:"sacral",zh:"骶骨的",note:"通常为融合的5节"}],
    clinical:{heading:"Clinical note · Spine report",note:"MRI: disc protrusion at L4–L5.",task:"解释 L4–L5 的解剖水平；能否据此确认某种具体脊柱手术已经进行？",takeaway:"L4–L5 是腰椎间的水平；MRI 发现不是手术记录，不能推断已完成的操作。"},
    questions:[
      {question:"L4–L5 描述的是哪个区域？",options:["颈椎","腰椎","胸椎","尾骨"],answer:1,explanation:"L = Lumbar，L4–L5 位于腰椎区域。"},
      {question:"胸椎通常有多少节？",options:["5","7","12","14"],answer:2,explanation:"通常有12节胸椎（T1–T12）。"}
    ]
  },
  {
    id:"med-2-positions",chapter:2,textbookSection:"Positional and Directional Terms",title:"Anatomical Position and Direction",zh:"标准解剖姿势与方向术语",minutes:18,
    objectives:["区分 anterior/posterior、medial/lateral","区分 proximal/distal 与 superficial/deep","在病历中识别侧别"],
    teaching:[
      {heading:"标准解剖姿势",body:"讨论方向时以人体站立、面向前方、双臂自然下垂、手掌向前的标准姿势为参照。病历所写的左右均是患者自身左右。"},
      {heading:"方向成对比较",body:"Anterior 在前，posterior 在后；medial 靠近正中线，lateral 远离正中线；proximal 靠近身体/肢体起点，distal 远离起点。"},
      {heading:"深度与部位",body:"Superficial 表示较表浅，deep 表示较深。手术描述中位置和深度可能是重要信息，但不能据此猜测任何未记载的操作。"}
    ],diagram:"planes",
    terminology:[{term:"anterior",zh:"前部的",note:"相对 posterior"},{term:"posterior",zh:"后部的",note:"相对 anterior"},{term:"medial",zh:"靠近正中线的",note:"相对 lateral"},{term:"distal",zh:"远端的",note:"相对 proximal"}],
    clinical:{heading:"Clinical note · Wound location",note:"A superficial laceration was noted over the anterior aspect of the left forearm.",task:"找出深度、前后方向、部位和侧别。",takeaway:"Superficial、anterior、forearm、left 分别是表浅、前侧、前臂、左侧；不能用这些词推断伤口长度和修复方法。"},
    questions:[
      {question:"Distal 在四肢方向术语中通常表示什么？",options:["靠近躯干","远离身体或肢体起点","更深","靠近正中线"],answer:1,explanation:"Distal 指较远端，常与 proximal 成对。"},
      {question:"病历中的 left forearm 的 left 以谁为准？",options:["看图的人","患者本人","医生站位","医院方位"],answer:1,explanation:"医学解剖左右侧以患者自身为准。"}
    ]
  },
  {
    id:"med-2-planes",chapter:2,textbookSection:"Planes of the Body",title:"Anatomical Planes",zh:"矢状面、冠状面、横断面",minutes:14,
    objectives:["辨认 sagittal、coronal、transverse","理解 midsagittal 的概念","把影像切面与解剖术语建立联系"],
    teaching:[
      {heading:"Sagittal plane",body:"矢状面将身体分成左、右两部分；midsagittal plane 经过身体正中线，分成左右两半。"},
      {heading:"Coronal and transverse",body:"Coronal（frontal）冠状面将身体分为前后部分；transverse 横断面将身体分为上、下部分。"},
      {heading:"应用场景",body:"CT、MRI 的图像常以不同切面展示。解读影像报告时，要根据实际扫描切面识别部位，不应只凭示意图作出诊断。"}
    ],diagram:"planes",
    terminology:[{term:"sagittal",zh:"矢状的",note:"分隔左右"},{term:"coronal",zh:"冠状的",note:"分隔前后"},{term:"transverse",zh:"横断的",note:"分隔上下"},{term:"midsagittal",zh:"正中矢状的",note:"经正中线分隔左右两半"}],
    clinical:{heading:"Clinical note · Imaging",note:"The MRI series includes sagittal and axial (transverse) images of the lumbar spine.",task:"说明 sagittal 与 transverse 两种切面的区别。",takeaway:"矢状面显示左右分隔方向，横断面显示上下分隔方向；它们描述的是影像方向，不是具体诊断。"},
    questions:[
      {question:"哪种平面将身体分成上、下两部分？",options:["Sagittal","Coronal","Transverse","Midsagittal"],answer:2,explanation:"Transverse plane 是横断面，分隔上下。"},
      {question:"Coronal plane 的主要分隔方向是什么？",options:["左和右","前和后","上和下","皮肤和肌肉"],answer:1,explanation:"Coronal / frontal plane 分隔前后。"}
    ]
  },
  {
    id:"med-3-conditions",chapter:3,textbookSection:"Introduction",title:"Suffixes for Diseases and Conditions",zh:"疾病与病理状态后缀",minutes:18,
    objectives:["区分 -itis、-osis、-algia","理解 -emia 与血液状态有关","避免把词汇含义当作诊断依据"],
    teaching:[
      {heading:"Suffix 的临床作用",body:"后缀经常帮助确定术语表示的是疾病状态、症状、检查还是治疗过程。-itis 常表示炎症，-algia 表示疼痛，-emia 表示血液相关状态。"},
      {heading:"学习方式",body:"把术语拆成词根 + 后缀，再找临床含义：arthritis（关节炎）、neuralgia（神经痛）、anemia（贫血）。注意并非所有以某些字母结尾的词都能机械拆分。"},
      {heading:"Diagnosis 必须由记录支持",body:"编码员应当区分词语本身的定义与医生对患者的明确诊断。病理状态词可以出现在鉴别诊断、家族史或否定句中。"}
    ],
    terminology:[{term:"arthritis",zh:"关节炎",note:"arthr + -itis"},{term:"neuralgia",zh:"神经痛",note:"neur + -algia"},{term:"anemia",zh:"贫血",note:"血液相关状态"},{term:"nephritis",zh:"肾炎",note:"nephr + -itis"}],
    clinical:{heading:"Clinical note · Negative finding",note:"The patient denies joint pain. No diagnosis of arthritis was established.",task:"能否因为病历中出现 arthritis 就报告关节炎？",takeaway:"不能。必须理解否定、排除和已确认的临床判断，而不是只识别关键词。"},
    questions:[
      {question:"-itis 通常表示什么？",options:["炎症","切除","影像记录","缝合"],answer:0,explanation:"-itis 通常表示炎症。"},
      {question:"No diagnosis of arthritis was established 表示什么？",options:["已确诊关节炎","没有确立关节炎诊断","实施了关节置换","需要自动添加代码"],answer:1,explanation:"否定句清楚表达没有确立关节炎诊断。"}
    ]
  },
  {
    id:"med-3-procedures",chapter:3,textbookSection:"Introduction",title:"Surgical and Diagnostic Suffixes",zh:"手术与检查类后缀",minutes:18,
    objectives:["区分 -ectomy、-otomy、-ostomy","区分 -gram 与 -graphy","识别手术计划和已实施操作"],
    teaching:[
      {heading:"手术词尾辨析",body:"-ectomy 表示切除，-otomy 表示切开，-ostomy 表示建立人工开口。这些概念不同，不能当作同一手术来查询编码。"},
      {heading:"检查与结果",body:"-gram 常指记录或图像；-graphy 常指记录/成像过程。检查记录与检查结果、医生诊断需要分别阅读。"},
      {heading:"对 CPC 的用途",body:"在 CPT® 查询前，先弄清实际执行的是切除、切开、造口、内镜检查还是其他服务，再阅读正式操作记录核验方法和范围。"}
    ],
    terminology:[{term:"appendectomy",zh:"阑尾切除术",note:"-ectomy"},{term:"tracheostomy",zh:"气管造口术",note:"-ostomy"},{term:"angiography",zh:"血管造影术",note:"-graphy"},{term:"mammogram",zh:"乳腺影像",note:"-gram"}],
    clinical:{heading:"Clinical note · Procedure title",note:"The surgeon performed an appendectomy. An ostomy was not created.",task:"找出已完成操作，以及明确没有实施的操作。",takeaway:"记录为阑尾切除术；并未建立造口。不能因为相似后缀就额外编码。"},
    questions:[
      {question:"-ostomy 通常表示什么？",options:["炎症","建立人工开口","切除","记录结果"],answer:1,explanation:"-ostomy 表示造口/建立人工开口。"},
      {question:"手术记录里仅写 planned appendectomy，而未证明已执行，应如何处理？",options:["直接报告手术","确认是否实际完成及有无操作记录","改用 -otomy","自动视作成功"],answer:1,explanation:"计划不等于已执行，需完整查看手术记录。"}
    ]
  },
  {
    id:"med-3-blood",chapter:3,textbookSection:"A Closer Look",title:"Blood Cells and Specialized Suffixes",zh:"血细胞术语与重点后缀",minutes:17,
    objectives:["解释 -cyte、-logy、-logist","辨认血细胞类型的基本术语","建立第三章与血液系统章节的联系"],
    teaching:[
      {heading:"-cyte：细胞",body:"-cyte 指细胞，如 erythrocyte（红细胞）、leukocyte（白细胞）。血细胞有多种功能，后续 Chapter 13 将系统学习组成和形成。"},
      {heading:"-logy 与 -logist",body:"-logy 通常表示研究领域；-logist 通常表示相关领域的专家。区分学科名称与提供医疗服务的专业人员。"},
      {heading:"教学衔接",body:"本章只要求读懂术语结构和基本含义；血液检查结果的解释和具体病理放在 Chapter 13。"}
    ],
    terminology:[{term:"erythrocyte",zh:"红细胞",note:"erythr/o + -cyte"},{term:"leukocyte",zh:"白细胞",note:"leuk/o + -cyte"},{term:"hematology",zh:"血液学",note:"hemat/o + -logy"},{term:"hematologist",zh:"血液科专家",note:"hemat/o + -logist"}],
    clinical:{heading:"Clinical note · Specialty referral",note:"The hematologist reviewed the patient's blood cell counts.",task:"区分 hematologist、blood cell counts 和明确诊断。",takeaway:"血液科专家查看血细胞计数。该句本身不表明任何特定血液疾病已确诊。"},
    questions:[
      {question:"-cyte 是什么意思？",options:["骨骼","细胞","手术","测量"],answer:1,explanation:"-cyte 表示细胞。"},
      {question:"hematologist 通常表示什么？",options:["一种手术","血液学相关专家","白细胞数值","血液药物"],answer:1,explanation:"-logist 通常指对应领域的专家。"}
    ]
  },
  {
    id:"med-4-negation",chapter:4,textbookSection:"Introduction",title:"Prefixes of Negation and Degree",zh:"否定与程度前缀",minutes:17,
    objectives:["识别 a-/an-、dys- 等常见前缀","区分 brady- 与 tachy-","理解医学术语的常见对比"],
    teaching:[
      {heading:"缺失与异常",body:"a-/an- 可表示没有或缺乏，dys- 可表示困难、疼痛或异常。apnea 表示呼吸暂停，dyspnea 表示呼吸困难，意义不同。"},
      {heading:"快与慢",body:"brady- 表示缓慢，tachy- 表示快速。bradycardia 和 tachycardia 均涉及心率，但描述相反状态。"},
      {heading:"医学语境很重要",body:"词根和前缀能帮助理解含义，但判断具体疾病及严重程度仍要回到医生记录。"}
    ],
    terminology:[{term:"apnea",zh:"呼吸暂停",note:"a- + -pnea"},{term:"dyspnea",zh:"呼吸困难",note:"dys- + -pnea"},{term:"bradycardia",zh:"心动过缓",note:"brady- + -cardia"},{term:"tachycardia",zh:"心动过速",note:"tachy- + -cardia"}],
    clinical:{heading:"Clinical note · Symptoms",note:"The patient reports dyspnea on exertion. Apnea was not reported.",task:"区分实际报告的症状和没有报告的情况。",takeaway:"记录了活动时呼吸困难，没有记录呼吸暂停；不能把两个术语互换。"},
    questions:[
      {question:"brady- 通常表示什么？",options:["快速","缓慢","没有","两侧"],answer:1,explanation:"brady- 表示慢，tachy- 表示快。"},
      {question:"dyspnea 与 apnea 的区别是什么？",options:["两者完全相同","前者呼吸困难、后者呼吸暂停","前者是心脏检查、后者是药物","前者表示外科切除"],answer:1,explanation:"二者使用了不同前缀，不能互相替代。"}
    ]
  },
  {
    id:"med-4-position",chapter:4,textbookSection:"Introduction",title:"Position, Time and Quantity Prefixes",zh:"位置、时间和数量前缀",minutes:18,
    objectives:["辨认 ante-、post-、sub-、inter- 等","理解 bi- 与 uni- 的数量差异","将前缀与具体解剖描述关联"],
    teaching:[
      {heading:"相对位置",body:"sub- 常表示在下方；inter- 常表示在……之间。subcutaneous 表示皮下的，intercostal 表示肋骨之间的。"},
      {heading:"时间与阶段",body:"ante- 表示之前，post- 表示之后。例如 preoperative / postoperative 表示术前 / 术后，但前缀不能替代实际日期。"},
      {heading:"数量和方向",body:"uni- 常表示一，bi- 常表示二。unilateral 与 bilateral 可用于描述单侧和双侧，但编码时要确认服务记录是否真的有双侧操作。"}
    ],
    terminology:[{term:"subcutaneous",zh:"皮下的",note:"sub- + cutaneous"},{term:"intercostal",zh:"肋间的",note:"inter- + costal"},{term:"postoperative",zh:"术后的",note:"post- + operative"},{term:"bilateral",zh:"双侧的",note:"bi- + lateral"}],
    clinical:{heading:"Clinical note · Procedure detail",note:"Bilateral knee examination was performed. Injection was given to the left knee only.",task:"哪些服务明确为双侧？哪些是左侧？",takeaway:"膝关节检查是双侧，注射只发生在左膝。不能将 bilateral 自动套用于所有服务。"},
    questions:[
      {question:"subcutaneous 最贴近哪个含义？",options:["在骨内","皮下的","心脏外的","术前的"],answer:1,explanation:"sub- 表示下方，cutaneous 表示皮肤相关。"},
      {question:"Bilateral injection 与 unilateral injection 区别是什么？",options:["前者双侧、后者单侧","前者术前、后者术后","前者麻醉、后者影像","两者同义"],answer:0,explanation:"bi- 两个，uni- 一个；仍须根据实际服务记录判断。"}
    ]
  },
  {
    id:"med-4-rh",chapter:4,textbookSection:"A Closer Look",title:"Antigens, Antibodies and Rh",zh:"抗原、抗体与 Rh 因子",minutes:19,
    objectives:["理解 antigen / antibody 的基本区别","认识 Rh-positive 和 Rh-negative 的含义","了解医学术语与临床诊断之间的边界"],
    teaching:[
      {heading:"Antigen 与 Antibody",body:"Antigen 是可被免疫系统识别的抗原；antibody 是免疫细胞产生、能够特异性识别某些抗原的免疫球蛋白。两者并不是同一种物质。"},
      {heading:"Rh factor",body:"日常所说的 Rh-positive / Rh-negative 主要指是否有 Rh(D) 抗原。Rh 状态在输血和妊娠相关场景中具有临床意义。"},
      {heading:"Rh incompatibility",body:"当存在 Rh(D) 不相容风险时，医护人员可能进行进一步筛查和预防。编码员只依据已记录的诊断、检查和服务报告，不自行判断免疫反应已发生。"}
    ],
    terminology:[{term:"antigen",zh:"抗原",note:"免疫系统识别的物质"},{term:"antibody",zh:"抗体",note:"参与识别抗原的免疫球蛋白"},{term:"Rh-positive",zh:"Rh阳性",note:"通常表示有 D 抗原"},{term:"Rh-negative",zh:"Rh阴性",note:"通常表示缺少 D 抗原"}],
    clinical:{heading:"Clinical note · Lab interpretation",note:"Prenatal record: maternal blood type O, Rh-negative. Additional testing was ordered.",task:"该句是否足以证明患者已患溶血性疾病？",takeaway:"不能。Rh-negative 是血型资料，需要根据进一步记录和医生诊断判断相关临床情况。"},
    questions:[
      {question:"Rh-positive 通常表示什么？",options:["缺少所有抗原","存在 Rh(D) 抗原","一定患有免疫病","已经发生输血反应"],answer:1,explanation:"Rh-positive 通常指红细胞具有 D 抗原。"},
      {question:"只记录 Rh-negative，编码员可以直接推断溶血性疾病吗？",options:["可以","不可以，不能自行确诊","必须选择 CPT 代码","只要怀孕就可以"],answer:1,explanation:"血型信息不是确诊某一疾病的充分依据。"}
    ]
  },
  {
    id:"med-5-anatomy",chapter:5,textbookSection:"Anatomy and Physiology",title:"Digestive Tract Anatomy",zh:"消化道解剖与基本功能",minutes:20,
    objectives:["描述食物经过消化道的大致路径","区分消化道与辅助器官","识别胃、小肠、大肠各自的作用"],
    teaching:[
      {heading:"消化道路径",body:"食物经口腔、咽、食管进入胃，再经过小肠、大肠，最终排出体外。不同部位的肌肉运动、分泌活动与吸收作用不同。"},
      {heading:"主要消化器官",body:"胃参与食物混合和早期消化；小肠是营养物质消化吸收的重要位置；大肠参与水分回收和粪便形成。"},
      {heading:"辅助器官",body:"肝脏、胆囊和胰腺通过胆汁或消化酶等参与消化，但食物并不会依次直接穿过这些辅助器官。"}
    ],diagram:"digestive",
    terminology:[{term:"esophagus",zh:"食管",note:"连接咽与胃"},{term:"stomach",zh:"胃",note:"参与混合与消化"},{term:"duodenum",zh:"十二指肠",note:"小肠第一段"},{term:"colon",zh:"结肠",note:"大肠主要部分"}],
    clinical:{heading:"Clinical note · Localization",note:"Upper endoscopy documented findings in the stomach and duodenum.",task:"找出检查涉及的两个解剖部位，并说明 endoscopy 与诊断的区别。",takeaway:"检查涉及胃和十二指肠；内镜是操作，检查发现与最终诊断需要另行核对。"},
    questions:[
      {question:"食物由胃继续进入哪个结构？",options:["结肠","十二指肠","胆囊","肝脏"],answer:1,explanation:"十二指肠是小肠第一段，与胃相连。"},
      {question:"哪一个属于辅助消化器官，而不是食物直接通过的消化道？",options:["食管","空肠","胰腺","结肠"],answer:2,explanation:"胰腺通过分泌消化液参与消化，食物不直接流经胰腺。"}
    ]
  },
  {
    id:"med-5-pathology",chapter:5,textbookSection:"Pathology of the Digestive System",title:"Symptoms, Conditions and Crohn's Disease",zh:"消化系统病理与 Crohn 病例导入",minutes:20,
    objectives:["区分腹痛等症状与疾病诊断","初步了解 Crohn's disease","认识病历中的观察、评估和治疗计划"],
    teaching:[
      {heading:"Symptom 与 Diagnosis",body:"Abdominal pain、nausea、vomiting 等是症状词；Crohn's disease 是疾病名称。症状可能出现于多种疾病，不能仅由症状直接判定诊断。"},
      {heading:"Crohn's disease",body:"Crohn's disease 属于 inflammatory bowel disease（炎症性肠病），可影响消化道不同部位，症状和临床过程存在个体差异。"},
      {heading:"病历阅读",body:"识别 Chief Complaint、History、Assessment、Plan 的位置。病例中应分开记录患者描述、检查发现、医生明确诊断以及已经实施的操作。"}
    ],
    terminology:[{term:"abdominal pain",zh:"腹痛",note:"症状"},{term:"inflammation",zh:"炎症",note:"病理过程"},{term:"Crohn's disease",zh:"克罗恩病",note:"炎症性肠病的一种"},{term:"colonoscopy",zh:"结肠镜检查",note:"临床检查/操作"}],
    clinical:{heading:"Fictional clinical note",note:"Chief complaint: intermittent abdominal pain. Assessment: Crohn's disease previously diagnosed; treatment plan reviewed. No endoscopy was performed at this visit.",task:"在这个就诊记录中，疾病、症状和未实施操作分别是什么？",takeaway:"记录中的疾病为既往明确诊断的 Crohn's disease，症状是腹痛；这次没有做内镜，不能报告未实施的操作。"},
    questions:[
      {question:"Crohn's disease 属于哪种基本疾病类别？",options:["炎症性肠病","细菌性肺炎","心律失常","骨折"],answer:0,explanation:"Crohn's disease 是炎症性肠病。"},
      {question:"本次就诊写 No endoscopy was performed，说明什么？",options:["应报告内镜操作","本次未进行内镜操作","已确诊结肠癌","无法判断是否有腹痛"],answer:1,explanation:"否定的操作记录不能当作已执行的服务。"}
    ]
  },
  ...moreMedicalLessons57,
  ...moreMedicalLessons79,
  ...medicalLessons1012,
  ...medicalLessons1314
];

export const lessonsForChapter = (chapter:number) =>
  medicalLessons.filter(lesson=>lesson.chapter===chapter);

export const chapterLessonCounts = Object.fromEntries(
  [...new Set(medicalLessons.map(lesson=>lesson.chapter))].map(chapter=>
    [chapter,lessonsForChapter(chapter).length]
  )
) as Record<number,number>;
