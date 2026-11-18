export type Chapter = {
  number: number;
  title: string;
  phase: "Foundation" | "Body Systems" | "Specialties";
  topics: string[];
  codingConnection: string;
};

export const chapters: Chapter[] = [
  { number: 1, title: "Basic Word Structure", phase: "Foundation", topics: ["Objectives in studying the medical language", "Word analysis"], codingConnection: "Break unfamiliar diagnoses, procedures, and anatomical terms into combining forms, prefixes, and suffixes." },
  { number: 2, title: "Terms Pertaining to the Body as a Whole", phase: "Foundation", topics: ["Structural organization of the body", "Abdominopelvic regions and quadrants", "Divisions of the back (spinal column)", "Positional and directional terms", "Planes of the body"], codingConnection: "Recognize body region, laterality, direction, depth, and anatomical planes in documentation." },
  { number: 3, title: "Suffixes", phase: "Foundation", topics: ["Introduction", "A closer look"], codingConnection: "Interpret word endings that describe conditions, procedures, specialties, and diagnostic findings." },
  { number: 4, title: "Prefixes", phase: "Foundation", topics: ["Introduction", "A closer look"], codingConnection: "Interpret location, number, timing, degree, and negation when reading clinical language." },
  { number: 5, title: "Digestive System", phase: "Body Systems", topics: ["Introduction", "Anatomy and physiology", "Pathology of the digestive system", "Pathologic conditions"], codingConnection: "Understand digestive anatomy and diagnoses before reviewing documented gastrointestinal services." },
  { number: 6, title: "Additional Suffixes and Digestive System Terminology", phase: "Body Systems", topics: ["Introduction", "Laboratory tests and clinical procedures"], codingConnection: "Connect terminology with documented tests and procedures; distinguish a test from a diagnosis." },
  { number: 7, title: "Urinary System", phase: "Body Systems", topics: ["Introduction", "Anatomy of the major organs", "How the kidneys produce urine", "Urinalysis", "Pathologic terminology", "Laboratory tests and clinical procedures"], codingConnection: "Recognize kidney, ureter, bladder, and urethral terms and the tests or procedures documented." },
  { number: 8, title: "Female Reproductive System", phase: "Body Systems", topics: ["Introduction", "Organs of the female reproductive system", "Menstruation and pregnancy", "Gynecologic, breast, pregnancy, and neonatal pathology", "Clinical tests and procedures"], codingConnection: "Identify the documented organ, pregnancy context, and specific clinical service without inferring details." },
  { number: 9, title: "Male Reproductive System", phase: "Body Systems", topics: ["Introduction", "Anatomy", "Pathologic conditions and sexually transmitted infections", "Laboratory tests and clinical procedures"], codingConnection: "Distinguish anatomy, infection terminology, and the service actually performed." },
  { number: 10, title: "Nervous System", phase: "Body Systems", topics: ["Introduction", "General structure", "Neurons, nerves, and glial cells", "The brain", "The spinal cord and meninges", "Pathology", "Laboratory tests and clinical procedures"], codingConnection: "Interpret central and peripheral nervous system documentation, anatomical sites, and diagnostic services." },
  { number: 11, title: "Cardiovascular System", phase: "Body Systems", topics: ["Introduction", "Blood vessels and circulation", "Anatomy of the heart", "Physiology of the heart", "Blood pressure", "Heart and blood-vessel pathology", "Laboratory tests and clinical procedures"], codingConnection: "Understand heart chambers, vessels, circulation, and the distinction between symptoms and provider-documented diagnoses." },
  { number: 12, title: "Respiratory System", phase: "Body Systems", topics: ["Introduction", "Anatomy and physiology of respiration", "Pathology", "Clinical procedures"], codingConnection: "Recognize upper and lower respiratory anatomy, documented disease, and respiratory services." },
  { number: 13, title: "Blood System", phase: "Body Systems", topics: ["Introduction", "Composition and formation of blood", "Blood types", "Blood clotting", "Pathology", "Laboratory tests and clinical procedures"], codingConnection: "Interpret hematology terminology and laboratory findings while relying on provider documentation for diagnoses." },
  { number: 14, title: "Lymphatic and Immune Systems", phase: "Body Systems", topics: ["Introduction", "Lymphatic system", "Immune system", "Pathologic conditions", "Laboratory tests and clinical procedures"], codingConnection: "Identify lymphatic structures, immune conditions, and relevant diagnostic or therapeutic services." },
  { number: 15, title: "Musculoskeletal System", phase: "Body Systems", topics: ["Introduction", "Bones and bone pathology", "Joints and joint pathology", "Muscles and muscle pathology", "Laboratory tests and clinical procedures"], codingConnection: "Read bone, joint, tendon, ligament, and muscle documentation; capture site, laterality, and operative detail." },
  { number: 16, title: "Skin", phase: "Body Systems", topics: ["Introduction", "Anatomy of the skin", "Accessory structures of the skin", "Pathology", "Laboratory tests and clinical procedures"], codingConnection: "Understand skin layers, lesions, wound descriptions, and the exact service documented." },
  { number: 17, title: "Sense Organs: The Eye and the Ear", phase: "Body Systems", topics: ["Introduction", "The eye and errors of refraction", "Eye pathology and clinical procedures", "The ear, ear pathology, and clinical procedures"], codingConnection: "Recognize eye and ear anatomy, laterality, and diagnostic or procedural language." },
  { number: 18, title: "Endocrine System", phase: "Body Systems", topics: ["Introduction", "Thyroid and parathyroid glands", "Adrenal glands", "Pancreas", "Pituitary gland", "Ovaries and testes", "Pathology", "Laboratory tests and clinical procedures"], codingConnection: "Connect endocrine glands, hormones, disorders, and documented laboratory or procedural services." },
  { number: 19, title: "Cancer Medicine (Oncology)", phase: "Specialties", topics: ["Introduction", "Characteristics of tumors", "Carcinogenesis", "Classification of cancerous tumors", "Pathologic descriptions", "Grading and staging", "Cancer treatment", "Laboratory tests and clinical procedures"], codingConnection: "Distinguish tumor behavior, primary and secondary sites, pathology language, and treatment documentation." },
  { number: 20, title: "Radiology and Nuclear Medicine", phase: "Specialties", topics: ["Introduction", "Radiology", "Nuclear medicine"], codingConnection: "Identify the imaging modality, body area, contrast details, and service actually performed." },
  { number: 21, title: "Pharmacology", phase: "Specialties", topics: ["Introduction", "Drug names, standards, and references", "Administration of drugs", "Drug actions and interactions", "Drug toxicity", "Classes of drugs"], codingConnection: "Recognize generic and brand names, drug classes, dosage documentation, and medication-related services." },
  { number: 22, title: "Psychiatry", phase: "Specialties", topics: ["Introduction", "Psychiatric clinical symptoms", "Psychiatric disorders", "Therapeutic modalities"], codingConnection: "Distinguish symptoms, established disorders, and documented behavioral-health services." },
];

export const appendices = [
  "Mini-Dictionary",
  "Glossary",
  "Appendix I — Plurals",
  "Appendix II — Abbreviations, Symbols, Acronyms, and Eponyms",
  "Appendix III — Normal Hematologic Reference Values and Implications of Abnormal Results",
  "Appendix IV — Drugs",
  "Index",
];

export const bodySystems = [
  { id: "digestive", name: "Digestive", zh: "消化系统", chapters: "5–6", structures: ["Esophagus", "Stomach", "Small and large intestine", "Liver, gallbladder, pancreas"], focus: "Differentiate organ, condition, test, and operative terminology." },
  { id: "urinary", name: "Urinary", zh: "泌尿系统", chapters: "7", structures: ["Kidneys", "Ureters", "Urinary bladder", "Urethra"], focus: "Identify the exact urinary structure and the documented test or procedure." },
  { id: "reproductive", name: "Reproductive", zh: "生殖系统", chapters: "8–9", structures: ["Ovaries and uterus", "Fallopian tubes", "Prostate", "Testes and vas deferens"], focus: "Pay attention to anatomical site, pregnancy context, and laterality when documented." },
  { id: "nervous", name: "Nervous", zh: "神经系统", chapters: "10", structures: ["Brain", "Spinal cord", "Meninges", "Peripheral nerves"], focus: "Distinguish central from peripheral structures and symptoms from confirmed diagnoses." },
  { id: "cardiovascular", name: "Cardiovascular", zh: "心血管系统", chapters: "11", structures: ["Heart chambers and valves", "Arteries", "Veins", "Coronary circulation"], focus: "Understand the site and type of cardiovascular condition or service documented." },
  { id: "respiratory", name: "Respiratory", zh: "呼吸系统", chapters: "12", structures: ["Nasal cavity", "Pharynx and larynx", "Trachea and bronchi", "Lungs and alveoli"], focus: "Separate respiratory symptoms, provider diagnoses, and imaging or procedure records." },
  { id: "blood-immune", name: "Blood, Lymphatic & Immune", zh: "血液、淋巴与免疫", chapters: "13–14", structures: ["Blood cells and plasma", "Bone marrow", "Lymph nodes and vessels", "Immune organs"], focus: "Read hematology and immune terminology; do not independently diagnose from lab values." },
  { id: "musculoskeletal", name: "Musculoskeletal", zh: "肌肉骨骼系统", chapters: "15", structures: ["Bones", "Joints and cartilage", "Tendons and ligaments", "Skeletal muscles"], focus: "Capture exact site, side, structure, approach, and operative details from the record." },
  { id: "skin", name: "Skin", zh: "皮肤", chapters: "16", structures: ["Epidermis", "Dermis", "Hair and nails", "Sweat and sebaceous glands"], focus: "Differentiate lesion description, pathology, and the service actually performed." },
  { id: "senses", name: "Eye & Ear", zh: "感觉器官", chapters: "17", structures: ["Eye and ocular structures", "Retina and optic nerve", "External, middle, and inner ear", "Auditory nerve"], focus: "Check laterality and the specific anatomical structure documented." },
  { id: "endocrine", name: "Endocrine", zh: "内分泌系统", chapters: "18", structures: ["Pituitary", "Thyroid and parathyroids", "Adrenal glands", "Pancreas and gonads"], focus: "Connect gland, hormone, condition, and laboratory or procedural documentation." },
  { id: "oncology", name: "Oncology", zh: "肿瘤学", chapters: "19", structures: ["Primary and secondary sites", "Tumor behavior", "Histology", "Grade and stage"], focus: "Do not infer malignancy, site, or status beyond the pathology and provider record." },
];

export const codeSets = [
  { name: "ICD-10-CM", zh: "诊断编码", purpose: "Classifies diagnoses, conditions, symptoms, and reasons for encounters in U.S. clinical settings.", workflow: ["Start with the Alphabetic Index", "Verify the candidate in the Tabular List", "Read inclusion, exclusion, and instructional notes", "Check specificity, laterality, encounter details, and the applicable year"], source: "CMS / CDC official files and guidelines" },
  { name: "CPT®", zh: "医疗服务与操作", purpose: "Reports physician and qualified-health-professional services and procedures, including surgery, radiology, pathology/laboratory, medicine, and evaluation and management.", workflow: ["Identify the service actually documented", "Use the current licensed CPT® index and codebook", "Read section guidelines and parenthetical instructions", "Verify modifiers, bundling edits, and payer-specific requirements"], source: "AMA CPT® Professional Edition and authorized resources" },
  { name: "HCPCS Level II", zh: "用品、药物与设备", purpose: "Describes many products, supplies, drugs, durable medical equipment, and services not represented by CPT® Level I.", workflow: ["Identify the item, drug, supply, or service", "Check the current CMS alpha-numeric file", "Verify unit, dosage, descriptor, and applicable modifier", "Check the effective date and quarterly update"], source: "CMS official quarterly update files" },
];

export const practiceCases = [
  {
    id: "knee-arthroscopy",
    title: "Right knee — outpatient procedure",
    system: "Musculoskeletal",
    level: "入门",
    record: "A patient reports pain in the right knee. The provider documents a medial meniscal tear. The operative report states that an arthroscopic partial meniscectomy was performed on the right knee.",
    focus: "Laterality · diagnosis vs procedure · operative documentation",
    questions: [
      { prompt: "Which side is explicitly documented?", options: ["Right", "Left", "Bilateral", "Not documented"], answer: 0, explanation: "The record explicitly states right knee. Preserve laterality exactly as documented; do not generalize it away." },
      { prompt: "Which code set is used to report the diagnosis?", options: ["CPT®", "ICD-10-CM", "HCPCS Level II", "Place of Service"], answer: 1, explanation: "ICD-10-CM is the U.S. clinical modification used for diagnosis coding." },
      { prompt: "Which code set is used to report the arthroscopic procedure?", options: ["ICD-10-CM", "HCPCS Level II only", "CPT®", "NDC"], answer: 2, explanation: "CPT® is used to report physician and qualified-health-professional procedures and services. Exact code selection requires the current licensed codebook and full operative details." },
      { prompt: "Can the exact procedure code be selected from the phrase 'knee scope' alone?", options: ["Yes, all knee scopes use one code", "No, review the operative report and current CPT® guidance", "Yes, laterality alone is enough", "Use the diagnosis code instead"], answer: 1, explanation: "The specific work performed, structures treated, approach, and codebook instructions matter. Never assign a code from a vague shorthand phrase." },
    ],
  },
  {
    id: "respiratory-imaging",
    title: "Respiratory — office visit and imaging",
    system: "Respiratory",
    level: "入门",
    record: "A patient presents with cough and fever. The provider documents acute bronchitis. A two-view chest radiograph is ordered, performed, and interpreted.",
    focus: "Documented diagnosis · radiology service · record components",
    questions: [
      { prompt: "Which condition is explicitly documented by the provider?", options: ["Pneumonia", "Acute bronchitis", "Asthma", "Pulmonary embolism"], answer: 1, explanation: "Use the provider's documented diagnosis. Do not replace it with a different condition based on symptoms alone." },
      { prompt: "Which code set is used for the diagnosis?", options: ["ICD-10-CM", "CPT®", "HCPCS Level II", "NDC"], answer: 0, explanation: "The diagnosis is reported using ICD-10-CM, following the applicable outpatient rules and documentation." },
      { prompt: "Which code set generally reports the radiology service?", options: ["ICD-10-CM", "CPT®", "The drug formulary", "No code set"], answer: 1, explanation: "CPT® contains radiology services. Verify the exact service and current codebook guidance." },
      { prompt: "What should the coder verify before finalizing the imaging service?", options: ["Only the patient's age", "The documented views, interpretation/report, and service performed", "The patient's preferred pharmacy", "A presumed diagnosis not in the record"], answer: 1, explanation: "Code selection must reflect the documented service and required components. Do not infer missing elements." },
    ],
  },
  {
    id: "gallbladder-surgery",
    title: "Digestive — laparoscopic procedure",
    system: "Digestive",
    level: "基础",
    record: "A patient with symptomatic gallstones undergoes laparoscopic cholecystectomy. The operative note documents the approach and removal of the gallbladder.",
    focus: "Medical terminology · procedure identification · operative report",
    questions: [
      { prompt: "What does cholecystectomy mean?", options: ["Removal of the gallbladder", "Inflammation of the liver", "Imaging of the pancreas", "Repair of the stomach"], answer: 0, explanation: "Cholecyst/o refers to the gallbladder and -ectomy means surgical removal." },
      { prompt: "Which code set is used to report the diagnosis?", options: ["CPT®", "ICD-10-CM", "HCPCS Level II", "NDC"], answer: 1, explanation: "Diagnosis coding uses ICD-10-CM." },
      { prompt: "Which code set is used to report the surgeon's procedure?", options: ["CPT®", "ICD-10-CM", "A laboratory reference range", "A drug index"], answer: 0, explanation: "CPT® is the professional procedure/service code set. The exact code must be verified in the current licensed edition." },
      { prompt: "Which source is most important for confirming the approach and work performed?", options: ["The patient's problem list alone", "The operative report", "A generic web search", "The appointment reminder"], answer: 1, explanation: "The operative report describes the actual procedure. Review the complete record and current coding instructions." },
    ],
  },
  {
    id: "durable-equipment",
    title: "HCPCS — medical equipment",
    system: "Supplies & Equipment",
    level: "基础",
    record: "After a documented mobility assessment, a clinician orders a walker and a knee orthosis for the patient to use at home. The supplier's record identifies the items provided.",
    focus: "HCPCS Level II · item description · supporting documentation",
    questions: [
      { prompt: "Which code set is commonly used for many durable medical equipment and supply items?", options: ["ICD-10-CM", "CPT® only", "HCPCS Level II", "ICD-10-PCS"], answer: 2, explanation: "HCPCS Level II covers many products, supplies, drugs, and durable medical equipment." },
      { prompt: "What should be checked before assigning an item code?", options: ["The exact item, documentation, units, and current descriptor", "Only the diagnosis name", "A guessed product category", "The patient's preferred brand"], answer: 0, explanation: "Verify the actual item furnished, supporting documentation, units, and current CMS file." },
      { prompt: "How often should the coder check HCPCS Level II updates?", options: ["Never", "Only every five years", "Quarterly update files and effective dates", "Only when a patient asks"], answer: 2, explanation: "CMS publishes HCPCS Level II quarterly updates. Always use the file effective for the date of service." },
    ],
  },
];

export const officialResources = [
  { label: "AAPC — CPC certification overview", url: "https://www.aapc.com/certifications/cpc", note: "CPC scope, core knowledge, and certification information." },
  { label: "AAPC — CPC exam format and approved code books", url: "https://www.aapc.com/certifications/cpc-and-cpb/taking-the-cpc-and-cpb-exams", note: "Exam format and approved reference-book information." },
  { label: "CMS — ICD-10 code files", url: "https://www.cms.gov/medicare/coding-billing/ICD-10-codes", note: "Official U.S. ICD-10-CM / ICD-10-PCS releases and updates." },
  { label: "CDC — ICD-10-CM files", url: "https://www.cdc.gov/nchs/icd/icd-10-cm/files.html", note: "Official ICD-10-CM release files and effective dates." },
  { label: "CMS — HCPCS quarterly updates", url: "https://www.cms.gov/medicare/coding-billing/healthcare-common-procedure-system/quarterly-update", note: "Official HCPCS Level II alpha-numeric files and effective dates." },
  { label: "AMA — CPT licensing FAQs", url: "https://www.ama-assn.org/practice-management/cpt/cpt-licensing-frequently-asked-questions-faqs", note: "CPT® copyright, licensing, and electronic-product use requirements." },
];
