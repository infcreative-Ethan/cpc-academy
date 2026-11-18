import type { MedicalLesson } from "./cpc-medical-lessons";
/** Independently authored Chapters 13–14 lesson content; fictional records and conceptual illustrations. */
export const medicalLessons1314: MedicalLesson[] = [
  {
    "id": "med-13-blood-components",
    "chapter": 13,
    "textbookSection": "Composition and Formation of Blood",
    "title": "Blood Components and Formed Elements",
    "zh": "血浆、红细胞、白细胞与血小板",
    "minutes": 21,
    "objectives": [
      "识别血浆与有形成分",
      "说明红细胞、白细胞、血小板的主要功能",
      "区分实验室计数与疾病诊断"
    ],
    "teaching": [
      {
        "heading": "血液两类组成",
        "body": "Blood（血液）由 plasma（血浆）及 formed elements（有形成分）组成，后者主要是红细胞、白细胞和血小板。"
      },
      {
        "heading": "各类细胞",
        "body": "Erythrocytes（红细胞）依靠血红蛋白运输氧气；leukocytes（白细胞）参与免疫防御；platelets（血小板）参与止血与凝血过程。"
      },
      {
        "heading": "临床记录",
        "body": "Complete blood count（CBC）提供血细胞相关检测结果。任何单项异常计数并不自动证明某个具体血液病。"
      }
    ],
    "diagram": "blood",
    "terminology": [
      {
        "term": "plasma",
        "zh": "血浆",
        "note": "血液液体部分"
      },
      {
        "term": "erythrocyte",
        "zh": "红细胞",
        "note": "运输氧气"
      },
      {
        "term": "leukocyte",
        "zh": "白细胞",
        "note": "参与免疫防御"
      },
      {
        "term": "platelet",
        "zh": "血小板",
        "note": "参与止血"
      }
    ],
    "clinical": {
      "heading": "CBC report",
      "note": "The CBC shows a low platelet count. The clinician documents thrombocytopenia and orders repeat testing.",
      "task": "医生记录了哪一种血液异常？能从血小板减少自动推断病因吗？",
      "takeaway": "记录为血小板减少，但无法仅凭计数确定其具体病因。"
    },
    "questions": [
      {
        "question": "哪类血细胞主要参与血液的携氧功能？",
        "options": [
          "红细胞",
          "白细胞",
          "血小板",
          "淋巴结"
        ],
        "answer": 0,
        "explanation": "红细胞内的血红蛋白承担主要的氧运输。"
      },
      {
        "question": "CBC 属于什么？",
        "options": [
          "血细胞计数检查",
          "心脏导管",
          "脑电图",
          "手术切除"
        ],
        "answer": 0,
        "explanation": "CBC = complete blood count。"
      }
    ]
  },
  {
    "id": "med-13-hematopoiesis",
    "chapter": 13,
    "textbookSection": "Composition and Formation of Blood",
    "title": "Bone Marrow and Hematopoiesis",
    "zh": "骨髓和造血作用",
    "minutes": 21,
    "objectives": [
      "理解造血干细胞的基本作用",
      "认识骨髓和网织红细胞",
      "区分外周血采样与骨髓取材"
    ],
    "teaching": [
      {
        "heading": "造血 Hematopoiesis",
        "body": "多数成人血细胞主要由骨髓中的造血干细胞及其分化谱系产生，形成多种成熟血细胞。"
      },
      {
        "heading": "红细胞成熟",
        "body": "Reticulocyte（网织红细胞）是尚未完全成熟的红细胞；网织红细胞计数可作为评估红细胞生成情况的临床资料之一。"
      },
      {
        "heading": "骨髓检查",
        "body": "Bone marrow aspiration（骨髓抽吸）与 bone marrow biopsy（骨髓活检）是不同取材方式；必须根据记录确认实际实施的操作和标本。"
      }
    ],
    "diagram": "blood",
    "terminology": [
      {
        "term": "hematopoiesis",
        "zh": "造血",
        "note": "血细胞形成过程"
      },
      {
        "term": "bone marrow",
        "zh": "骨髓",
        "note": "重要造血器官"
      },
      {
        "term": "reticulocyte",
        "zh": "网织红细胞",
        "note": "未完全成熟的红细胞"
      },
      {
        "term": "bone marrow biopsy",
        "zh": "骨髓活检",
        "note": "取骨髓组织标本"
      }
    ],
    "clinical": {
      "heading": "Hematology service",
      "note": "The physician performed bone marrow aspiration only. Core biopsy was not obtained.",
      "task": "实际完成的取材操作是什么？",
      "takeaway": "完成骨髓抽吸，但没有取得骨髓核心活检标本；不能把两项操作当作同时完成。"
    },
    "questions": [
      {
        "question": "成人主要造血场所是？",
        "options": [
          "骨髓",
          "胆囊",
          "胸膜腔",
          "尿道"
        ],
        "answer": 0,
        "explanation": "骨髓是成人重要造血场所。"
      },
      {
        "question": "Bone marrow aspiration 和 biopsy 一定同时完成吗？",
        "options": [
          "一定",
          "不一定，应按操作记录核实",
          "只要有贫血就一定",
          "只要医生在场就一定"
        ],
        "answer": 1,
        "explanation": "取材方式不同，应据实记录。"
      }
    ]
  },
  {
    "id": "med-13-blood-typing",
    "chapter": 13,
    "textbookSection": "Blood Types",
    "title": "ABO and Rh Blood Group Systems",
    "zh": "ABO 和 Rh 血型",
    "minutes": 21,
    "objectives": [
      "区分 ABO 抗原和抗体",
      "认识 Rh(D) 阳性与阴性",
      "理解配血和血型诊断的区别"
    ],
    "teaching": [
      {
        "heading": "ABO 基础",
        "body": "ABO 血型由红细胞表面的 A、B 抗原情况决定；血浆中相应天然抗体与相容性有关。AB、A、B、O 为常见 ABO 分组。"
      },
      {
        "heading": "Rh(D)",
        "body": "Rh-positive 通常指红细胞具有 D 抗原，Rh-negative 指没有检测到 D 抗原。输血和妊娠相关记录会关注 Rh 状态。"
      },
      {
        "heading": "配血与报告",
        "body": "Type and screen、crossmatch 是输血相关实验室服务；血型报告不是输血已经实施的证明，也不等于发生了输血反应。"
      }
    ],
    "diagram": "blood",
    "terminology": [
      {
        "term": "antigen",
        "zh": "抗原",
        "note": "免疫识别相关分子"
      },
      {
        "term": "antibody",
        "zh": "抗体",
        "note": "免疫球蛋白"
      },
      {
        "term": "crossmatch",
        "zh": "交叉配血试验",
        "note": "输血相关检测"
      },
      {
        "term": "Rh-negative",
        "zh": "Rh阴性",
        "note": "未检出红细胞 D 抗原"
      }
    ],
    "clinical": {
      "heading": "Transfusion preparation",
      "note": "Type and screen was completed in advance of surgery. No blood transfusion was administered.",
      "task": "哪些服务已经完成？是否发生输血？",
      "takeaway": "完成输血前的血型及抗体筛查，未实施输血。"
    },
    "questions": [
      {
        "question": "ABO 血型主要依据什么？",
        "options": [
          "红细胞相关 A/B 抗原",
          "血小板数量",
          "心率",
          "氧气流量"
        ],
        "answer": 0,
        "explanation": "ABO 由红细胞表面 A 和 B 抗原的存在情况等确定。"
      },
      {
        "question": "Type and screen 完成是否等同于已输血？",
        "options": [
          "是",
          "不是",
          "只有 O 型时是",
          "只有做手术时是"
        ],
        "answer": 1,
        "explanation": "配血准备和实际输血服务不同。"
      }
    ]
  },
  {
    "id": "med-13-coagulation",
    "chapter": 13,
    "textbookSection": "Blood Clotting",
    "title": "Hemostasis and Coagulation",
    "zh": "止血、凝血与实验室检查",
    "minutes": 21,
    "objectives": [
      "理解血管收缩、血小板栓和凝血级联",
      "认识 PT、INR、aPTT",
      "区分血栓与出血疾病"
    ],
    "teaching": [
      {
        "heading": "Hemostasis 止血",
        "body": "受损血管可发生收缩，血小板黏附聚集形成初期止血栓，凝血反应产生纤维蛋白以稳定血凝块。"
      },
      {
        "heading": "常见检测",
        "body": "Prothrombin time（PT）及 INR、activated partial thromboplastin time（aPTT）用于评估凝血过程的不同方面；结果解释必须结合临床情况。"
      },
      {
        "heading": "病理区分",
        "body": "Thrombosis 指血管内血栓形成，hemorrhage 是出血。实验室结果与具体凝血疾病名称不能互相替换。"
      }
    ],
    "diagram": "blood",
    "terminology": [
      {
        "term": "hemostasis",
        "zh": "止血",
        "note": "止住出血的生理过程"
      },
      {
        "term": "coagulation",
        "zh": "凝血",
        "note": "凝血级联相关"
      },
      {
        "term": "fibrin",
        "zh": "纤维蛋白",
        "note": "稳定血凝块"
      },
      {
        "term": "thrombosis",
        "zh": "血栓形成",
        "note": "血管内形成血栓"
      }
    ],
    "clinical": {
      "heading": "Coagulation panel",
      "note": "An elevated INR was reported during anticoagulant monitoring. No active bleeding was documented.",
      "task": "可否将 INR 升高自动认定为活动性出血？",
      "takeaway": "不能。检测值异常与临床出血并非同一概念。"
    },
    "questions": [
      {
        "question": "Platelets 的主要生理作用之一是？",
        "options": [
          "参与初期止血",
          "生成胆汁",
          "过滤尿液",
          "传递神经信号"
        ],
        "answer": 0,
        "explanation": "血小板黏附和聚集参与止血。"
      },
      {
        "question": "INR 升高是否必然证明发生出血？",
        "options": [
          "是",
          "否",
          "只有老年人是",
          "只有住院患者是"
        ],
        "answer": 1,
        "explanation": "INR 反映凝血相关检测结果，不能自动推断出血。"
      }
    ]
  },
  {
    "id": "med-13-blood-pathology",
    "chapter": 13,
    "textbookSection": "Pathology; Laboratory Tests and Clinical Procedures",
    "title": "Anemia, Leukemia and Hematologic Testing",
    "zh": "贫血、白血病与血液检查",
    "minutes": 21,
    "objectives": [
      "理解 anemia 与 leukemia 不是同一疾病",
      "区分 CBC、血涂片和骨髓检查",
      "避免由单一血细胞计数推断恶性肿瘤"
    ],
    "teaching": [
      {
        "heading": "贫血",
        "body": "Anemia 是红细胞数量、血红蛋白或相关携氧能力不足的临床状态，可能有缺铁、慢性疾病等多种病因。"
      },
      {
        "heading": "白血病",
        "body": "Leukemia 是造血系统恶性疾病的一类，不能因为白细胞增多就直接认定患有 leukemia。"
      },
      {
        "heading": "检查路径",
        "body": "CBC、peripheral blood smear（外周血涂片）与 bone marrow examination（骨髓检查）提供不同类型的信息，实际使用取决于医师评估。"
      }
    ],
    "diagram": "blood",
    "terminology": [
      {
        "term": "anemia",
        "zh": "贫血",
        "note": "携氧能力相关异常"
      },
      {
        "term": "leukemia",
        "zh": "白血病",
        "note": "造血系统恶性疾病"
      },
      {
        "term": "peripheral smear",
        "zh": "外周血涂片",
        "note": "血液形态学检查"
      },
      {
        "term": "hemoglobin",
        "zh": "血红蛋白",
        "note": "红细胞内携氧蛋白"
      }
    ],
    "clinical": {
      "heading": "Hematology referral",
      "note": "A high white blood cell count prompted a referral. The provider documented leukocytosis, not leukemia.",
      "task": "这里确立的是白细胞增多还是白血病？",
      "takeaway": "记录为 leukocytosis（白细胞增多），未诊断 leukemia。"
    },
    "questions": [
      {
        "question": "Anemia 指？",
        "options": [
          "贫血",
          "白血病",
          "血管成形",
          "脾切除"
        ],
        "answer": 0,
        "explanation": "Anemia 为贫血。"
      },
      {
        "question": "白细胞增多必然是白血病吗？",
        "options": [
          "必然",
          "不一定，需要临床诊断",
          "只要发热就是",
          "只要成年就是"
        ],
        "answer": 1,
        "explanation": "白细胞增多有多种原因，不能直接推断恶性肿瘤。"
      }
    ]
  },
  {
    "id": "med-14-lymphatic-structures",
    "chapter": 14,
    "textbookSection": "Lymphatic System",
    "title": "Lymph, Nodes, Vessels and Spleen",
    "zh": "淋巴液、淋巴管、淋巴结和脾脏",
    "minutes": 21,
    "objectives": [
      "了解淋巴回流与组织液关系",
      "认识淋巴结和脾脏",
      "区别淋巴结肿大与恶性淋巴瘤"
    ],
    "teaching": [
      {
        "heading": "淋巴回流",
        "body": "Lymphatic vessels（淋巴管）将组织间液回收形成的淋巴液输送回静脉循环，并参与免疫细胞运输。"
      },
      {
        "heading": "主要结构",
        "body": "Lymph nodes（淋巴结）过滤淋巴液并参与免疫监视；spleen（脾脏）过滤血液并参与免疫活动。"
      },
      {
        "heading": "临床解读",
        "body": "Lymphadenopathy（淋巴结肿大）不是 lymphoma（淋巴瘤）的同义词。肿大的原因可多样，需进一步临床评估。"
      }
    ],
    "diagram": "immune",
    "terminology": [
      {
        "term": "lymph",
        "zh": "淋巴液",
        "note": "组织间液回流相关"
      },
      {
        "term": "lymph node",
        "zh": "淋巴结",
        "note": "过滤淋巴并参与免疫"
      },
      {
        "term": "spleen",
        "zh": "脾脏",
        "note": "血液过滤和免疫器官"
      },
      {
        "term": "lymphadenopathy",
        "zh": "淋巴结肿大",
        "note": "体征或诊断术语"
      }
    ],
    "clinical": {
      "heading": "Neck swelling",
      "note": "Exam documents enlarged cervical lymph nodes. Biopsy is planned; malignancy has not been established.",
      "task": "能仅因淋巴结肿大就报告淋巴瘤吗？",
      "takeaway": "不能。该病历只记录颈部淋巴结肿大，活检尚未实施。"
    },
    "questions": [
      {
        "question": "淋巴结的主要作用包括？",
        "options": [
          "过滤淋巴并参与免疫",
          "生成胆汁",
          "泵血",
          "产生尿液"
        ],
        "answer": 0,
        "explanation": "淋巴结参与淋巴液过滤和免疫反应。"
      },
      {
        "question": "Lymphadenopathy 是否必然表示 lymphoma？",
        "options": [
          "是",
          "否",
          "只有颈部淋巴结时是",
          "只要准备活检就是"
        ],
        "answer": 1,
        "explanation": "淋巴结肿大有多种病因。"
      }
    ]
  },
  {
    "id": "med-14-immune-cells",
    "chapter": 14,
    "textbookSection": "Immune System",
    "title": "Innate and Adaptive Immune Responses",
    "zh": "先天免疫、适应性免疫和免疫细胞",
    "minutes": 21,
    "objectives": [
      "区分 innate 与 adaptive immunity",
      "认识 B 和 T 淋巴细胞",
      "理解抗体的产生和作用"
    ],
    "teaching": [
      {
        "heading": "先天免疫",
        "body": "Innate immunity（先天免疫）是机体迅速响应多种威胁的防御机制，包括皮肤屏障、吞噬细胞、炎症反应等。"
      },
      {
        "heading": "适应性免疫",
        "body": "Adaptive immunity（适应性免疫）涉及 B lymphocytes、T lymphocytes 和免疫记忆；B 细胞可分化产生抗体的浆细胞。"
      },
      {
        "heading": "抗原抗体",
        "body": "Antigen 和 antibody 不同：抗原是免疫识别的靶标，抗体由特定免疫细胞产生并结合相应抗原。"
      }
    ],
    "diagram": "immune",
    "terminology": [
      {
        "term": "innate immunity",
        "zh": "先天免疫",
        "note": "快速非特异性防御"
      },
      {
        "term": "adaptive immunity",
        "zh": "适应性免疫",
        "note": "特异性免疫反应"
      },
      {
        "term": "B lymphocyte",
        "zh": "B淋巴细胞",
        "note": "可参与抗体产生"
      },
      {
        "term": "T lymphocyte",
        "zh": "T淋巴细胞",
        "note": "细胞免疫的重要组成"
      }
    ],
    "clinical": {
      "heading": "Antibody result",
      "note": "An antibody assay was positive. The physician documents previous immunization and does not diagnose active infection.",
      "task": "抗体阳性可以自动判断为现症感染吗？",
      "takeaway": "不能。抗体结果需要结合具体检测、接种史、暴露和临床判断。"
    },
    "questions": [
      {
        "question": "B 淋巴细胞与什么功能密切相关？",
        "options": [
          "抗体反应",
          "制造胆汁",
          "心脏起搏",
          "尿液过滤"
        ],
        "answer": 0,
        "explanation": "B 细胞可参与抗体产生与免疫记忆。"
      },
      {
        "question": "抗体阳性是否总等于现症感染？",
        "options": [
          "是",
          "否",
          "只有年轻患者是",
          "只有无症状时是"
        ],
        "answer": 1,
        "explanation": "抗体结果可能反映既往感染或免疫接种等，需结合检测类型和临床情况。"
      }
    ]
  },
  {
    "id": "med-14-inflammation",
    "chapter": 14,
    "textbookSection": "Immune System",
    "title": "Inflammation, Allergy and Hypersensitivity",
    "zh": "炎症、过敏和超敏反应",
    "minutes": 21,
    "objectives": [
      "理解 inflammation 基本体征",
      "区分 allergy 和 anaphylaxis",
      "区分免疫反应与具体临床确诊"
    ],
    "teaching": [
      {
        "heading": "炎症反应",
        "body": "Inflammation（炎症）常涉及免疫细胞、局部血流变化和组织介质，可能出现红、肿、热、痛等表现。炎症并不一定由感染引起。"
      },
      {
        "heading": "过敏反应",
        "body": "Allergy（过敏）涉及免疫系统对某些物质的异常反应；anaphylaxis（严重过敏反应）可能危及生命，但具体诊断及严重程度依临床评估。"
      },
      {
        "heading": "病历中的词语",
        "body": "Rash（皮疹）、pruritus（瘙痒）是表现，不能单凭两项症状就自动推断特定药物过敏或 anaphylaxis。"
      }
    ],
    "diagram": "immune",
    "terminology": [
      {
        "term": "inflammation",
        "zh": "炎症",
        "note": "组织免疫反应"
      },
      {
        "term": "hypersensitivity",
        "zh": "超敏反应",
        "note": "免疫应答异常"
      },
      {
        "term": "anaphylaxis",
        "zh": "严重过敏反应",
        "note": "可危及生命"
      },
      {
        "term": "pruritus",
        "zh": "瘙痒",
        "note": "临床症状"
      }
    ],
    "clinical": {
      "heading": "Skin symptoms",
      "note": "The patient reported an itchy rash after using a topical product. The provider documented dermatitis; no anaphylaxis.",
      "task": "是否可以把皮疹改成严重过敏反应诊断？",
      "takeaway": "不能。医生记载皮炎，没有确诊 anaphylaxis。"
    },
    "questions": [
      {
        "question": "Pruritus 是？",
        "options": [
          "瘙痒",
          "炎症分期",
          "严重过敏反应",
          "淋巴瘤"
        ],
        "answer": 0,
        "explanation": "Pruritus 是瘙痒。"
      },
      {
        "question": "炎症一定由感染引起吗？",
        "options": [
          "是",
          "不是",
          "只有皮肤炎症是",
          "只有发热时是"
        ],
        "answer": 1,
        "explanation": "炎症也可来自损伤、自身免疫等非感染因素。"
      }
    ]
  },
  {
    "id": "med-14-immune-pathology",
    "chapter": 14,
    "textbookSection": "Pathologic Conditions",
    "title": "Autoimmune Disease, HIV and Immunodeficiency",
    "zh": "自身免疫、免疫缺陷与 HIV 术语",
    "minutes": 21,
    "objectives": [
      "区分 autoimmune disease 和 immunodeficiency",
      "理解 HIV 与 AIDS 的区别",
      "不从检测结果自行推断疾病分期"
    ],
    "teaching": [
      {
        "heading": "自身免疫疾病",
        "body": "Autoimmune disease（自身免疫疾病）是免疫系统错误地攻击自身组织的疾病类别，例如 rheumatoid arthritis 等；诊断需要专业临床证据。"
      },
      {
        "heading": "免疫缺陷",
        "body": "Immunodeficiency（免疫缺陷）是免疫功能受损的状态，可由遗传、获得性疾病或某些治疗因素导致。"
      },
      {
        "heading": "HIV 和 AIDS",
        "body": "HIV 指人类免疫缺陷病毒及其感染，AIDS 指与 HIV 相关的特定临床阶段。两者不能只根据检测安排或症状随意替换，必须遵照当年度官方指南。"
      }
    ],
    "diagram": "immune",
    "terminology": [
      {
        "term": "autoimmune disease",
        "zh": "自身免疫疾病",
        "note": "免疫误识别自身组织"
      },
      {
        "term": "immunodeficiency",
        "zh": "免疫缺陷",
        "note": "免疫功能受损"
      },
      {
        "term": "HIV",
        "zh": "人类免疫缺陷病毒",
        "note": "与感染相关"
      },
      {
        "term": "AIDS",
        "zh": "获得性免疫缺陷综合征",
        "note": "HIV相关特定临床阶段"
      }
    ],
    "clinical": {
      "heading": "HIV testing",
      "note": "HIV screening was ordered due to a reported exposure. No HIV infection diagnosis was documented.",
      "task": "筛查医嘱可以直接当作 HIV 感染确诊吗？",
      "takeaway": "不能。暴露风险与筛查安排不等于 HIV 感染诊断。"
    },
    "questions": [
      {
        "question": "Autoimmune disease 的含义是？",
        "options": [
          "免疫系统错误攻击自身组织",
          "所有传染病",
          "缺乏红细胞",
          "胆汁淤积"
        ],
        "answer": 0,
        "explanation": "自身免疫疾病涉及针对自身组织的免疫异常。"
      },
      {
        "question": "HIV 筛查被安排是否证明 HIV 感染？",
        "options": [
          "证明",
          "不证明",
          "只要有风险暴露就证明",
          "只要有乏力就证明"
        ],
        "answer": 1,
        "explanation": "必须根据医生确认的诊断和适用编码指南判断。"
      }
    ]
  },
  {
    "id": "med-14-lymph-procedures",
    "chapter": 14,
    "textbookSection": "Laboratory Tests and Clinical Procedures",
    "title": "Immune Tests, Lymph Node Biopsy and Vaccination",
    "zh": "免疫检测、淋巴结活检与疫苗接种",
    "minutes": 21,
    "objectives": [
      "区分 lymph node biopsy 与 excision",
      "识别 immunoassay 与血常规",
      "认识疫苗制品和接种服务可能分别计费"
    ],
    "teaching": [
      {
        "heading": "淋巴结取材",
        "body": "Lymph node biopsy 是取得组织进行病理检查；excision 可能涉及更大范围的切除。必须读取完整手术记录，确认实际组织范围。"
      },
      {
        "heading": "免疫检测",
        "body": "Immunoassay（免疫测定）是利用抗原抗体等反应进行的实验方法。具体检验项目和结果应按报告核实。"
      },
      {
        "heading": "疫苗接种",
        "body": "Immunization（免疫接种）可能涉及疫苗制品与接种操作等不同报告对象，具体费用和编码需核对当前 CPT®、HCPCS 和支付方规定。"
      }
    ],
    "diagram": "immune",
    "terminology": [
      {
        "term": "lymph node biopsy",
        "zh": "淋巴结活检",
        "note": "取组织标本"
      },
      {
        "term": "immunoassay",
        "zh": "免疫测定",
        "note": "抗原抗体相关检测"
      },
      {
        "term": "vaccination",
        "zh": "疫苗接种",
        "note": "免疫预防措施"
      },
      {
        "term": "excision",
        "zh": "切除术",
        "note": "手术操作范围"
      }
    ],
    "clinical": {
      "heading": "Vaccine record",
      "note": "The vaccine was administered and recorded. A lymph node biopsy was scheduled for a later date.",
      "task": "本次哪些服务完成？哪项尚待实施？",
      "takeaway": "疫苗接种已经实施；淋巴结活检尚未实施。"
    },
    "questions": [
      {
        "question": "Immunoassay 是哪类方法？",
        "options": [
          "免疫测定",
          "超声扫描",
          "血管搭桥",
          "腰椎穿刺"
        ],
        "answer": 0,
        "explanation": "Immunoassay 使用免疫学反应检测目标物。"
      },
      {
        "question": "scheduled biopsy 是否代表活检已经实施？",
        "options": [
          "代表",
          "不代表",
          "如果已接种疫苗就代表",
          "只要患者到医院就代表"
        ],
        "answer": 1,
        "explanation": "安排检查与实际实施必须区分。"
      }
    ]
  }
];
