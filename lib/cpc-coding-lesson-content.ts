/** Independently authored professional coding lessons; never a substitute for official code sets. */
export type CodingLessonDetail = { id:string; unitId:string; lessonIndex:number; zh:string; objectives:string[]; sections:{heading:string;body:string}[]; practice:{record:string;prompt:string;explanation:string}; questions:[{question:string;options:[string,string,string,string];answer:number;explanation:string},{question:string;options:[string,string,string,string];answer:number;explanation:string}] };
export const codingLessonDetails: CodingLessonDetail[] = [
  {
    "id": "icd-foundations:0",
    "unitId": "icd-foundations",
    "lessonIndex": 0,
    "zh": "ICD-10-CM 的用途与适用范围",
    "objectives": [
      "理解 diagnosis code 的基本任务",
      "区分症状和已经确诊的疾病",
      "认识医师专业服务中的诊断编码"
    ],
    "sections": [
      {
        "heading": "什么是诊断编码",
        "body": "ICD-10-CM 是美国使用的临床修订诊断分类，描述疾病、症状、病理状态和就诊原因等内容。它不描述绝大多数医师完成的手术操作。"
      },
      {
        "heading": "从病历开始",
        "body": "编码的对象是当前医疗场景中有文档支持的诊断或就诊原因。阅读 Chief Complaint、Assessment、Plan 时，要区分患者所述症状与医生确立的诊断。"
      },
      {
        "heading": "为什么不能只搜疾病",
        "body": "编码选择还可能受服务日期、场景、伴随疾病、侧别及专项指南影响。不能只看一个英文病名就确定最终代码。"
      }
    ],
    "practice": {
      "record": "Office note: Chief complaint—headache. Provider assessment—headache, etiology undetermined. No migraine diagnosis documented.",
      "prompt": "本次记录是否支持把 migraine 作为明确诊断？",
      "explanation": "不支持。只有头痛，未确认偏头痛。"
    },
    "questions": [
      {
        "question": "ICD-10-CM 主要描述什么？",
        "options": [
          "诊断、症状及就诊原因",
          "药品销售价格",
          "医师手术室排班",
          "麻醉剂量"
        ],
        "answer": 0,
        "explanation": "ICD-10-CM 的核心用途是诊断与相关就诊原因分类。"
      },
      {
        "question": "只写 headache 的门诊病历可自动编码 migraine 吗？",
        "options": [
          "可以",
          "不可以",
          "只要年龄超过40岁",
          "只有使用药物时可以"
        ],
        "answer": 1,
        "explanation": "不能自行推断未记录的特定疾病。"
      }
    ]
  },
  {
    "id": "icd-foundations:1",
    "unitId": "icd-foundations",
    "lessonIndex": 1,
    "zh": "代码结构、类别与子类别",
    "objectives": [
      "认识代码中的字母和数字",
      "理解类目、子类目及完整代码",
      "避免使用不完整代码层级"
    ],
    "sections": [
      {
        "heading": "代码的基本形式",
        "body": "ICD-10-CM 代码是字母数字结构，通常有3至7个字符。前三位为类别层级；需要更多字符时，通常第三位之后使用小数点显示。"
      },
      {
        "heading": "不同的细化信息",
        "body": "某些代码通过后续字符进一步描述部位、侧别、临床状态、具体疾病或适用的就诊阶段。要求哪些字符取决于该代码类别。"
      },
      {
        "heading": "正确核验",
        "body": "在 Alphabetic Index 查到候选内容后，进入 Tabular List 查看是否需要更具体的字符以及上级类别的说明。"
      }
    ],
    "practice": {
      "record": "A learner found a three-character category in the Index. The Tabular List requires additional characters to identify laterality.",
      "prompt": "能否直接把该类别当作最终完整代码？",
      "explanation": "不能；应按 Tabular List 补齐必需信息，并确认病历有支持。"
    },
    "questions": [
      {
        "question": "ICD-10-CM 类别通常由多少个字符组成？",
        "options": [
          "1",
          "2",
          "3",
          "9"
        ],
        "answer": 2,
        "explanation": "三字符通常代表类别。"
      },
      {
        "question": "类别要求具体侧别，但病历未记录时应如何处理？",
        "options": [
          "自行选择左侧",
          "自行选择右侧",
          "按照官方代码结构和文档不足流程处理",
          "忽略必需字符"
        ],
        "answer": 2,
        "explanation": "不能推断缺失细节。"
      }
    ]
  },
  {
    "id": "icd-foundations:2",
    "unitId": "icd-foundations",
    "lessonIndex": 2,
    "zh": "FY 年度版本与生效日期",
    "objectives": [
      "理解 fiscal year 与日历年区别",
      "学习按 Date of Service 选择版本",
      "认识版本信息对审核的作用"
    ],
    "sections": [
      {
        "heading": "FY 不是自然年",
        "body": "ICD-10-CM 财年版本通常从每年10月1日开始。例如 FY2027 从2026年10月1日起适用，至2027年9月30日。"
      },
      {
        "heading": "实际操作",
        "body": "记录 Date of Service，再根据官方适用时间选择正确文件。一个新的日历年开始，并不自动表示 ICD-10-CM 财年版本已经更新。"
      },
      {
        "heading": "保留编码依据",
        "body": "实际工作记录版本、官方来源和查询日期。对于被修订、添加或失效的代码，适用日期可能影响有效性。"
      }
    ],
    "practice": {
      "record": "Date of service: 2026-11-16. The learner has FY2026 and FY2027 ICD-10-CM references.",
      "prompt": "应优先使用哪个财年版本？",
      "explanation": "FY2027；仍需核对发布的官方补充文件和具体版本说明。"
    },
    "questions": [
      {
        "question": "2026年11月16日的适用 ICD-10-CM 财年通常是？",
        "options": [
          "FY2025",
          "FY2026",
          "FY2027",
          "FY2028"
        ],
        "answer": 2,
        "explanation": "2026年10月1日开始 FY2027。"
      },
      {
        "question": "应按什么选择诊断编码版本？",
        "options": [
          "手机购买日期",
          "服务日期和官方有效期",
          "就诊医院名称首字母",
          "当前任意最新代码"
        ],
        "answer": 1,
        "explanation": "必须按服务日期和官方生效日期核对。"
      }
    ]
  },
  {
    "id": "icd-foundations:3",
    "unitId": "icd-foundations",
    "lessonIndex": 3,
    "zh": "ICD-10-CM 与 ICD-10-PCS 的区别",
    "objectives": [
      "区分诊断与住院操作分类",
      "理解 CPT 与医师专业服务的联系",
      "避免混用代码集"
    ],
    "sections": [
      {
        "heading": "ICD-10-CM",
        "body": "CM 是诊断分类，用于疾病和就诊原因等场景；其用途不等于医疗操作编码。"
      },
      {
        "heading": "ICD-10-PCS",
        "body": "PCS 是美国住院设施使用的医疗操作分类体系。它不是医师专业服务日常用来报告 CPT® 手术的代码集。"
      },
      {
        "heading": "在 CPC 的位置",
        "body": "CPC 主要关注医师和其他专业人员的编码工作，需学习 ICD-10-CM 诊断和 CPT®/HCPCS 服务、用品等分类，同时理解不同场景边界。"
      }
    ],
    "practice": {
      "record": "An outpatient surgeon removes a gallbladder. The claim needs a procedure classification for the physician's professional service.",
      "prompt": "应从哪套操作编码资料开始？",
      "explanation": "CPT® 的适用手术章节，而非把 ICD-10-PCS 当作 CPT 替代。"
    },
    "questions": [
      {
        "question": "ICD-10-PCS 最典型的使用场景是？",
        "options": [
          "住院设施操作编码",
          "医师门诊专业操作的 CPT 替代",
          "药品通用名查询",
          "英语发音"
        ],
        "answer": 0,
        "explanation": "PCS 属于独立的住院设施操作分类。"
      },
      {
        "question": "医师专业服务手术通常需要参考？",
        "options": [
          "CPT® 代码集",
          "只能使用 ICD-10-PCS",
          "只能使用 ICD-10-CM",
          "无需任何代码"
        ],
        "answer": 0,
        "explanation": "专业服务一般使用 CPT®，并按场景结合其他代码集。"
      }
    ]
  },
  {
    "id": "icd-index:0",
    "unitId": "icd-index",
    "lessonIndex": 0,
    "zh": "Index 的结构和查找入口",
    "objectives": [
      "认识 Alphabetic Index",
      "从医学记录确定检索概念",
      "建立索引到表格的完整工作顺序"
    ],
    "sections": [
      {
        "heading": "为什么先用 Index",
        "body": "Alphabetic Index 按临床术语组织检索入口，帮助把病历中的诊断表达定位到 ICD-10-CM 的候选代码或相关索引词。"
      },
      {
        "heading": "先理解后查找",
        "body": "例如先区分症状、疾病与病史，再选择适当的 Main Term。含义不清时应查看医学定义和完整临床文档。"
      },
      {
        "heading": "查询不是最终选择",
        "body": "找到索引结果以后，必须再到 Tabular List 核对所有说明、字符要求、排除项和具体有效代码。"
      }
    ],
    "practice": {
      "record": "Assessment: chronic cough. No cause was diagnosed. The learner begins searching for 'pneumonia'.",
      "prompt": "检索策略有什么问题？",
      "explanation": "病历未确诊肺炎。应该根据当前已记录的诊断或症状概念选择索引入口。"
    },
    "questions": [
      {
        "question": "Alphabetic Index 最主要作用是？",
        "options": [
          "定位候选编码入口",
          "确认最终无需核对",
          "替代医生诊断",
          "决定报销价格"
        ],
        "answer": 0,
        "explanation": "Index 用于引导定位。"
      },
      {
        "question": "Index 找到候选后下一步是什么？",
        "options": [
          "直接提交",
          "查 Tabular List",
          "自动添加修饰符",
          "忽略诊断记录"
        ],
        "answer": 1,
        "explanation": "必须在 Tabular List 核验。"
      }
    ]
  },
  {
    "id": "icd-index:1",
    "unitId": "icd-index",
    "lessonIndex": 1,
    "zh": "Main Term 与 Subterm",
    "objectives": [
      "识别索引主词",
      "理解次级条目可进一步限定意义",
      "从病历提取正确限定信息"
    ],
    "sections": [
      {
        "heading": "主词",
        "body": "Main Term 是 Alphabetic Index 的主要检索入口，通常是疾病、病症、症状或相关临床概念。"
      },
      {
        "heading": "次级词条",
        "body": "Subterm 位于主词下方，细化部位、伴随病情、具体类型等信息。选用具体分支前必须确认文档有相关依据。"
      },
      {
        "heading": "练习顺序",
        "body": "先记录原始临床表述，再找 Main Term，最后依照文档逐层阅读相关 Subterm，并到 Tabular List 核验。"
      }
    ],
    "practice": {
      "record": "Provider documents pain in the left shoulder, with no confirmed cause.",
      "prompt": "检索时可以自行将 shoulder pain 改写为 rotator cuff tear 吗？",
      "explanation": "不能。没有记录肩袖撕裂，不能根据常见原因替换症状。"
    },
    "questions": [
      {
        "question": "Subterm 的主要作用是？",
        "options": [
          "进一步限定主词的具体含义",
          "自动生成 CPT",
          "保存 MP3",
          "显示患者姓名"
        ],
        "answer": 0,
        "explanation": "Subterm 为主词提供更具体的索引路径。"
      },
      {
        "question": "使用具体 Subterm 必须具备什么？",
        "options": [
          "病历支持该信息",
          "症状常见即可",
          "AI 推测即可",
          "患者年龄足够即可"
        ],
        "answer": 0,
        "explanation": "细化信息需有相应临床记录。"
      }
    ]
  },
  {
    "id": "icd-index:2",
    "unitId": "icd-index",
    "lessonIndex": 2,
    "zh": "See / See Also 交叉引用",
    "objectives": [
      "理解 See 的引导作用",
      "区别 See Also 的相关入口提示",
      "避免停留在错误索引项"
    ],
    "sections": [
      {
        "heading": "See",
        "body": "在 ICD-10-CM Alphabetic Index 中，See 是交叉引用，提示转到指定主词或入口进行检索。"
      },
      {
        "heading": "See Also",
        "body": "See Also 提醒可能存在另一个有帮助的检索入口。是否需要转查应按当前索引结构、术语及临床情况决定。"
      },
      {
        "heading": "完整核对",
        "body": "即使交叉引用路径非常清晰，也要对候选代码执行 Tabular List 核验，不能只凭索引条目结束查码。"
      }
    ],
    "practice": {
      "record": "A learner encounters 'See' beside the selected index term and immediately submits the displayed adjacent code.",
      "prompt": "哪一步没有完成？",
      "explanation": "需要遵循 See 的索引跳转，再去 Tabular List 核对最终代码。"
    },
    "questions": [
      {
        "question": "Index 中 See 一般提示？",
        "options": [
          "转至另一主词或入口",
          "停止核验",
          "使用旧版代码",
          "增加两个修饰符"
        ],
        "answer": 0,
        "explanation": "See 用于索引交叉引用。"
      },
      {
        "question": "See Also 与什么最相关？",
        "options": [
          "补充相关检索入口",
          "官方自动支付",
          "诊断已确立",
          "不需要 Tabular List"
        ],
        "answer": 0,
        "explanation": "See Also 提醒可能有其他相关检索路径。"
      }
    ]
  },
  {
    "id": "icd-index:3",
    "unitId": "icd-index",
    "lessonIndex": 3,
    "zh": "诊断表达与索引词条匹配",
    "objectives": [
      "保持原始临床含义",
      "区分症状与明确诊断",
      "查码时标记记录不充分之处"
    ],
    "sections": [
      {
        "heading": "临床表达可能很长",
        "body": "病历中的描述常包含部位、持续时间、既往病史和不确定性。索引查找不是复制整句，而是提取准确的临床概念。"
      },
      {
        "heading": "不能改变诊断",
        "body": "如记录仅为 dizziness（头晕），不能自行改写为 vertigo（眩晕）或某一种特定前庭疾病。"
      },
      {
        "heading": "判断是否需要澄清",
        "body": "如果影响编码的重要信息缺失或相互矛盾，应遵守机构规定的文档澄清流程，不能由编码员猜测。"
      }
    ],
    "practice": {
      "record": "The clinical note says 'dizziness.' The coder assumes 'benign positional vertigo' and searches that term.",
      "prompt": "应怎样改正？",
      "explanation": "先忠实于病历表达；没有医生确认前，不能把头晕替换为特定前庭疾病。"
    },
    "questions": [
      {
        "question": "病历只有 dizziness，可以自行改为 BPPV 吗？",
        "options": [
          "可以",
          "不可以",
          "只能在急诊中可以",
          "只要有眩晕药物即可"
        ],
        "answer": 1,
        "explanation": "缺少明确医生诊断不能自行细化。"
      },
      {
        "question": "发现侧别缺失，正确做法是？",
        "options": [
          "随机选择",
          "按官方规则与合规澄清流程处理",
          "默认双侧",
          "删掉病例"
        ],
        "answer": 1,
        "explanation": "编码必须基于记录，有缺口时按规定处理。"
      }
    ]
  },
  {
    "id": "cpt-foundations:0",
    "unitId": "cpt-foundations",
    "lessonIndex": 0,
    "zh": "CPT® 的用途与类别",
    "objectives": [
      "知道 CPT® 的核心用途",
      "认识 Category I、II、III",
      "区分诊断与服务报告"
    ],
    "sections": [
      {
        "heading": "什么是 CPT®",
        "body": "CPT® 由 AMA 维护，用于描述医师及其他合格专业人员提供的医疗服务和操作，包括评估、手术、影像、检查等。"
      },
      {
        "heading": "不同类别",
        "body": "Category I 用于广泛使用的服务与操作；Category II 与可选质量追踪有关；Category III 主要用于新兴技术、服务和操作的临时追踪。应查当年度授权版说明。"
      },
      {
        "heading": "CPC 工作流程",
        "body": "先识别实际完成的服务，再定位当年度 CPT 章节，核对描述、注释和适用要求。不能仅凭疾病名称确定操作。"
      }
    ],
    "practice": {
      "record": "An outpatient visit documents a diagnosis of gastritis and an upper endoscopy performed.",
      "prompt": "哪个是诊断概念，哪个是操作服务？",
      "explanation": "Gastritis 是诊断，upper endoscopy 是操作服务，分别对应不同编码查询。"
    },
    "questions": [
      {
        "question": "CPT® 主要用于描述什么？",
        "options": [
          "专业服务和操作",
          "疾病病因学分类",
          "医生个人联系方式",
          "药物批准程序"
        ],
        "answer": 0,
        "explanation": "CPT® 是专业服务与操作编码体系。"
      },
      {
        "question": "Category III 主要涉及？",
        "options": [
          "新兴技术和服务的临时追踪",
          "所有诊断",
          "住院设施所有病史",
          "英语拼写测试"
        ],
        "answer": 0,
        "explanation": "Category III 用于新兴技术和服务/操作的临时追踪。"
      }
    ]
  },
  {
    "id": "cpt-foundations:1",
    "unitId": "cpt-foundations",
    "lessonIndex": 1,
    "zh": "CPT Codebook 结构",
    "objectives": [
      "了解主要 CPT 章节",
      "区分书籍索引与正式章节",
      "认识代码书中的说明和结构"
    ],
    "sections": [
      {
        "heading": "主要章节",
        "body": "CPT® 代码书包含 Evaluation and Management、Anesthesia、Surgery、Radiology、Pathology/Laboratory、Medicine 等主要章节。"
      },
      {
        "heading": "先分服务类型",
        "body": "手术、影像检查、医学检验或诊疗评估是不同服务类型。准确分类后再阅读对应章节指南。"
      },
      {
        "heading": "正式书籍与授权",
        "body": "本 App 教授合法的查询方法和原创示例，但不复制 AMA 的完整 CPT 代码表或官方代码描述。"
      }
    ],
    "practice": {
      "record": "A physician performed a diagnostic radiology service. The learner opens the Surgery section by habit.",
      "prompt": "应该先核实什么？",
      "explanation": "应先识别服务类别，再到相应的 Radiology 或其他适用章节查找。"
    },
    "questions": [
      {
        "question": "影像服务主要在 CPT 哪一章查找？",
        "options": [
          "Radiology",
          "Surgery only",
          "Pathology only",
          "E/M only"
        ],
        "answer": 0,
        "explanation": "放射服务主要属于 Radiology。"
      },
      {
        "question": "教材以外的完整 CPT 描述可随意复制进 App 吗？",
        "options": [
          "可以",
          "须有适当授权",
          "只要注明来源就可以",
          "只有公开 GitHub 才可以"
        ],
        "answer": 1,
        "explanation": "CPT® 为 AMA 版权内容，正式数据库需要合规授权。"
      }
    ]
  },
  {
    "id": "cpt-foundations:2",
    "unitId": "cpt-foundations",
    "lessonIndex": 2,
    "zh": "Alphabetic Index 查询",
    "objectives": [
      "选择操作名称作为入口",
      "理解索引定位不等于最终定码",
      "检查实际服务细节"
    ],
    "sections": [
      {
        "heading": "先识别实际操作",
        "body": "手术记录里的 approach、anatomy、extent 和 procedure performed 会决定你应该在哪个索引入口查找。"
      },
      {
        "heading": "索引只是起点",
        "body": "从 CPT Index 获得候选范围后，需要进入正文检查代码说明和所有章节指示。"
      },
      {
        "heading": "避免关键词误导",
        "body": "Laparoscopic 和 open 是不同入路；biopsy 和 excision 也不是同义词。关键是实际实施并有文档支持的服务。"
      }
    ],
    "practice": {
      "record": "Operative note: biopsy of skin lesion performed; no complete excision.",
      "prompt": "可以按完整切除术直接查定码吗？",
      "explanation": "不能。病历只明确活检，必须据实际操作核验。"
    },
    "questions": [
      {
        "question": "CPT Index 找到候选后应当？",
        "options": [
          "核对正式代码说明和章节规则",
          "直接提交",
          "用 ICD-10-PCS 自动替换",
          "忽略操作记录"
        ],
        "answer": 0,
        "explanation": "不能仅依索引完成定码。"
      },
      {
        "question": "Biopsy 与 complete excision 可以当作同一操作吗？",
        "options": [
          "可以",
          "不可以",
          "只要都在皮肤上就可以",
          "只有右侧才可以"
        ],
        "answer": 1,
        "explanation": "取样活检和完整切除是不同操作概念。"
      }
    ]
  },
  {
    "id": "cpt-foundations:3",
    "unitId": "cpt-foundations",
    "lessonIndex": 3,
    "zh": "Section Guidelines 与 Parenthetical Notes",
    "objectives": [
      "认识章节指南的重要性",
      "理解括号中的报告说明",
      "将服务记录与代码要求核对"
    ],
    "sections": [
      {
        "heading": "Section Guidelines",
        "body": "每个 CPT 章节或子章节可能有特定报告规则，必须先阅读再选择最终代码。"
      },
      {
        "heading": "Parenthetical Notes",
        "body": "括号说明可能提示额外要求、相关代码或报告限制；不能因为候选代码标题相似就忽略。"
      },
      {
        "heading": "核验路径",
        "body": "完整记录 → 索引 → 相关章节 → 当前代码描述及括号说明 → 修改符和其他规则 → 最终审核。"
      }
    ],
    "practice": {
      "record": "A learner found a candidate surgical code but did not read the adjacent parenthetical instruction.",
      "prompt": "哪些资料可能被遗漏？",
      "explanation": "可能遗漏额外报告条件、相互关系或具体指导，因此应查看完整章节说明。"
    },
    "questions": [
      {
        "question": "Parenthetical instructions 可以忽略吗？",
        "options": [
          "可以",
          "不可以，可能影响代码报告",
          "只在药品编码中重要",
          "只在医保拒赔后才重要"
        ],
        "answer": 1,
        "explanation": "括号说明可能决定报告和核对要求。"
      },
      {
        "question": "哪个流程更合理？",
        "options": [
          "随意搜代码→提交",
          "查索引→核对正式描述和章节说明→审核",
          "只记词根→直接编码",
          "只用疾病名称确定手术"
        ],
        "answer": 1,
        "explanation": "必须以实际服务和当年度 CPT 指南为依据。"
      }
    ]
  }
];
export const findCodingLesson = (id:string) => codingLessonDetails.find(x=>x.id===id);
