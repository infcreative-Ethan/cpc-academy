import type { MedicalLesson } from "./cpc-medical-lessons";
/** Independently authored foundational chapters 10–12. Illustrations are educational schematics, not diagnostic images. */
export const medicalLessons1012: MedicalLesson[] = [
  {
    "id": "med-10-neurons",
    "chapter": 10,
    "textbookSection": "Neurons, Nerves, and Glial Cells",
    "title": "Neurons, Neuroglia and Nerve Signaling",
    "zh": "神经元、神经胶质细胞与信号传递",
    "minutes": 21,
    "objectives": [
      "识别神经元的树突、细胞体和轴突",
      "区分神经元和胶质细胞",
      "理解感觉输入与运动输出"
    ],
    "teaching": [
      {
        "heading": "神经元的三部分",
        "body": "Dendrites（树突）接受许多输入，cell body（细胞体）负责细胞活动，axon（轴突）将电信号传向远处。神经元之间通常在 synapse（突触）进行信息传递。"
      },
      {
        "heading": "胶质细胞",
        "body": "Neuroglia（神经胶质细胞）支持、保护并调节神经组织的环境；许多胶质细胞帮助形成 myelin（髓鞘），使神经信号传递更有效率。"
      },
      {
        "heading": "神经信号与病历",
        "body": "Numbness（麻木）、weakness（无力）、paresthesia（感觉异常）可能提示神经系统问题，但不能仅凭症状自行判断病灶部位。"
      }
    ],
    "diagram": "nervous",
    "terminology": [
      {
        "term": "neuron",
        "zh": "神经元",
        "note": "神经系统信号传递细胞"
      },
      {
        "term": "axon",
        "zh": "轴突",
        "note": "传导信号"
      },
      {
        "term": "synapse",
        "zh": "突触",
        "note": "细胞间传递信号的连接"
      },
      {
        "term": "myelin",
        "zh": "髓鞘",
        "note": "支持有效信号传递"
      }
    ],
    "clinical": {
      "heading": "Neurology consultation",
      "note": "The patient reports tingling in the right hand. The neurologist documents paresthesia and orders nerve conduction studies.",
      "task": "这段记录是否已经诊断为正中神经压迫？",
      "takeaway": "没有。记录的评估是感觉异常；神经传导检查只是被安排，不能推断具体神经损害。"
    },
    "questions": [
      {
        "question": "哪一结构主要将神经元信号传向远方？",
        "options": [
          "树突",
          "轴突",
          "细胞核",
          "血小板"
        ],
        "answer": 1,
        "explanation": "Axon 是轴突，负责将信号传离胞体。"
      },
      {
        "question": "右手麻木是否足以确诊腕管综合征？",
        "options": [
          "是",
          "否，需要医生评估和相关依据",
          "只要右侧就足够",
          "只要有感觉异常就足够"
        ],
        "answer": 1,
        "explanation": "症状不能替代明确疾病诊断。"
      }
    ]
  },
  {
    "id": "med-10-cns-pns",
    "chapter": 10,
    "textbookSection": "General Structure",
    "title": "Central and Peripheral Nervous Systems",
    "zh": "中枢神经和周围神经系统",
    "minutes": 21,
    "objectives": [
      "区分 CNS 和 PNS",
      "理解脑神经与脊神经的基本含义",
      "读懂神经相关检查的部位"
    ],
    "teaching": [
      {
        "heading": "中枢神经系统",
        "body": "Central nervous system（CNS）包括脑和脊髓，负责整合信息并协调身体多种活动。"
      },
      {
        "heading": "周围神经系统",
        "body": "Peripheral nervous system（PNS）包括中枢外的神经和相关神经节。脑神经、脊神经将感受信息及运动指令在中枢与身体之间传递。"
      },
      {
        "heading": "临床定位",
        "body": "Peripheral neuropathy（周围神经病）与 brain lesion（脑部病变）不是同一类解剖位置。病历定位不明确时不能自行指定受累神经。"
      }
    ],
    "diagram": "nervous",
    "terminology": [
      {
        "term": "central nervous system",
        "zh": "中枢神经系统",
        "note": "脑和脊髓"
      },
      {
        "term": "peripheral nerve",
        "zh": "周围神经",
        "note": "中枢以外的神经"
      },
      {
        "term": "cranial nerve",
        "zh": "脑神经",
        "note": "与脑相关的周围神经"
      },
      {
        "term": "spinal nerve",
        "zh": "脊神经",
        "note": "连接脊髓与身体"
      }
    ],
    "clinical": {
      "heading": "Localization",
      "note": "The physician documents left facial numbness and plans an MRI of the brain. No intracranial lesion has been diagnosed.",
      "task": "症状出现在哪里？MRI 计划是否意味着已有颅内病灶？",
      "takeaway": "记录左侧面部麻木，但尚未记录颅内病灶；影像计划不能作为病变确诊证据。"
    },
    "questions": [
      {
        "question": "CNS 包括什么？",
        "options": [
          "脑和脊髓",
          "心脏和肺",
          "肝与胆囊",
          "骨和关节"
        ],
        "answer": 0,
        "explanation": "中枢神经系统包括脑与脊髓。"
      },
      {
        "question": "Peripheral nerve 主要属于？",
        "options": [
          "中枢神经系统",
          "周围神经系统",
          "消化系统",
          "免疫系统"
        ],
        "answer": 1,
        "explanation": "周围神经属于 PNS。"
      }
    ]
  },
  {
    "id": "med-10-brain",
    "chapter": 10,
    "textbookSection": "The Brain",
    "title": "Brain Regions and Functions",
    "zh": "大脑、小脑和脑干",
    "minutes": 21,
    "objectives": [
      "认识大脑、间脑、小脑与脑干",
      "理解运动和协调的不同脑部功能",
      "区分影像发现和临床诊断"
    ],
    "teaching": [
      {
        "heading": "大脑 Cerebrum",
        "body": "大脑半球参与感觉、随意运动、语言、记忆等复杂功能。不同脑区承担不同任务，不能由单一症状直接确定受损的某个皮质区域。"
      },
      {
        "heading": "小脑与脑干",
        "body": "Cerebellum（小脑）与运动协调和平衡有关；brainstem（脑干）连接脑和脊髓，包含许多生命功能相关通路及核团。"
      },
      {
        "heading": "脑影像",
        "body": "MRI、CT 属于影像检查。脑部影像上的 lesion、infarct 等词汇需要结合医生报告、临床评估与适用编码规则，不能自行把非特异性发现归类为确诊疾病。"
      }
    ],
    "diagram": "nervous",
    "terminology": [
      {
        "term": "cerebrum",
        "zh": "大脑",
        "note": "复杂功能与运动感觉"
      },
      {
        "term": "cerebellum",
        "zh": "小脑",
        "note": "运动协调"
      },
      {
        "term": "brainstem",
        "zh": "脑干",
        "note": "连接大脑与脊髓"
      },
      {
        "term": "cerebral cortex",
        "zh": "大脑皮质",
        "note": "大脑外层灰质"
      }
    ],
    "clinical": {
      "heading": "Brain MRI",
      "note": "MRI shows a nonspecific white-matter signal change. The clinician documents headache without a definitive neurologic diagnosis.",
      "task": "能直接把影像信号变化编码为多发性硬化吗？",
      "takeaway": "不能。影像非特异性变化和头痛不证明特定脱髓鞘疾病已经确诊。"
    },
    "questions": [
      {
        "question": "与运动协调密切相关的脑区是？",
        "options": [
          "小脑",
          "胰腺",
          "胸膜",
          "肾上腺"
        ],
        "answer": 0,
        "explanation": "小脑参与运动协调和平衡。"
      },
      {
        "question": "非特异性脑 MRI 变化能否由编码员自行诊断 MS？",
        "options": [
          "可以",
          "不可以",
          "仅在右侧病灶时可以",
          "仅有头痛时可以"
        ],
        "answer": 1,
        "explanation": "必须依赖临床医生记录。"
      }
    ]
  },
  {
    "id": "med-10-spinal-meninges",
    "chapter": 10,
    "textbookSection": "The Spinal Cord and Meninges",
    "title": "Spinal Cord, Meninges and Cerebrospinal Fluid",
    "zh": "脊髓、脑膜和脑脊液",
    "minutes": 21,
    "objectives": [
      "识别脑膜的三层结构",
      "理解脑脊液与蛛网膜下腔",
      "区分腰椎穿刺与脊柱手术"
    ],
    "teaching": [
      {
        "heading": "脑膜三层",
        "body": "Meninges 包括 dura mater（硬脑膜）、arachnoid mater（蛛网膜）和 pia mater（软脑膜），共同包围并保护中枢神经系统。"
      },
      {
        "heading": "脑脊液",
        "body": "Cerebrospinal fluid（CSF）位于脑室系统及蛛网膜下腔等区域，起到缓冲及维持神经系统环境的作用。"
      },
      {
        "heading": "腰椎穿刺",
        "body": "Lumbar puncture 是从腰部适当位置进入蛛网膜下腔以取得 CSF 或进行其他临床操作，不能仅凭头痛主诉认定已经实施穿刺。"
      }
    ],
    "diagram": "nervous",
    "terminology": [
      {
        "term": "dura mater",
        "zh": "硬脑膜",
        "note": "脑膜外层"
      },
      {
        "term": "arachnoid mater",
        "zh": "蛛网膜",
        "note": "脑膜中层"
      },
      {
        "term": "pia mater",
        "zh": "软脑膜",
        "note": "紧贴神经组织"
      },
      {
        "term": "lumbar puncture",
        "zh": "腰椎穿刺",
        "note": "脑脊液相关操作"
      }
    ],
    "clinical": {
      "heading": "Procedure note",
      "note": "A lumbar puncture was completed and cerebrospinal fluid collected for laboratory testing.",
      "task": "已经实施的是哪项操作，取得什么标本？",
      "takeaway": "完成腰椎穿刺并取得脑脊液标本；不能由这个操作本身推断脑膜炎。"
    },
    "questions": [
      {
        "question": "下列哪一项不是脑膜？",
        "options": [
          "硬脑膜",
          "蛛网膜",
          "软脑膜",
          "胸膜"
        ],
        "answer": 3,
        "explanation": "胸膜是胸腔相关浆膜，不属于脑膜。"
      },
      {
        "question": "腰椎穿刺采集的常见标本是？",
        "options": [
          "胆汁",
          "脑脊液",
          "尿液",
          "唾液"
        ],
        "answer": 1,
        "explanation": "Lumbar puncture 可用于采集 CSF。"
      }
    ]
  },
  {
    "id": "med-10-neuro-clinical",
    "chapter": 10,
    "textbookSection": "Pathology; Laboratory Tests and Clinical Procedures",
    "title": "Neurologic Conditions and Diagnostic Services",
    "zh": "神经疾病、EEG、CT 与 MRI",
    "minutes": 21,
    "objectives": [
      "区分 seizure、stroke 和 neuropathy",
      "认识 EEG 与 MRI 的不同任务",
      "判断临床操作是否已经完成"
    ],
    "teaching": [
      {
        "heading": "疾病概念",
        "body": "Seizure 是发作性神经活动异常；stroke 通常指急性脑血管事件；neuropathy 为神经病变的统称。三者不是同义词。"
      },
      {
        "heading": "常见检查",
        "body": "Electroencephalography（EEG）记录脑电活动，CT/MRI 侧重解剖影像，electromyography（EMG）和神经传导研究评估神经肌肉功能的特定方面。"
      },
      {
        "heading": "诊断和编码",
        "body": "病历可以包含 rule out stroke、seizure-like episode 等未确诊表述。门诊服务中不能将不确定诊断按确诊报告，实际规则以适用年度和场景为准。"
      }
    ],
    "diagram": "nervous",
    "terminology": [
      {
        "term": "electroencephalography",
        "zh": "脑电图检查",
        "note": "EEG"
      },
      {
        "term": "electromyography",
        "zh": "肌电图",
        "note": "EMG"
      },
      {
        "term": "stroke",
        "zh": "脑卒中",
        "note": "脑血管事件"
      },
      {
        "term": "neuropathy",
        "zh": "神经病变",
        "note": "周围或其他神经病理"
      }
    ],
    "clinical": {
      "heading": "Outpatient neurology",
      "note": "The patient had a transient episode of dizziness. Neurologist ordered EEG and MRI; no seizure disorder was established.",
      "task": "患者已确诊癫痫吗？报告了什么已实施检查？",
      "takeaway": "尚未确诊癫痫；EEG 与 MRI 仅被安排，不能视为已经完成。"
    },
    "questions": [
      {
        "question": "EEG 主要检测什么？",
        "options": [
          "脑电活动",
          "血红蛋白浓度",
          "尿蛋白",
          "动脉血压"
        ],
        "answer": 0,
        "explanation": "EEG 记录脑部电活动。"
      },
      {
        "question": "门诊记录写 possible seizure 可以直接按癫痫确诊编码吗？",
        "options": [
          "可以",
          "不可以",
          "若安排 EEG 就可以",
          "只有发生头晕时可以"
        ],
        "answer": 1,
        "explanation": "不确定诊断应按适用门诊规则处理。"
      }
    ]
  },
  {
    "id": "med-11-blood-flow",
    "chapter": 11,
    "textbookSection": "Blood Vessels and Circulation",
    "title": "Systemic, Pulmonary and Coronary Circulation",
    "zh": "体循环、肺循环和冠状循环",
    "minutes": 21,
    "objectives": [
      "区分 artery 和 vein",
      "建立血流经过心肺的路径",
      "认识冠状动脉供血"
    ],
    "teaching": [
      {
        "heading": "动脉与静脉",
        "body": "Arteries（动脉）把血液从心脏运出；veins（静脉）将血液带回心脏。判断动静脉应看血流方向，不是简单用血液含氧量判断。"
      },
      {
        "heading": "两套主要循环",
        "body": "肺循环把血液从右心送至肺，气体交换后回左心；体循环把血液从左心送到全身组织并回右心。"
      },
      {
        "heading": "冠状循环",
        "body": "Coronary arteries（冠状动脉）供应心肌氧和营养。Coronary artery disease 与 myocardial infarction 相关但并非同一概念。"
      }
    ],
    "diagram": "heart",
    "terminology": [
      {
        "term": "artery",
        "zh": "动脉",
        "note": "离开心脏"
      },
      {
        "term": "vein",
        "zh": "静脉",
        "note": "返回心脏"
      },
      {
        "term": "pulmonary circulation",
        "zh": "肺循环",
        "note": "右心-肺-左心"
      },
      {
        "term": "coronary artery",
        "zh": "冠状动脉",
        "note": "供应心肌"
      }
    ],
    "clinical": {
      "heading": "Chest pain evaluation",
      "note": "Patient reports intermittent chest pressure. Coronary angiography is being considered; no coronary artery disease has been established.",
      "task": "是否可凭胸闷确认冠心病？",
      "takeaway": "不能。胸部不适和考虑造影不等于已确认冠状动脉疾病。"
    },
    "questions": [
      {
        "question": "动脉的定义主要取决于什么？",
        "options": [
          "离开心脏的血流方向",
          "一定含氧",
          "一定不含氧",
          "血管粗细"
        ],
        "answer": 0,
        "explanation": "动脉将血液从心脏运出，肺动脉就是重要例外含氧量例子。"
      },
      {
        "question": "Coronary arteries 主要供血于？",
        "options": [
          "心肌",
          "胆囊",
          "肾小球",
          "脑膜"
        ],
        "answer": 0,
        "explanation": "冠状动脉供应心肌。"
      }
    ]
  },
  {
    "id": "med-11-heart-anatomy",
    "chapter": 11,
    "textbookSection": "Anatomy of the Heart",
    "title": "Four Chambers, Septa and Valves",
    "zh": "心脏四腔、间隔与瓣膜",
    "minutes": 21,
    "objectives": [
      "识别左右心房与心室",
      "认识二尖瓣、三尖瓣、主动脉瓣和肺动脉瓣",
      "理解心脏左右分隔"
    ],
    "teaching": [
      {
        "heading": "四腔",
        "body": "右心房与右心室接收和泵送来自体循环的回流血液至肺；左心房与左心室接收肺静脉回流并将血液送入体循环。"
      },
      {
        "heading": "主要瓣膜",
        "body": "Tricuspid valve 位于右心房和右心室间；mitral valve 位于左心房和左心室间；pulmonary 与 aortic valves 是半月瓣。"
      },
      {
        "heading": "编码细节",
        "body": "Valve repair（瓣膜修复）和 valve replacement（瓣膜置换）不同；需要核查具体瓣膜、方法、入路和实际完成的手术。"
      }
    ],
    "diagram": "heart",
    "terminology": [
      {
        "term": "atrium",
        "zh": "心房",
        "note": "上部心腔"
      },
      {
        "term": "ventricle",
        "zh": "心室",
        "note": "主要泵血心腔"
      },
      {
        "term": "mitral valve",
        "zh": "二尖瓣",
        "note": "左房与左室间"
      },
      {
        "term": "tricuspid valve",
        "zh": "三尖瓣",
        "note": "右房与右室间"
      }
    ],
    "clinical": {
      "heading": "Valve procedure",
      "note": "Operative report: mitral valve repair performed; no prosthetic valve implanted.",
      "task": "实施的是修复还是人工瓣膜置换？",
      "takeaway": "报告明确为二尖瓣修复，未植入人工瓣膜；不能作为瓣膜置换报告。"
    },
    "questions": [
      {
        "question": "Mitral valve 位于哪里？",
        "options": [
          "左房与左室之间",
          "右房与右室之间",
          "左室与主动脉之间",
          "右室与肺动脉之间"
        ],
        "answer": 0,
        "explanation": "二尖瓣连接左心房与左心室。"
      },
      {
        "question": "Repair 与 replacement 可以互换吗？",
        "options": [
          "可以",
          "不可以",
          "若都有手术入路就可以",
          "只有同一个瓣膜时可以"
        ],
        "answer": 1,
        "explanation": "瓣膜修复与置换属于不同操作。"
      }
    ]
  },
  {
    "id": "med-11-cardiac-physiology",
    "chapter": 11,
    "textbookSection": "Physiology of the Heart; Blood Pressure",
    "title": "Conduction, Cardiac Cycle and Blood Pressure",
    "zh": "心电传导、心动周期与血压",
    "minutes": 21,
    "objectives": [
      "识别 SA node 和 AV node",
      "理解 systole 与 diastole",
      "区分血压异常读数和高血压诊断"
    ],
    "teaching": [
      {
        "heading": "电传导",
        "body": "心脏正常节律通常由 sinoatrial (SA) node（窦房结）启动，冲动经 atrioventricular (AV) node（房室结）等结构传至心室。"
      },
      {
        "heading": "收缩与舒张",
        "body": "Systole（收缩期）与 diastole（舒张期）属于心动周期阶段。血压一般以收缩压/舒张压表示，但一组读数不自动说明长期疾病。"
      },
      {
        "heading": "临床记录",
        "body": "ECG（心电图）可以记录心电活动；arrhythmia（心律失常）是诊断类别，而 palpitations（心悸）是症状。"
      }
    ],
    "diagram": "heart",
    "terminology": [
      {
        "term": "sinoatrial node",
        "zh": "窦房结",
        "note": "正常起搏点"
      },
      {
        "term": "atrioventricular node",
        "zh": "房室结",
        "note": "传导环节"
      },
      {
        "term": "systole",
        "zh": "收缩期",
        "note": "心脏收缩"
      },
      {
        "term": "diastole",
        "zh": "舒张期",
        "note": "心脏舒张"
      }
    ],
    "clinical": {
      "heading": "Blood pressure reading",
      "note": "BP 148/90 mmHg at a single office measurement. Physician planned repeat monitoring; hypertension not diagnosed.",
      "task": "可以单凭一次读数报告高血压确诊吗？",
      "takeaway": "不能。这里明确未确诊高血压，需按医师判断与指南处理。"
    },
    "questions": [
      {
        "question": "正常窦性心律通常始于？",
        "options": [
          "窦房结",
          "胰腺",
          "脾脏",
          "冠状静脉"
        ],
        "answer": 0,
        "explanation": "SA node 是正常心脏起搏点。"
      },
      {
        "question": "Palpitations 的意思是？",
        "options": [
          "心悸",
          "心肌梗死",
          "瓣膜置换",
          "静脉栓塞"
        ],
        "answer": 0,
        "explanation": "Palpitations 为心悸症状，非特定心律失常确诊。"
      }
    ]
  },
  {
    "id": "med-11-vascular-disease",
    "chapter": 11,
    "textbookSection": "Heart and Blood-Vessel Pathology",
    "title": "Coronary Disease, Heart Failure and Vascular Conditions",
    "zh": "冠心病、心力衰竭及血管疾病",
    "minutes": 21,
    "objectives": [
      "理解 CAD、myocardial infarction 与 heart failure 的区别",
      "认识动脉瘤和血栓基本概念",
      "识别症状与疾病状态"
    ],
    "teaching": [
      {
        "heading": "心血管常见疾病",
        "body": "Coronary artery disease（CAD）涉及冠状动脉病变；myocardial infarction（MI）指心肌梗死；heart failure（HF）表示心脏泵血/充盈功能异常的临床综合征。"
      },
      {
        "heading": "血管病理",
        "body": "Atherosclerosis（动脉粥样硬化）与 arterial aneurysm（动脉瘤）不同，thrombosis（血栓形成）与 embolism（栓塞）也需要根据医生记录区分。"
      },
      {
        "heading": "编码需要进一步具体化",
        "body": "心力衰竭可能需要区分类型和其他细节；不能根据一条异常化验或呼吸困难症状自行指定心衰。"
      }
    ],
    "diagram": "heart",
    "terminology": [
      {
        "term": "myocardial infarction",
        "zh": "心肌梗死",
        "note": "MI"
      },
      {
        "term": "heart failure",
        "zh": "心力衰竭",
        "note": "HF"
      },
      {
        "term": "atherosclerosis",
        "zh": "动脉粥样硬化",
        "note": "血管壁病变"
      },
      {
        "term": "embolism",
        "zh": "栓塞",
        "note": "栓子造成血管阻塞"
      }
    ],
    "clinical": {
      "heading": "Heart failure assessment",
      "note": "Patient reports leg swelling and exertional dyspnea. Echocardiogram scheduled; no HF diagnosis documented.",
      "task": "能否从水肿与呼吸困难直接报告心衰？",
      "takeaway": "不能。症状提示需要评估，但尚未建立心力衰竭诊断。"
    },
    "questions": [
      {
        "question": "MI 是什么的缩写？",
        "options": [
          "Myocardial infarction",
          "Mitral inspection",
          "Muscle inflammation",
          "Medical imaging"
        ],
        "answer": 0,
        "explanation": "MI = myocardial infarction。"
      },
      {
        "question": "下列哪个是症状而非明确心衰诊断？",
        "options": [
          "Dyspnea",
          "Heart failure",
          "CAD",
          "Atherosclerosis"
        ],
        "answer": 0,
        "explanation": "Dyspnea 是呼吸困难症状。"
      }
    ]
  },
  {
    "id": "med-11-cardiac-procedures",
    "chapter": 11,
    "textbookSection": "Laboratory Tests and Clinical Procedures",
    "title": "ECG, Echocardiography and Catheterization",
    "zh": "心电图、心脏超声与导管检查",
    "minutes": 21,
    "objectives": [
      "区别 ECG 和 echocardiography",
      "认识 cardiac catheterization",
      "理解诊断导管与治疗性介入的差异"
    ],
    "teaching": [
      {
        "heading": "ECG 与超声",
        "body": "Electrocardiography（ECG/EKG）记录心电活动，echocardiography 利用超声观察心脏结构和功能，两者不等同。"
      },
      {
        "heading": "导管相关操作",
        "body": "Cardiac catheterization（心导管检查）和 PCI（经皮冠状动脉介入）可能使用导管，但诊断性评估与治疗性干预需要分别理解。"
      },
      {
        "heading": "编码工作",
        "body": "专业服务编码应核查血管部位、导管路径、影像、实际治疗、完成报告及同次操作之间的报告规则。"
      }
    ],
    "diagram": "heart",
    "terminology": [
      {
        "term": "electrocardiography",
        "zh": "心电图",
        "note": "ECG/EKG"
      },
      {
        "term": "echocardiography",
        "zh": "心脏超声",
        "note": "结构与功能"
      },
      {
        "term": "cardiac catheterization",
        "zh": "心导管检查",
        "note": "导管进入心脏相关结构"
      },
      {
        "term": "angioplasty",
        "zh": "血管成形术",
        "note": "治疗性干预"
      }
    ],
    "clinical": {
      "heading": "Cath lab report",
      "note": "Diagnostic coronary angiography was completed. No coronary intervention or stent placement was performed.",
      "task": "此次可否认定实施了支架植入？",
      "takeaway": "不能。记录仅完成诊断性冠状动脉造影，没有治疗性支架操作。"
    },
    "questions": [
      {
        "question": "ECG 用于记录什么？",
        "options": [
          "心电活动",
          "胆囊收缩",
          "血型",
          "肺活量"
        ],
        "answer": 0,
        "explanation": "ECG 记录心脏电活动。"
      },
      {
        "question": "冠状动脉造影一定伴随支架植入吗？",
        "options": [
          "是",
          "否",
          "只有右侧就必须",
          "只要入院就必须"
        ],
        "answer": 1,
        "explanation": "诊断性造影与治疗性介入不同。"
      }
    ]
  },
  {
    "id": "med-12-airway",
    "chapter": 12,
    "textbookSection": "Anatomy and Physiology of Respiration",
    "title": "Upper and Lower Respiratory Tracts",
    "zh": "上下呼吸道和气流通路",
    "minutes": 21,
    "objectives": [
      "区分上呼吸道和下呼吸道",
      "认识喉、气管和支气管",
      "解释空气如何进入肺泡"
    ],
    "teaching": [
      {
        "heading": "气流经过的通路",
        "body": "空气由鼻腔或口腔进入咽、喉，再经过气管、支气管、细支气管到达肺泡；上下呼吸道划分随医学语境而异。"
      },
      {
        "heading": "保护性结构",
        "body": "Epiglottis（会厌）参与吞咽时保护气道，larynx（喉）包含声带相关结构。"
      },
      {
        "heading": "临床定位",
        "body": "Bronchitis（支气管炎）、laryngitis（喉炎）与 pneumonia（肺炎）涉及不同呼吸道/肺部结构，不能把咳嗽直接等同于某一个疾病。"
      }
    ],
    "diagram": "respiratory",
    "terminology": [
      {
        "term": "larynx",
        "zh": "喉",
        "note": "声门相关"
      },
      {
        "term": "trachea",
        "zh": "气管",
        "note": "气流通道"
      },
      {
        "term": "bronchus",
        "zh": "支气管",
        "note": "肺内气道分支"
      },
      {
        "term": "alveolus",
        "zh": "肺泡",
        "note": "气体交换结构"
      }
    ],
    "clinical": {
      "heading": "Upper-airway symptoms",
      "note": "Patient has hoarseness. Provider documents laryngitis and advises rest. No bronchoscopy was performed.",
      "task": "这次记录的部位与确诊是什么？",
      "takeaway": "医生诊断喉炎，声音嘶哑为症状；没有实施支气管镜。"
    },
    "questions": [
      {
        "question": "空气经过气管后通常进入？",
        "options": [
          "支气管",
          "食管",
          "肾盂",
          "结肠"
        ],
        "answer": 0,
        "explanation": "气管分为主支气管。"
      },
      {
        "question": "Alveoli 主要承担什么功能？",
        "options": [
          "气体交换",
          "产生胆汁",
          "制造血小板",
          "分泌胰岛素"
        ],
        "answer": 0,
        "explanation": "肺泡与肺毛细血管之间进行气体交换。"
      }
    ]
  },
  {
    "id": "med-12-gas-exchange",
    "chapter": 12,
    "textbookSection": "Anatomy and Physiology of Respiration",
    "title": "Ventilation and Gas Exchange",
    "zh": "通气、气体交换与呼吸力学",
    "minutes": 21,
    "objectives": [
      "区分 ventilation 和 gas exchange",
      "理解膈肌的作用",
      "认识氧气和二氧化碳交换方向"
    ],
    "teaching": [
      {
        "heading": "通气 Ventilation",
        "body": "Ventilation 是空气进出肺部的过程；吸气时膈肌收缩下移，胸腔容量增加，促进空气进入肺部。"
      },
      {
        "heading": "Gas exchange",
        "body": "肺泡与毛细血管之间，氧进入血液而二氧化碳从血液进入肺泡。细胞水平的气体交换和肺部换气相关但概念不同。"
      },
      {
        "heading": "检查意义",
        "body": "Pulse oximetry 测量外围血氧饱和度相关指标；arterial blood gas（ABG）提供动脉血的气体与酸碱信息，二者不完全等同。"
      }
    ],
    "diagram": "respiratory",
    "terminology": [
      {
        "term": "diaphragm",
        "zh": "膈肌",
        "note": "主要吸气肌"
      },
      {
        "term": "ventilation",
        "zh": "通气",
        "note": "空气进入和离开肺"
      },
      {
        "term": "diffusion",
        "zh": "扩散",
        "note": "分子沿浓度梯度运动"
      },
      {
        "term": "pulse oximetry",
        "zh": "脉搏血氧测定",
        "note": "非侵入式氧合评估"
      }
    ],
    "clinical": {
      "heading": "Low oxygen reading",
      "note": "Pulse oximeter showed reduced oxygen saturation. The physician requested repeat measurement and further evaluation.",
      "task": "是否可以单凭数值自行认定慢性呼吸衰竭？",
      "takeaway": "不能。低血氧读数需要临床判断，不能直接推断具体疾病及其慢性程度。"
    },
    "questions": [
      {
        "question": "吸气时膈肌通常怎样运动？",
        "options": [
          "收缩并下降",
          "完全停止活动",
          "自动关闭支气管",
          "向上推动肺泡闭合"
        ],
        "answer": 0,
        "explanation": "吸气时膈肌收缩并下移。"
      },
      {
        "question": "ABG 与 pulse oximetry 完全相同吗？",
        "options": [
          "是",
          "不是",
          "两者都只测血糖",
          "两者都属于手术"
        ],
        "answer": 1,
        "explanation": "ABG 可测血气与酸碱参数，而脉氧主要估计血氧饱和度。"
      }
    ]
  },
  {
    "id": "med-12-lung-pathology",
    "chapter": 12,
    "textbookSection": "Pathology",
    "title": "Asthma, COPD and Pneumonia",
    "zh": "哮喘、慢阻肺和肺炎",
    "minutes": 21,
    "objectives": [
      "区别哮喘与 COPD 的疾病概念",
      "识别 pneumonia 的主要含义",
      "区分发热、咳嗽和确诊肺炎"
    ],
    "teaching": [
      {
        "heading": "Asthma",
        "body": "Asthma（哮喘）是一种以气道炎症及可变气流受限等为特征的疾病，其临床表现和管理方式有多种。"
      },
      {
        "heading": "COPD",
        "body": "Chronic obstructive pulmonary disease（COPD）是慢性气流受限相关的疾病类别，常涉及慢性支气管炎及肺气肿等表型，但不能把所有喘息归类为 COPD。"
      },
      {
        "heading": "Pneumonia",
        "body": "Pneumonia 是肺实质感染或炎症性疾病，常见症状包括咳嗽、发热等，但确诊及病因类别必须依靠医师记录。"
      }
    ],
    "diagram": "respiratory",
    "terminology": [
      {
        "term": "asthma",
        "zh": "哮喘",
        "note": "气道疾病"
      },
      {
        "term": "COPD",
        "zh": "慢性阻塞性肺疾病",
        "note": "气流受限"
      },
      {
        "term": "pneumonia",
        "zh": "肺炎",
        "note": "肺实质疾病"
      },
      {
        "term": "dyspnea",
        "zh": "呼吸困难",
        "note": "症状"
      }
    ],
    "clinical": {
      "heading": "Outpatient fever and cough",
      "note": "The provider documents acute bronchitis. The patient has cough and fever, with no pneumonia diagnosis.",
      "task": "可以因为发热和咳嗽就替换为 pneumonia 吗？",
      "takeaway": "不能。临床记录是急性支气管炎，不支持自行诊断肺炎。"
    },
    "questions": [
      {
        "question": "Dyspnea 是什么？",
        "options": [
          "呼吸困难",
          "肺炎",
          "喉切除术",
          "胸腔穿刺"
        ],
        "answer": 0,
        "explanation": "Dyspnea 指呼吸困难症状。"
      },
      {
        "question": "COPD 是否与 asthma 完全同义？",
        "options": [
          "完全相同",
          "不是同义词",
          "只在儿童时相同",
          "仅在病历有咳嗽时相同"
        ],
        "answer": 1,
        "explanation": "两种疾病在病理与诊断上不同。"
      }
    ]
  },
  {
    "id": "med-12-respiratory-tests",
    "chapter": 12,
    "textbookSection": "Clinical Procedures",
    "title": "Pulmonary Function Testing and Imaging",
    "zh": "肺功能、胸部影像和检查报告",
    "minutes": 21,
    "objectives": [
      "认识 spirometry",
      "区分胸片与 CT",
      "识别检查与医生诊断的区别"
    ],
    "teaching": [
      {
        "heading": "肺功能",
        "body": "Spirometry（肺活量测定）包括评估气流等指标，用于辅助判断呼吸系统的功能；实际检测项目及解读取决于具体检查。"
      },
      {
        "heading": "胸部影像",
        "body": "Chest radiograph（胸部X线）与 chest CT（胸部CT）是不同的影像服务，需核查具体检查部位、视图、技术及报告。"
      },
      {
        "heading": "职业编码关联",
        "body": "不能因为医生开出胸部影像检查医嘱，就将检查作为已完成的服务报告；需核对是否实际执行和签发必要报告。"
      }
    ],
    "diagram": "respiratory",
    "terminology": [
      {
        "term": "spirometry",
        "zh": "肺活量测定",
        "note": "肺功能检查"
      },
      {
        "term": "chest radiograph",
        "zh": "胸部X线片",
        "note": "影像检查"
      },
      {
        "term": "computed tomography",
        "zh": "计算机断层扫描",
        "note": "CT"
      },
      {
        "term": "bronchoscopy",
        "zh": "支气管镜检查",
        "note": "内镜操作"
      }
    ],
    "clinical": {
      "heading": "Orders and completed services",
      "note": "A two-view chest radiograph was performed and interpreted. Pulmonary function testing was ordered for next week.",
      "task": "哪些检查完成了？哪些仍未实施？",
      "takeaway": "胸片完成且已解读；肺功能只是被安排。"
    },
    "questions": [
      {
        "question": "Spirometry 用于评估？",
        "options": [
          "呼吸气流功能",
          "肝胆影像",
          "肾脏过滤",
          "免疫抗体类型"
        ],
        "answer": 0,
        "explanation": "肺活量测定帮助评估呼吸功能。"
      },
      {
        "question": "ordered for next week 意味着？",
        "options": [
          "已经完成",
          "尚未实施",
          "自动获支付",
          "确认肺炎"
        ],
        "answer": 1,
        "explanation": "检查医嘱不等于完成记录。"
      }
    ]
  },
  {
    "id": "med-12-respiratory-procedures",
    "chapter": 12,
    "textbookSection": "Clinical Procedures",
    "title": "Bronchoscopy, Thoracentesis and Ventilation",
    "zh": "支气管镜、胸腔穿刺和机械通气",
    "minutes": 21,
    "objectives": [
      "区分 bronchoscopy 和 thoracentesis",
      "认识 pleural space",
      "理解机械通气和氧疗不等同"
    ],
    "teaching": [
      {
        "heading": "支气管镜",
        "body": "Bronchoscopy 使用镜器观察气道，可视病情进行相关采样或其他干预；不能只依据支气管镜名称推断已完成活检。"
      },
      {
        "heading": "胸腔穿刺",
        "body": "Thoracentesis 用于抽取胸膜腔内液体或其他合适情况；胸膜腔与肺内支气管并不是同一解剖位置。"
      },
      {
        "heading": "呼吸支持",
        "body": "Mechanical ventilation（机械通气）和 supplemental oxygen（补充氧气）是不同支持方式；编码要求需依据具体场景和完整服务记录。"
      }
    ],
    "diagram": "respiratory",
    "terminology": [
      {
        "term": "bronchoscopy",
        "zh": "支气管镜",
        "note": "观察呼吸道"
      },
      {
        "term": "thoracentesis",
        "zh": "胸腔穿刺术",
        "note": "胸膜腔液体采集"
      },
      {
        "term": "pleural effusion",
        "zh": "胸腔积液",
        "note": "胸膜腔内液体"
      },
      {
        "term": "mechanical ventilation",
        "zh": "机械通气",
        "note": "呼吸支持技术"
      }
    ],
    "clinical": {
      "heading": "Procedure note",
      "note": "A left-sided thoracentesis removed pleural fluid for analysis. No bronchoscopy was performed.",
      "task": "实际操作与部位是什么？",
      "takeaway": "左侧胸腔穿刺采集胸膜腔液体，没有支气管镜。"
    },
    "questions": [
      {
        "question": "Thoracentesis 最直接涉及？",
        "options": [
          "胸膜腔",
          "脑室",
          "肾小球",
          "胃"
        ],
        "answer": 0,
        "explanation": "胸腔穿刺涉及胸膜腔。"
      },
      {
        "question": "使用氧气是否必然代表机械通气？",
        "options": [
          "是",
          "否",
          "若患者喘息就必然",
          "只有儿童时必然"
        ],
        "answer": 1,
        "explanation": "单纯氧疗和机械通气不是同一服务。"
      }
    ]
  }
];
