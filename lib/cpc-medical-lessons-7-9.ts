import type { MedicalLesson } from "./cpc-medical-lessons";
/** Independently authored supplemental curriculum for Chapters 7–9. */
export const moreMedicalLessons79: MedicalLesson[] = [
  {
    "id": "med-7-urinary-procedures",
    "chapter": 7,
    "textbookSection": "Laboratory Tests and Clinical Procedures",
    "title": "Urinary Clinical Procedures",
    "zh": "泌尿系统影像、膀胱镜与碎石术",
    "minutes": 21,
    "objectives": [
      "辨认膀胱镜与尿液分析的差异",
      "认识输尿管支架和碎石术",
      "读取部位与侧别"
    ],
    "teaching": [
      {
        "heading": "检查与操作",
        "body": "Urinalysis 属于化验；cystoscopy 是膀胱镜检查。CT 和 ultrasound 则属于不同的影像检查。"
      },
      {
        "heading": "干预操作",
        "body": "Ureteral stent 放置与 lithotripsy（碎石）是不同的程序，必须核对实际实施了什么。"
      },
      {
        "heading": "编码关联",
        "body": "核对适用 CPT 专科章节、手术部位、入路、侧别及相关指示；不能凭“泌尿操作”笼统选码。"
      }
    ],
    "terminology": [
      {
        "term": "cystoscopy",
        "zh": "膀胱镜检查",
        "note": "内镜检查"
      },
      {
        "term": "lithotripsy",
        "zh": "碎石术",
        "note": "结石处理"
      },
      {
        "term": "ureteral stent",
        "zh": "输尿管支架",
        "note": "引流通路"
      },
      {
        "term": "renal ultrasound",
        "zh": "肾脏超声",
        "note": "影像检查"
      }
    ],
    "clinical": {
      "heading": "Procedure record",
      "note": "Right ureteral stent was placed under cystoscopic guidance. No lithotripsy performed.",
      "task": "找出操作及明确未实施的干预。",
      "takeaway": "右输尿管支架置入已经实施；碎石术未实施。"
    },
    "questions": [
      {
        "question": "Cystoscopy 是什么？",
        "options": [
          "肾脏切除",
          "膀胱镜检查",
          "尿液分析",
          "血液透析"
        ],
        "answer": 1,
        "explanation": "Cystoscopy 为膀胱镜。"
      },
      {
        "question": "no lithotripsy performed 意味着？",
        "options": [
          "已经碎石",
          "没有碎石",
          "已确认结石性质",
          "确认使用某个代码"
        ],
        "answer": 1,
        "explanation": "不能报告明确未实施的碎石术。"
      }
    ]
  },
  {
    "id": "med-7-kidney-transplant",
    "chapter": 7,
    "textbookSection": "Laboratory Tests and Clinical Procedures",
    "title": "Kidney Transplant Documentation",
    "zh": "肾移植、供者与排斥反应病例",
    "minutes": 21,
    "objectives": [
      "区分 donor 与 recipient",
      "认识 transplant status",
      "不从移植病史推断排斥反应"
    ],
    "teaching": [
      {
        "heading": "移植基本概念",
        "body": "Donor 是器官供者，recipient 是移植受者。Kidney transplant 可改善特定患者的肾脏功能，但术后仍需持续监测。"
      },
      {
        "heading": "移植状态与并发症",
        "body": "Transplant status 表示移植后的状态；rejection 是免疫相关移植并发症。二者不能互相推断。"
      },
      {
        "heading": "病例编码",
        "body": "移植手术、移植状态、并发症和随访可涉及不同报告任务，具体取决于当次服务及完整医生记录。"
      }
    ],
    "terminology": [
      {
        "term": "transplant",
        "zh": "移植",
        "note": "移植器官"
      },
      {
        "term": "donor",
        "zh": "供者",
        "note": "捐献器官"
      },
      {
        "term": "recipient",
        "zh": "受者",
        "note": "接受移植"
      },
      {
        "term": "rejection",
        "zh": "排斥反应",
        "note": "移植相关免疫反应"
      }
    ],
    "clinical": {
      "heading": "Transplant follow-up",
      "note": "Follow-up after kidney transplant. Graft function is stable, and no rejection was documented.",
      "task": "能否编码为移植排斥？",
      "takeaway": "不能。记录未指出排斥反应。"
    },
    "questions": [
      {
        "question": "Recipient 是什么？",
        "options": [
          "器官供者",
          "移植受者",
          "器官本身",
          "移植设备"
        ],
        "answer": 1,
        "explanation": "Recipient 指接受移植器官的患者。"
      },
      {
        "question": "移植病史是否直接证明发生排斥反应？",
        "options": [
          "是",
          "不是",
          "仅移植肾脏时是",
          "只有患者发热时是"
        ],
        "answer": 1,
        "explanation": "需要医生明确评估和记录。"
      }
    ]
  },
  {
    "id": "med-8-female-anatomy",
    "chapter": 8,
    "textbookSection": "Organs of the Female Reproductive System",
    "title": "Female Reproductive Anatomy",
    "zh": "卵巢、输卵管、子宫与宫颈",
    "minutes": 21,
    "objectives": [
      "识别主要女性生殖器官",
      "理解输卵管与受精位置",
      "区分子宫壁和子宫内膜"
    ],
    "teaching": [
      {
        "heading": "主要器官",
        "body": "Ovary（卵巢）产生卵细胞及部分性激素，fallopian tube（输卵管）连接卵巢附近区域与子宫。"
      },
      {
        "heading": "子宫结构",
        "body": "Uterus（子宫）由不同组织层构成，endometrium 是子宫内膜，myometrium 是子宫肌层，cervix 是子宫颈。"
      },
      {
        "heading": "CPC 关联",
        "body": "妇科手术需要关注切除的器官、范围、子宫颈是否保留，以及具体手术方式。"
      }
    ],
    "terminology": [
      {
        "term": "ovary",
        "zh": "卵巢",
        "note": "卵子形成相关"
      },
      {
        "term": "fallopian tube",
        "zh": "输卵管",
        "note": "生殖通路"
      },
      {
        "term": "endometrium",
        "zh": "子宫内膜",
        "note": "子宫内层"
      },
      {
        "term": "cervix",
        "zh": "宫颈",
        "note": "子宫下端"
      }
    ],
    "clinical": {
      "heading": "Anatomical site",
      "note": "Ultrasound identified a lesion within the left ovary. Follow-up examination planned.",
      "task": "病变部位和侧别是什么？可以自动确诊卵巢癌吗？",
      "takeaway": "左卵巢，不能仅据占位描述推断恶性。"
    },
    "questions": [
      {
        "question": "Endometrium 是什么？",
        "options": [
          "子宫内膜",
          "子宫肌层",
          "卵巢",
          "阴道"
        ],
        "answer": 0,
        "explanation": "Endometrium 是子宫内膜。"
      },
      {
        "question": "宫颈的英文是？",
        "options": [
          "Cervix",
          "Ovary",
          "Vulva",
          "Placenta"
        ],
        "answer": 0,
        "explanation": "Cervix 是宫颈。"
      }
    ]
  },
  {
    "id": "med-8-female-cycle",
    "chapter": 8,
    "textbookSection": "Menstruation and Pregnancy",
    "title": "Menstrual Cycle and Pregnancy",
    "zh": "月经周期、受精和妊娠术语",
    "minutes": 21,
    "objectives": [
      "理解排卵与月经周期关系",
      "认识受精和植入",
      "区分孕周与孕期阶段"
    ],
    "teaching": [
      {
        "heading": "卵巢周期",
        "body": "Ovulation 是排卵，estrogen 和 progesterone 参与月经周期调节。周期长短可有差异，不能把某天固定视为每人的排卵日。"
      },
      {
        "heading": "妊娠基础",
        "body": "Fertilization 是受精，implantation 是着床，gestation 指妊娠过程。"
      },
      {
        "heading": "产科编码细节",
        "body": "Pregnancy trimester、gestational weeks、delivery status 等是不同记录要素，实际编码必须参考产科专项指南。"
      }
    ],
    "terminology": [
      {
        "term": "ovulation",
        "zh": "排卵",
        "note": "释放卵细胞"
      },
      {
        "term": "fertilization",
        "zh": "受精",
        "note": "配子结合"
      },
      {
        "term": "implantation",
        "zh": "着床",
        "note": "胚胎植入"
      },
      {
        "term": "gestation",
        "zh": "妊娠",
        "note": "妊娠过程"
      }
    ],
    "clinical": {
      "heading": "Prenatal visit",
      "note": "Prenatal note: 24 weeks gestation. No delivery occurred during this encounter.",
      "task": "指出具体妊娠周数及是否发生分娩。",
      "takeaway": "记录明确妊娠24周，本次没有分娩。"
    },
    "questions": [
      {
        "question": "Ovulation 是？",
        "options": [
          "排卵",
          "分娩",
          "绝经",
          "受精"
        ],
        "answer": 0,
        "explanation": "Ovulation 表示排卵。"
      },
      {
        "question": "24 weeks gestation 是什么？",
        "options": [
          "手术方式",
          "妊娠周数",
          "新生儿体重",
          "妊娠次数"
        ],
        "answer": 1,
        "explanation": "这是记录的孕周。"
      }
    ]
  },
  {
    "id": "med-8-female-diseases",
    "chapter": 8,
    "textbookSection": "Pathology: Gynecologic, Breast, Pregnancy, and Neonatal",
    "title": "Gynecologic and Breast Conditions",
    "zh": "妇科、乳腺及妊娠相关病理",
    "minutes": 21,
    "objectives": [
      "区分子宫肌瘤与恶性病变",
      "理解乳腺肿块属于发现",
      "识别妊娠相关记录"
    ],
    "teaching": [
      {
        "heading": "常见妇科术语",
        "body": "Leiomyoma 通常指平滑肌瘤，在子宫可称子宫肌瘤；endometriosis 指子宫内膜样组织位于子宫腔外的疾病。"
      },
      {
        "heading": "乳腺相关",
        "body": "Breast mass 是乳腺肿块或占位描述；仅有肿块并不等于已确诊乳腺癌。"
      },
      {
        "heading": "妊娠和产科",
        "body": "产科诊断需考虑孕期阶段、胎儿、分娩等信息，不能按一般疾病代码逻辑直接套用。"
      }
    ],
    "terminology": [
      {
        "term": "leiomyoma",
        "zh": "平滑肌瘤",
        "note": "通常为良性肿瘤"
      },
      {
        "term": "endometriosis",
        "zh": "子宫内膜异位症",
        "note": "组织部位异常"
      },
      {
        "term": "breast mass",
        "zh": "乳腺肿块",
        "note": "临床发现"
      },
      {
        "term": "preeclampsia",
        "zh": "子痫前期",
        "note": "妊娠相关病症"
      }
    ],
    "clinical": {
      "heading": "Breast imaging",
      "note": "Mammogram noted an indeterminate breast mass. Biopsy was scheduled.",
      "task": "是否已确诊恶性肿瘤并实施活检？",
      "takeaway": "尚无恶性确诊，活检只是预约。"
    },
    "questions": [
      {
        "question": "Leiomyoma 常指？",
        "options": [
          "平滑肌瘤",
          "膀胱炎",
          "骨折",
          "贫血"
        ],
        "answer": 0,
        "explanation": "Leiomyoma 为平滑肌瘤。"
      },
      {
        "question": "Indeterminate breast mass 能否直接确定为乳腺癌？",
        "options": [
          "能",
          "不能",
          "只有左侧可以",
          "只有活检预约时可以"
        ],
        "answer": 1,
        "explanation": "不确定肿块不是恶性肿瘤的确诊。"
      }
    ]
  },
  {
    "id": "med-8-female-procedures",
    "chapter": 8,
    "textbookSection": "Clinical Tests and Procedures",
    "title": "Gynecologic Tests and Procedures",
    "zh": "妇科检查、宫颈筛查与手术",
    "minutes": 21,
    "objectives": [
      "认识宫颈筛查与病理活检",
      "区分子宫切除和其他妇科手术",
      "理解操作记录的组织范围"
    ],
    "teaching": [
      {
        "heading": "筛查与诊断",
        "body": "Pap test 是宫颈细胞学筛查相关检查；colposcopy 为阴道镜检查。它们的目的和执行方式不同。"
      },
      {
        "heading": "手术概念",
        "body": "Hysterectomy 指子宫切除术；oophorectomy 指卵巢切除术，必须核对实际切除范围和侧别。"
      },
      {
        "heading": "记录重点",
        "body": "任何手术项目都需要核查操作范围、组织标本、实际实施的方法以及是否进行独立干预。"
      }
    ],
    "terminology": [
      {
        "term": "Pap test",
        "zh": "宫颈细胞学筛查",
        "note": "筛查"
      },
      {
        "term": "colposcopy",
        "zh": "阴道镜检查",
        "note": "观察宫颈等部位"
      },
      {
        "term": "hysterectomy",
        "zh": "子宫切除术",
        "note": "子宫操作"
      },
      {
        "term": "oophorectomy",
        "zh": "卵巢切除术",
        "note": "卵巢操作"
      }
    ],
    "clinical": {
      "heading": "Gynecologic surgery",
      "note": "Operative record documents total hysterectomy. Both ovaries were preserved.",
      "task": "子宫及卵巢是否都被切除？",
      "takeaway": "子宫已切除，双侧卵巢保留。"
    },
    "questions": [
      {
        "question": "Oophorectomy 指？",
        "options": [
          "卵巢切除",
          "子宫切除",
          "宫颈检查",
          "乳腺切除"
        ],
        "answer": 0,
        "explanation": "Oophorectomy 是卵巢切除术。"
      },
      {
        "question": "Both ovaries preserved 是否代表双侧卵巢切除？",
        "options": [
          "代表",
          "不代表",
          "必须加手术修饰符",
          "一定合并盆腔手术"
        ],
        "answer": 1,
        "explanation": "保留卵巢意味着未切除卵巢。"
      }
    ]
  },
  {
    "id": "med-8-mastectomy",
    "chapter": 8,
    "textbookSection": "Clinical Tests and Procedures",
    "title": "Prophylactic Mastectomy Case",
    "zh": "预防性乳房切除：临床和编码区别",
    "minutes": 21,
    "objectives": [
      "理解 prophylactic 的含义",
      "区分预防手术与治疗肿瘤",
      "识别乳房切除的实际侧别"
    ],
    "teaching": [
      {
        "heading": "预防性手术",
        "body": "Prophylactic 表示预防性的。风险评估后进行预防性乳房切除与治疗已经确诊乳腺癌不同。"
      },
      {
        "heading": "记录要素",
        "body": "Mastectomy 的实际范围、单侧或双侧、重建是否同期实施等信息均需要查阅完整手术记录。"
      },
      {
        "heading": "正确编码",
        "body": "诊断、风险因素、手术操作、重建服务等要根据相关文件分别审核，不能因为做了乳房切除就假定恶性肿瘤已确诊。"
      }
    ],
    "terminology": [
      {
        "term": "prophylactic",
        "zh": "预防性的",
        "note": "为降低风险"
      },
      {
        "term": "mastectomy",
        "zh": "乳房切除术",
        "note": "手术操作"
      },
      {
        "term": "reconstruction",
        "zh": "重建",
        "note": "可能是另一个服务"
      },
      {
        "term": "bilateral",
        "zh": "双侧",
        "note": "左右两侧"
      }
    ],
    "clinical": {
      "heading": "Fictional prophylactic surgery",
      "note": "Patient with hereditary risk underwent bilateral prophylactic mastectomy. No malignancy was documented.",
      "task": "此处是否存在已记录的乳腺癌诊断？",
      "takeaway": "手术为预防性双侧乳房切除，不能推断患者已经确诊乳腺癌。"
    },
    "questions": [
      {
        "question": "Prophylactic 表示？",
        "options": [
          "恶性的",
          "预防性的",
          "急诊的",
          "复发的"
        ],
        "answer": 1,
        "explanation": "Prophylactic 表示预防。"
      },
      {
        "question": "进行预防性乳房切除是否必然确诊乳腺癌？",
        "options": [
          "是",
          "否",
          "只有双侧时是",
          "只有重建时是"
        ],
        "answer": 1,
        "explanation": "预防手术不意味着恶性肿瘤确诊。"
      }
    ]
  },
  {
    "id": "med-9-male-anatomy",
    "chapter": 9,
    "textbookSection": "Anatomy",
    "title": "Male Reproductive Anatomy",
    "zh": "睾丸、附睾、输精管和前列腺",
    "minutes": 21,
    "objectives": [
      "定位睾丸和附睾",
      "认识输精管与前列腺",
      "区分生殖通路和尿路"
    ],
    "teaching": [
      {
        "heading": "主要结构",
        "body": "Testis（睾丸）产生精子及睾酮；epididymis（附睾）参与精子成熟；vas deferens（输精管）负责运输精子。"
      },
      {
        "heading": "前列腺",
        "body": "Prostate 位于膀胱下方并围绕部分尿道，参与产生精液成分。前列腺并不是精子的产生部位。"
      },
      {
        "heading": "病历定位",
        "body": "Male reproductive 记录会涉及生殖器官与泌尿结构，操作时须准确识别受累器官和通路。"
      }
    ],
    "terminology": [
      {
        "term": "testis",
        "zh": "睾丸",
        "note": "产生精子"
      },
      {
        "term": "epididymis",
        "zh": "附睾",
        "note": "精子成熟"
      },
      {
        "term": "vas deferens",
        "zh": "输精管",
        "note": "运输精子"
      },
      {
        "term": "prostate",
        "zh": "前列腺",
        "note": "位于膀胱下方"
      }
    ],
    "clinical": {
      "heading": "Anatomy report",
      "note": "Imaging reports enlargement of the prostate gland; no biopsy performed.",
      "task": "发生了影像检查，是否完成了活检？",
      "takeaway": "影像报告描述前列腺增大，没有活检。"
    },
    "questions": [
      {
        "question": "Sperm 在哪个器官产生？",
        "options": [
          "前列腺",
          "睾丸",
          "输精管",
          "膀胱"
        ],
        "answer": 1,
        "explanation": "精子在睾丸生成。"
      },
      {
        "question": "Vas deferens 是？",
        "options": [
          "输精管",
          "尿道",
          "输尿管",
          "附睾"
        ],
        "answer": 0,
        "explanation": "Vas deferens 是输精管。"
      }
    ]
  },
  {
    "id": "med-9-sperm-hormones",
    "chapter": 9,
    "textbookSection": "Anatomy",
    "title": "Sperm Formation and Testosterone",
    "zh": "精子形成、运输和睾酮",
    "minutes": 21,
    "objectives": [
      "了解精子形成的基本流程",
      "理解睾酮由睾丸产生",
      "认识影响精子运输的手术"
    ],
    "teaching": [
      {
        "heading": "Spermatogenesis",
        "body": "精子发生主要发生在睾丸曲细精管，产生后的精子在附睾中继续成熟。"
      },
      {
        "heading": "运输通路",
        "body": "精子从附睾经输精管等通路排出，相关结构与前列腺和精囊分泌的液体形成精液。"
      },
      {
        "heading": "Testosterone",
        "body": "睾酮参与男性第二性征、性功能及其他生理调节，激素异常不能仅凭症状自行判断。"
      }
    ],
    "terminology": [
      {
        "term": "spermatogenesis",
        "zh": "精子发生",
        "note": "精子形成"
      },
      {
        "term": "seminiferous tubules",
        "zh": "曲细精管",
        "note": "精子发生位置"
      },
      {
        "term": "testosterone",
        "zh": "睾酮",
        "note": "雄激素"
      },
      {
        "term": "seminal vesicle",
        "zh": "精囊",
        "note": "分泌精液成分"
      }
    ],
    "clinical": {
      "heading": "Hormone test",
      "note": "A patient requested evaluation for fatigue. Testosterone testing was ordered; no hormonal disorder was diagnosed.",
      "task": "是否可以直接报告睾酮缺乏诊断？",
      "takeaway": "不能；只是安排检测，医生尚未确立诊断。"
    },
    "questions": [
      {
        "question": "精子形成主要发生在？",
        "options": [
          "曲细精管",
          "膀胱",
          "前列腺",
          "输尿管"
        ],
        "answer": 0,
        "explanation": "曲细精管是精子发生的重要场所。"
      },
      {
        "question": "Testosterone 属于？",
        "options": [
          "消化酶",
          "雄激素",
          "血小板",
          "胆汁"
        ],
        "answer": 1,
        "explanation": "Testosterone 是睾酮。"
      }
    ]
  },
  {
    "id": "med-9-male-pathology",
    "chapter": 9,
    "textbookSection": "Pathologic Conditions; Sexually Transmitted Infections",
    "title": "Prostate and Male Reproductive Conditions",
    "zh": "前列腺疾病与男性生殖系统病理",
    "minutes": 21,
    "objectives": [
      "区分前列腺增生、炎症和恶性肿瘤",
      "认识常见感染术语",
      "理解筛查与诊断区别"
    ],
    "teaching": [
      {
        "heading": "不同的前列腺疾病",
        "body": "Benign prostatic hyperplasia (BPH) 是良性前列腺增生；prostatitis 是前列腺炎；prostate cancer 是前列腺恶性肿瘤。"
      },
      {
        "heading": "筛查与评估",
        "body": "PSA 检验可能用于前列腺相关评估，但 PSA 数值异常不是编码员自行确诊前列腺癌的依据。"
      },
      {
        "heading": "感染记录",
        "body": "Urethritis 等感染或炎症术语需要区分病因、确诊程度以及是否记录具体病原体。"
      }
    ],
    "terminology": [
      {
        "term": "BPH",
        "zh": "良性前列腺增生",
        "note": "非恶性"
      },
      {
        "term": "prostatitis",
        "zh": "前列腺炎",
        "note": "炎症"
      },
      {
        "term": "PSA",
        "zh": "前列腺特异性抗原",
        "note": "血液检测相关"
      },
      {
        "term": "urethritis",
        "zh": "尿道炎",
        "note": "尿道炎症"
      }
    ],
    "clinical": {
      "heading": "Elevated PSA",
      "note": "PSA level was elevated. Prostate biopsy was recommended; malignancy not confirmed.",
      "task": "能将这段记录编码为确诊前列腺癌吗？",
      "takeaway": "不能。检验结果与建议活检不等于恶性肿瘤确诊。"
    },
    "questions": [
      {
        "question": "BPH 是？",
        "options": [
          "良性前列腺增生",
          "前列腺恶性肿瘤",
          "尿道切除",
          "肾移植"
        ],
        "answer": 0,
        "explanation": "BPH 即 benign prostatic hyperplasia。"
      },
      {
        "question": "PSA 升高是否必然证明前列腺癌？",
        "options": [
          "是",
          "否",
          "只有同时尿频时是",
          "活检预约即是"
        ],
        "answer": 1,
        "explanation": "PSA 不是特异性癌症确诊依据。"
      }
    ]
  },
  {
    "id": "med-9-male-procedures",
    "chapter": 9,
    "textbookSection": "Laboratory Tests and Clinical Procedures",
    "title": "Vasectomy and Prostate Procedures",
    "zh": "输精管结扎与前列腺检查和操作",
    "minutes": 21,
    "objectives": [
      "认识 vasectomy",
      "区分活检与筛查",
      "学会定位手术记录中的实际程序"
    ],
    "teaching": [
      {
        "heading": "Vasectomy",
        "body": "Vasectomy 为输精管切断或阻断相关绝育手术，操作对象是 vas deferens，不是睾丸。"
      },
      {
        "heading": "前列腺相关程序",
        "body": "Prostate biopsy 与前列腺影像、血液检测属于不同服务，必须通过实际操作记录核实。"
      },
      {
        "heading": "编码准则",
        "body": "同一次诊疗中若有多种检查或操作，不能仅凭流程名称就判断是否应分别报告，需查当年度 CPT 及相关规则。"
      }
    ],
    "terminology": [
      {
        "term": "vasectomy",
        "zh": "输精管结扎术",
        "note": "绝育相关"
      },
      {
        "term": "prostate biopsy",
        "zh": "前列腺活检",
        "note": "取得组织"
      },
      {
        "term": "transrectal",
        "zh": "经直肠的",
        "note": "操作入路"
      },
      {
        "term": "semen analysis",
        "zh": "精液分析",
        "note": "实验室检测"
      }
    ],
    "clinical": {
      "heading": "Elective procedure",
      "note": "Operative report: bilateral vasectomy completed. No orchiectomy was performed.",
      "task": "发生的是输精管操作还是睾丸切除？",
      "takeaway": "已完成双侧输精管结扎，没有睾丸切除。"
    },
    "questions": [
      {
        "question": "Vasectomy 的主要对象是？",
        "options": [
          "输精管",
          "睾丸",
          "前列腺",
          "膀胱"
        ],
        "answer": 0,
        "explanation": "Vasectomy 操作输精管。"
      },
      {
        "question": "No orchiectomy performed 表示？",
        "options": [
          "睾丸切除完成",
          "没有睾丸切除",
          "已经确诊睾丸癌",
          "操作与侧别无关"
        ],
        "answer": 1,
        "explanation": "未实施的切除不能作为已完成操作。"
      }
    ]
  },
  {
    "id": "med-9-prostate-cancer-case",
    "chapter": 9,
    "textbookSection": "Laboratory Tests and Clinical Procedures",
    "title": "Prostate Cancer Clinical Documentation",
    "zh": "前列腺癌的诊断和治疗记录",
    "minutes": 21,
    "objectives": [
      "区分 PSA、活检和病理诊断",
      "认识分级与分期信息",
      "提取实际治疗方式"
    ],
    "teaching": [
      {
        "heading": "诊断证据",
        "body": "医生的确诊记录、病理报告和检查结果各有作用。不能仅凭 PSA、症状或影像怀疑就自动指定前列腺癌诊断。"
      },
      {
        "heading": "临床分级分期",
        "body": "病理 Gleason grade group 等信息和临床分期可能在治疗决策中具有意义，编码前应核对具体记录和代码规则。"
      },
      {
        "heading": "不同治疗",
        "body": "Radical prostatectomy、radiotherapy、active surveillance 代表不同管理策略，计划中的治疗不等于已实施服务。"
      }
    ],
    "terminology": [
      {
        "term": "prostate cancer",
        "zh": "前列腺癌",
        "note": "恶性肿瘤诊断"
      },
      {
        "term": "Gleason score",
        "zh": "格里森评分",
        "note": "前列腺癌病理分级相关"
      },
      {
        "term": "prostatectomy",
        "zh": "前列腺切除术",
        "note": "手术"
      },
      {
        "term": "radiotherapy",
        "zh": "放射治疗",
        "note": "治疗方式"
      }
    ],
    "clinical": {
      "heading": "Oncology consultation",
      "note": "Biopsy confirmed prostate adenocarcinoma. The physician discussed surgery and radiotherapy, but neither treatment was performed at this visit.",
      "task": "识别已确认的诊断与尚未完成的治疗。",
      "takeaway": "活检确认前列腺腺癌；手术和放疗仅在讨论中，本次均未实施。"
    },
    "questions": [
      {
        "question": "Prostatectomy 是什么？",
        "options": [
          "前列腺切除术",
          "前列腺筛查",
          "前列腺超声",
          "膀胱镜"
        ],
        "answer": 0,
        "explanation": "Prostatectomy 指前列腺切除术。"
      },
      {
        "question": "Treatment discussed 与 treatment performed 区别？",
        "options": [
          "没有区别",
          "讨论不代表完成服务",
          "讨论即代表完成",
          "只在手术场景才有区别"
        ],
        "answer": 1,
        "explanation": "不能把讨论或计划误认为已经实施。"
      }
    ]
  }
];
