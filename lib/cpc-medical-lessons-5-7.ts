import type { MedicalLesson } from "./cpc-medical-lessons";
/** Independently authored supplemental curriculum for Chapters 5–7. */
export const moreMedicalLessons57: MedicalLesson[] = [
  {
    "id": "med-5-oral",
    "chapter": 5,
    "textbookSection": "Anatomy and Physiology",
    "title": "Oral Cavity and Esophagus",
    "zh": "口腔、咽与食管",
    "minutes": 19,
    "objectives": [
      "解释食团经过口腔和咽的过程",
      "理解食管的运输作用",
      "区分吞咽困难和疾病诊断"
    ],
    "teaching": [
      {
        "heading": "从口腔开始",
        "body": "牙齿完成机械性咀嚼，舌辅助搅拌食物和吞咽；唾液润湿食团并开始部分化学消化。"
      },
      {
        "heading": "咽与食管",
        "body": "吞咽时食团经过咽进入食管，蠕动帮助其移动至胃。食管不是营养吸收的主要场所。"
      },
      {
        "heading": "临床关联",
        "body": "Dysphagia 指吞咽困难，可作为症状记录。专科转诊和吞咽症状本身都不能自动证明某种确诊疾病。"
      }
    ],
    "terminology": [
      {
        "term": "oral cavity",
        "zh": "口腔",
        "note": "消化道入口"
      },
      {
        "term": "pharynx",
        "zh": "咽",
        "note": "参与吞咽"
      },
      {
        "term": "esophagus",
        "zh": "食管",
        "note": "运输食团"
      },
      {
        "term": "dysphagia",
        "zh": "吞咽困难",
        "note": "临床症状"
      }
    ],
    "clinical": {
      "heading": "Swallowing record",
      "note": "Chief complaint: difficulty swallowing solids. Upper endoscopy was recommended but not performed.",
      "task": "识别症状以及实际未完成的检查。",
      "takeaway": "记录为吞咽困难；内镜仅被建议，并没有完成。"
    },
    "questions": [
      {
        "question": "食团离开咽后进入什么结构？",
        "options": [
          "气管",
          "食管",
          "大肠",
          "胆囊"
        ],
        "answer": 1,
        "explanation": "正常吞咽后食团进入食管。"
      },
      {
        "question": "Recommended endoscopy 表示什么？",
        "options": [
          "已经完成",
          "计划或建议，未证明完成",
          "已确诊癌症",
          "进行了活检"
        ],
        "answer": 1,
        "explanation": "建议进行的检查不能当作已经实施。"
      }
    ]
  },
  {
    "id": "med-5-stomach",
    "chapter": 5,
    "textbookSection": "Anatomy and Physiology",
    "title": "Stomach and Small Intestine",
    "zh": "胃与小肠的结构和消化吸收",
    "minutes": 19,
    "objectives": [
      "定位胃底与幽门",
      "掌握十二指肠、空肠和回肠",
      "区分消化和吸收"
    ],
    "teaching": [
      {
        "heading": "胃",
        "body": "胃包括 fundus（胃底）、body（胃体）和幽门区等部分，承担储存、搅拌和部分化学消化的作用。"
      },
      {
        "heading": "小肠",
        "body": "小肠分 duodenum、jejunum、ileum，分别是十二指肠、空肠、回肠。小肠绒毛增大吸收表面积。"
      },
      {
        "heading": "病历记录",
        "body": "上消化道检查可能涉及食管、胃和十二指肠。是否进行活检或干预，必须核对操作原文。"
      }
    ],
    "diagram": "digestive",
    "terminology": [
      {
        "term": "fundus",
        "zh": "胃底",
        "note": "胃上部"
      },
      {
        "term": "pylorus",
        "zh": "幽门",
        "note": "胃出口区域"
      },
      {
        "term": "duodenum",
        "zh": "十二指肠",
        "note": "小肠第一段"
      },
      {
        "term": "jejunum",
        "zh": "空肠",
        "note": "小肠中段"
      }
    ],
    "clinical": {
      "heading": "Upper endoscopy",
      "note": "Upper endoscopy visualized the stomach and duodenum; no biopsy was taken.",
      "task": "哪些解剖结构已检查？是否取得组织标本？",
      "takeaway": "已检查胃和十二指肠；没有进行活检。"
    },
    "questions": [
      {
        "question": "小肠第一段是？",
        "options": [
          "空肠",
          "回肠",
          "十二指肠",
          "结肠"
        ],
        "answer": 2,
        "explanation": "十二指肠紧接胃。"
      },
      {
        "question": "no biopsy was taken 表示？",
        "options": [
          "完成活检",
          "未取活检组织",
          "已确认恶性",
          "未做任何检查"
        ],
        "answer": 1,
        "explanation": "内镜检查与活检是不同操作，应按实际记录分别判断。"
      }
    ]
  },
  {
    "id": "med-5-colon",
    "chapter": 5,
    "textbookSection": "Anatomy and Physiology",
    "title": "Colon and Accessory Digestive Organs",
    "zh": "大肠、肝脏、胆囊和胰腺",
    "minutes": 19,
    "objectives": [
      "认识结肠的主要分段",
      "理解肝脏与胆囊的关系",
      "区分消化道和辅助消化器官"
    ],
    "teaching": [
      {
        "heading": "结肠",
        "body": "结肠包含升结肠、横结肠、降结肠和乙状结肠；大肠参与水分回收和粪便形成。"
      },
      {
        "heading": "肝脏与胆囊",
        "body": "肝脏产生胆汁，胆囊储存和浓缩胆汁。胆汁进入小肠辅助脂肪消化，食物并不直接经过胆囊。"
      },
      {
        "heading": "胰腺",
        "body": "胰腺外分泌部分产生消化酶，内分泌部分产生调节血糖的激素。阅读手术记录时必须区分胰腺与胆道结构。"
      }
    ],
    "terminology": [
      {
        "term": "colon",
        "zh": "结肠",
        "note": "大肠主要部分"
      },
      {
        "term": "rectum",
        "zh": "直肠",
        "note": "消化道末端之一"
      },
      {
        "term": "gallbladder",
        "zh": "胆囊",
        "note": "储存胆汁"
      },
      {
        "term": "pancreas",
        "zh": "胰腺",
        "note": "内外分泌功能"
      }
    ],
    "clinical": {
      "heading": "Gallbladder finding",
      "note": "Ultrasound described stones within the gallbladder. No surgery was performed.",
      "task": "影像发现是否代表已经实施胆囊切除？",
      "takeaway": "影像发现胆结石，不代表手术已完成。"
    },
    "questions": [
      {
        "question": "胆汁主要由哪个器官产生？",
        "options": [
          "胰腺",
          "胆囊",
          "肝脏",
          "胃"
        ],
        "answer": 2,
        "explanation": "肝脏产生胆汁，胆囊储存胆汁。"
      },
      {
        "question": "以下哪个属于辅助消化器官？",
        "options": [
          "食管",
          "胃",
          "胆囊",
          "回肠"
        ],
        "answer": 2,
        "explanation": "胆囊通过储存胆汁参与消化，并非食物直接通行的管腔。"
      }
    ]
  },
  {
    "id": "med-5-gi-symptoms",
    "chapter": 5,
    "textbookSection": "Pathologic Conditions",
    "title": "Digestive Disease and Symptoms",
    "zh": "消化系统疾病、症状与临床判断",
    "minutes": 19,
    "objectives": [
      "区分消化道症状与疾病",
      "认识常见炎症和溃疡术语",
      "理解门诊不确定诊断"
    ],
    "teaching": [
      {
        "heading": "疾病与症状",
        "body": "Abdominal pain、nausea 和 vomiting 是症状。Gastritis、peptic ulcer 和 bowel obstruction 是具体疾病或病理状态，不能因为症状相似就互相替换。"
      },
      {
        "heading": "炎症性肠病",
        "body": "Crohn's disease 与 ulcerative colitis 都属于 inflammatory bowel disease，但疾病分布和病理过程不同。"
      },
      {
        "heading": "编码依据",
        "body": "门诊记录写 rule out obstruction 表示尚待排除，不应当作明确确诊。必须结合医师评估和当年度门诊编码指南。"
      }
    ],
    "terminology": [
      {
        "term": "gastritis",
        "zh": "胃炎",
        "note": "胃部炎症"
      },
      {
        "term": "peptic ulcer",
        "zh": "消化性溃疡",
        "note": "胃及十二指肠等部位"
      },
      {
        "term": "obstruction",
        "zh": "梗阻",
        "note": "通路受阻"
      },
      {
        "term": "ulcerative colitis",
        "zh": "溃疡性结肠炎",
        "note": "炎症性肠病"
      }
    ],
    "clinical": {
      "heading": "Diagnostic uncertainty",
      "note": "ED record: nausea, abdominal pain, rule out bowel obstruction. CT ordered; assessment pending.",
      "task": "病历已经确诊肠梗阻吗？",
      "takeaway": "没有。暂定鉴别诊断不等于门诊确诊。"
    },
    "questions": [
      {
        "question": "哪项属于症状？",
        "options": [
          "Gastritis",
          "Abdominal pain",
          "Crohn's disease",
          "Ulcerative colitis"
        ],
        "answer": 1,
        "explanation": "Abdominal pain 是腹痛症状。"
      },
      {
        "question": "rule out obstruction 在门诊编码中应如何理解？",
        "options": [
          "已经确诊",
          "需按不确定诊断规则，不直接当确诊",
          "已经完成手术",
          "自动进入 CPT"
        ],
        "answer": 1,
        "explanation": "须看完整临床评估和门诊编码规定。"
      }
    ]
  },
  {
    "id": "med-6-suffixes",
    "chapter": 6,
    "textbookSection": "Introduction",
    "title": "Additional Digestive Suffixes",
    "zh": "消化系统附加后缀与易混词",
    "minutes": 19,
    "objectives": [
      "区分 -emesis、-phagia、-rrhea",
      "认识 -stasis、-stenosis",
      "避免混淆呕血和咯血"
    ],
    "teaching": [
      {
        "heading": "呕吐与吞咽",
        "body": "-emesis 表示呕吐，hematemesis 是呕血；-phagia 与吞咽或进食有关，dysphagia 是吞咽困难。"
      },
      {
        "heading": "排出与停滞",
        "body": "-rrhea 表示流出或排出（如 diarrhea）；-stasis 表示停滞（如 cholestasis）。"
      },
      {
        "heading": "区分相似词",
        "body": "Hematemesis（呕血）与 hemoptysis（咯血）临床来源不同，不能只凭中文的“出血”二字混为一谈。"
      }
    ],
    "diagram": "word",
    "terminology": [
      {
        "term": "hematemesis",
        "zh": "呕血",
        "note": "与呕吐有关"
      },
      {
        "term": "hemoptysis",
        "zh": "咯血",
        "note": "与咳出血液有关"
      },
      {
        "term": "dysphagia",
        "zh": "吞咽困难",
        "note": "-phagia"
      },
      {
        "term": "cholestasis",
        "zh": "胆汁淤积",
        "note": "-stasis"
      }
    ],
    "clinical": {
      "heading": "Different bleeding routes",
      "note": "Patient reports vomiting blood, but denies coughing up blood.",
      "task": "对应的是 hematemesis 还是 hemoptysis？",
      "takeaway": "记录描述呕血而非咯血，症状部位和过程不同。"
    },
    "questions": [
      {
        "question": "-phagia 的含义与什么有关？",
        "options": [
          "切除",
          "进食或吞咽",
          "骨折",
          "成像"
        ],
        "answer": 1,
        "explanation": "-phagia 与进食和吞咽相关。"
      },
      {
        "question": "呕血的英文通常是？",
        "options": [
          "Hemoptysis",
          "Hematemesis",
          "Dysphagia",
          "Cholestasis"
        ],
        "answer": 1,
        "explanation": "Hematemesis 指呕血。"
      }
    ]
  },
  {
    "id": "med-6-gi-labs",
    "chapter": 6,
    "textbookSection": "Laboratory Tests and Clinical Procedures",
    "title": "Digestive Laboratory and Imaging",
    "zh": "消化系统检验与影像检查",
    "minutes": 19,
    "objectives": [
      "区别化验和影像",
      "认识粪便检验与胆红素检测",
      "识别检验值和医生诊断"
    ],
    "teaching": [
      {
        "heading": "Laboratory tests",
        "body": "消化系统可能检查 stool specimen、bilirubin 和消化酶等。不同检测提供不同临床信息。"
      },
      {
        "heading": "影像和内镜",
        "body": "Ultrasound、CT 与 endoscopy 采用不同的方法，不能将检查类型混为一个操作。"
      },
      {
        "heading": "报告阅读",
        "body": "报告中的观察、数值和结论需要分别分析。检验结果异常不能由编码员直接推断病因诊断。"
      }
    ],
    "terminology": [
      {
        "term": "stool culture",
        "zh": "粪便培养",
        "note": "微生物检测"
      },
      {
        "term": "bilirubin",
        "zh": "胆红素",
        "note": "胆汁代谢相关"
      },
      {
        "term": "endoscopy",
        "zh": "内镜检查",
        "note": "观察管腔"
      },
      {
        "term": "biopsy",
        "zh": "活检",
        "note": "取组织标本"
      }
    ],
    "clinical": {
      "heading": "Orders and performed services",
      "note": "Stool culture was ordered, and an upper endoscopy with biopsy was performed.",
      "task": "哪些是医嘱，哪些是已经实施的操作？",
      "takeaway": "粪便培养已开医嘱；内镜和活检已实施。"
    },
    "questions": [
      {
        "question": "Biopsy 指？",
        "options": [
          "取组织标本",
          "仅评估血压",
          "药物处方",
          "皮肤炎症"
        ],
        "answer": 0,
        "explanation": "Biopsy 是取得组织标本用于检查。"
      },
      {
        "question": "实验室异常能否直接由编码员推断某一疾病？",
        "options": [
          "能",
          "不能",
          "所有胆红素升高均是癌症",
          "所有炎症都是感染"
        ],
        "answer": 1,
        "explanation": "必须依据适用规则和完整医师记录。"
      }
    ]
  },
  {
    "id": "med-6-gi-procedures",
    "chapter": 6,
    "textbookSection": "Laboratory Tests and Clinical Procedures",
    "title": "Endoscopy and Surgical Terminology",
    "zh": "内镜与消化系统手术操作",
    "minutes": 19,
    "objectives": [
      "了解 EGD 与 colonoscopy",
      "辨认 -scopy 和 -ectomy",
      "识别腹腔镜和开放入路"
    ],
    "teaching": [
      {
        "heading": "内镜范围",
        "body": "EGD 是食管胃十二指肠镜；colonoscopy 是结肠镜。具体编码仍须核对检查范围和实施的干预。"
      },
      {
        "heading": "切除与检查",
        "body": "-ectomy 常指外科切除，-scopy 与内镜检查有关；不同操作不能只凭共同解剖部位视作相同。"
      },
      {
        "heading": "入路细节",
        "body": "Laparoscopic 与 open 表示不同手术入路。必须以完成的手术报告为准，而不能按术前计划编码。"
      }
    ],
    "terminology": [
      {
        "term": "EGD",
        "zh": "食管胃十二指肠镜",
        "note": "上消化道检查"
      },
      {
        "term": "colonoscopy",
        "zh": "结肠镜",
        "note": "大肠内镜"
      },
      {
        "term": "appendectomy",
        "zh": "阑尾切除术",
        "note": "-ectomy"
      },
      {
        "term": "laparoscopic",
        "zh": "腹腔镜的",
        "note": "手术入路"
      }
    ],
    "clinical": {
      "heading": "Operative title",
      "note": "The operative report documents a laparoscopic appendectomy. No additional procedure was performed.",
      "task": "提取术式、入路及是否存在其他服务。",
      "takeaway": "记录明确腹腔镜阑尾切除；没有其他实施的操作。"
    },
    "questions": [
      {
        "question": "EGD 是哪项检查？",
        "options": [
          "头颅 CT",
          "食管胃十二指肠镜",
          "膀胱镜",
          "结肠镜"
        ],
        "answer": 1,
        "explanation": "EGD 是上消化道内镜检查。"
      },
      {
        "question": "Laparoscopic 和 open 最直接区分什么？",
        "options": [
          "患者年龄",
          "手术入路",
          "病理分级",
          "血压"
        ],
        "answer": 1,
        "explanation": "两者指不同手术入路。"
      }
    ]
  },
  {
    "id": "med-6-chole-case",
    "chapter": 6,
    "textbookSection": "Laboratory Tests and Clinical Procedures",
    "title": "Cholecystectomy Report",
    "zh": "胆囊切除术完整记录辨析",
    "minutes": 19,
    "objectives": [
      "区分胆石病、胆囊炎与胆囊切除",
      "识别手术报告的四项关键信息",
      "避免报告未做的操作"
    ],
    "teaching": [
      {
        "heading": "三个概念",
        "body": "Cholelithiasis 指胆石病，cholecystitis 是胆囊炎，cholecystectomy 则表示切除胆囊的手术。"
      },
      {
        "heading": "阅读操作记录",
        "body": "依次核对 indication、procedure performed、findings 和 complications 等字段。"
      },
      {
        "heading": "进入 CPC 训练",
        "body": "整理诊断、操作、入路、服务日期后，在当年度授权 CPT 代码书查找并核对说明；不能仅凭手术名称猜测代码。"
      }
    ],
    "terminology": [
      {
        "term": "cholelithiasis",
        "zh": "胆石病",
        "note": "胆结石相关"
      },
      {
        "term": "cholecystitis",
        "zh": "胆囊炎",
        "note": "-itis 炎症"
      },
      {
        "term": "cholecystectomy",
        "zh": "胆囊切除术",
        "note": "-ectomy 切除"
      },
      {
        "term": "bile duct",
        "zh": "胆管",
        "note": "胆汁通路"
      }
    ],
    "clinical": {
      "heading": "Fictional operative report",
      "note": "Preoperative diagnosis: gallstones. Procedure performed: laparoscopic cholecystectomy. No bile duct exploration.",
      "task": "这次实际进行了什么手术？胆管探查是否实施？",
      "takeaway": "腹腔镜胆囊切除已实施，胆管探查未实施。"
    },
    "questions": [
      {
        "question": "Cholecystectomy 是什么？",
        "options": [
          "胆囊炎",
          "胆囊切除术",
          "胆汁淤积",
          "胆结石"
        ],
        "answer": 1,
        "explanation": "-ectomy 表示切除术。"
      },
      {
        "question": "No bile duct exploration 表示？",
        "options": [
          "完成胆管探查",
          "没有进行胆管探查",
          "患者有胰腺炎",
          "应该新增胆管操作代码"
        ],
        "answer": 1,
        "explanation": "未实施操作不能报告为完成。"
      }
    ]
  },
  {
    "id": "med-7-urinary-tract",
    "chapter": 7,
    "textbookSection": "Anatomy of the Major Organs",
    "title": "Urinary Tract Anatomy",
    "zh": "肾、输尿管、膀胱和尿道",
    "minutes": 19,
    "objectives": [
      "掌握尿液排出通路",
      "区分 ureter 和 urethra",
      "识别肾脏与膀胱的作用"
    ],
    "teaching": [
      {
        "heading": "主要器官",
        "body": "Kidney 形成尿液，ureter 将尿液送至 urinary bladder 储存，随后经 urethra 排出。"
      },
      {
        "heading": "最容易混淆的词",
        "body": "Ureter 是输尿管，urethra 是尿道，名称相近但解剖位置不同。"
      },
      {
        "heading": "病历定位",
        "body": "影像所述结石或梗阻部位必须准确记录，不能将输尿管发现当作膀胱疾病。"
      }
    ],
    "terminology": [
      {
        "term": "kidney",
        "zh": "肾",
        "note": "形成尿液"
      },
      {
        "term": "ureter",
        "zh": "输尿管",
        "note": "肾到膀胱"
      },
      {
        "term": "bladder",
        "zh": "膀胱",
        "note": "储存尿液"
      },
      {
        "term": "urethra",
        "zh": "尿道",
        "note": "排尿通路"
      }
    ],
    "clinical": {
      "heading": "Urinary CT",
      "note": "CT identified a stone in the left ureter above the bladder.",
      "task": "结石位于哪里，是否为膀胱结石？",
      "takeaway": "位置为左输尿管，不是膀胱。"
    },
    "questions": [
      {
        "question": "尿液从肾流向膀胱经过什么？",
        "options": [
          "尿道",
          "输尿管",
          "气管",
          "肝管"
        ],
        "answer": 1,
        "explanation": "输尿管负责输送。"
      },
      {
        "question": "Urethra 是？",
        "options": [
          "输尿管",
          "肾盂",
          "尿道",
          "肾小球"
        ],
        "answer": 2,
        "explanation": "Urethra 是尿道。"
      }
    ]
  },
  {
    "id": "med-7-nephron",
    "chapter": 7,
    "textbookSection": "Physiology: How the Kidneys Produce Urine",
    "title": "Nephron Physiology",
    "zh": "肾单位与尿液形成",
    "minutes": 19,
    "objectives": [
      "识别肾小球和肾小管",
      "理解滤过、重吸收、分泌",
      "区别生理过程和诊断"
    ],
    "teaching": [
      {
        "heading": "肾单位",
        "body": "Nephron 是肾脏的功能单位，glomerulus 是滤过相关的毛细血管球。"
      },
      {
        "heading": "三大过程",
        "body": "Filtration（滤过）、reabsorption（重吸收）、secretion（分泌）共同参与尿液形成与成分调节。"
      },
      {
        "heading": "临床用途",
        "body": "血肌酐和其他肾功能检查可提示临床问题，但不能由编码员自行诊断急性肾损伤或慢性肾病。"
      }
    ],
    "terminology": [
      {
        "term": "nephron",
        "zh": "肾单位",
        "note": "肾功能单位"
      },
      {
        "term": "glomerulus",
        "zh": "肾小球",
        "note": "血液滤过相关"
      },
      {
        "term": "filtration",
        "zh": "滤过",
        "note": "初步滤出"
      },
      {
        "term": "reabsorption",
        "zh": "重吸收",
        "note": "有用物质重新吸收"
      }
    ],
    "clinical": {
      "heading": "Renal function lab",
      "note": "Creatinine was elevated. The provider documented that further evaluation was needed.",
      "task": "可以由单项检验值直接判定 CKD 吗？",
      "takeaway": "不能。还需要医生明确的临床诊断及适用文档。"
    },
    "questions": [
      {
        "question": "与肾小球滤过最直接相关的结构是？",
        "options": [
          "Glomerulus",
          "Urethra",
          "Bladder",
          "Gallbladder"
        ],
        "answer": 0,
        "explanation": "肾小球参与滤过。"
      },
      {
        "question": "Reabsorption 是？",
        "options": [
          "重吸收",
          "排尿",
          "切除",
          "手术缝合"
        ],
        "answer": 0,
        "explanation": "Reabsorption 为重吸收。"
      }
    ]
  },
  {
    "id": "med-7-urinalysis",
    "chapter": 7,
    "textbookSection": "Urinalysis",
    "title": "Urinalysis and Interpretation",
    "zh": "尿液分析项目及报告阅读",
    "minutes": 19,
    "objectives": [
      "识别尿液分析的常见项目",
      "区分蛋白尿和血尿",
      "理解异常检查值的编码限制"
    ],
    "teaching": [
      {
        "heading": "尿液分析",
        "body": "Urinalysis 可涉及比重、pH、蛋白、葡萄糖、尿红细胞和尿白细胞等检测项目，具体项目视检测方法而异。"
      },
      {
        "heading": "症状和发现",
        "body": "Proteinuria 指尿蛋白异常，hematuria 指尿中出现血液或红细胞。它们不是明确的病因诊断。"
      },
      {
        "heading": "阅读检验单",
        "body": "分别记录项目、测量值、参考范围和临床医生的结论，不能把检验值直接转化为某个疾病。"
      }
    ],
    "terminology": [
      {
        "term": "urinalysis",
        "zh": "尿液分析",
        "note": "UA"
      },
      {
        "term": "specific gravity",
        "zh": "比重",
        "note": "尿液浓缩程度相关"
      },
      {
        "term": "proteinuria",
        "zh": "蛋白尿",
        "note": "尿蛋白异常"
      },
      {
        "term": "hematuria",
        "zh": "血尿",
        "note": "尿中血液相关"
      }
    ],
    "clinical": {
      "heading": "Urine report",
      "note": "Urinalysis showed red blood cells. Provider assessment: microscopic hematuria; workup planned.",
      "task": "目前确立了什么临床表现，病因是否明确？",
      "takeaway": "医生记录镜下血尿，病因尚需进一步评估。"
    },
    "questions": [
      {
        "question": "UA 是什么的缩写？",
        "options": [
          "Urinalysis",
          "Upper abdomen",
          "Ureter ablation",
          "Ultrasound anesthesia"
        ],
        "answer": 0,
        "explanation": "UA 指尿液分析。"
      },
      {
        "question": "血尿是否必然代表膀胱癌？",
        "options": [
          "必然",
          "不必然，需进一步诊断",
          "一定是肾结石",
          "一定是泌尿道感染"
        ],
        "answer": 1,
        "explanation": "血尿原因多种，不能由症状单独确定。"
      }
    ]
  },
  {
    "id": "med-7-urinary-conditions",
    "chapter": 7,
    "textbookSection": "Pathologic Terminology: Kidney, Bladder, and Associated Conditions",
    "title": "Kidney and Bladder Conditions",
    "zh": "泌尿系统病理和定位",
    "minutes": 19,
    "objectives": [
      "区分肾结石和膀胱炎",
      "认识肾盂肾炎",
      "判断症状与诊断的区别"
    ],
    "teaching": [
      {
        "heading": "部位不同",
        "body": "Nephrolithiasis 是肾结石，cystitis 是膀胱炎，pyelonephritis 是肾盂肾炎，相关部位不同。"
      },
      {
        "heading": "感染可能性",
        "body": "Dysuria 和 urinary frequency 可能出现在尿路感染，也可能由其他原因引起；编码员不能只凭症状推断具体感染部位。"
      },
      {
        "heading": "文档核对",
        "body": "从病历确认医生建立的诊断、感染部位、侧别及相关实验室检查，仍需按照相应编码指南核验。"
      }
    ],
    "terminology": [
      {
        "term": "nephrolithiasis",
        "zh": "肾结石",
        "note": "肾脏结石"
      },
      {
        "term": "cystitis",
        "zh": "膀胱炎",
        "note": "膀胱的炎症"
      },
      {
        "term": "pyelonephritis",
        "zh": "肾盂肾炎",
        "note": "肾脏感染/炎症"
      },
      {
        "term": "dysuria",
        "zh": "排尿痛",
        "note": "尿路相关症状"
      }
    ],
    "clinical": {
      "heading": "Uncertain urinary diagnosis",
      "note": "Chief complaint: dysuria and frequency. Urine culture ordered. No definitive diagnosis recorded.",
      "task": "能否立即将患者编码为已确诊膀胱炎？",
      "takeaway": "不能。仅有症状和检查医嘱，还没有明确诊断。"
    },
    "questions": [
      {
        "question": "Cystitis 最常指？",
        "options": [
          "膀胱炎",
          "肝炎",
          "肾结石",
          "尿道狭窄"
        ],
        "answer": 0,
        "explanation": "Cystitis 为膀胱炎。"
      },
      {
        "question": "排尿痛能否独立证明尿路感染？",
        "options": [
          "能",
          "不能，需评估",
          "代表确定有结石",
          "代表已实施抗菌药治疗"
        ],
        "answer": 1,
        "explanation": "症状不等于确定病因。"
      }
    ]
  }
];
