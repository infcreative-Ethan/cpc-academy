import data from "./book-vocabulary.json";
import {
  MedicalWord,
  WordCategory,
  WordPart,
  words as starterWords,
  wordParts as starterParts,
} from "./words";

type BookTerm = { term: string; pronunciation: string; definition: string; meaning?: string; meaningSource?: string; definitionZh?: string };
type BookPart = { part: string; meaning: string; meaningZh?: string };

const starterByTerm = new Map(starterWords.map((word) => [word.term.toLowerCase(), word]));
const glossaryParts = (data as { parts: BookPart[] }).parts;
const allPartsByKey = new Map<string, WordPart>();
const chineseText = (value: string) => (value.match(/[\u3400-\u9fff][\\u3400-\\u9fff、，；／/（）() ]*/g) ?? []).join("；").trim();
const englishText = (value: string) => value.replace(/[\u3400-\u9fff][\\u3400-\\u9fff、，；／/（）() ]*/g, "").trim();
for (const part of [...glossaryParts, ...starterParts]) {
  const key = part.part.toLowerCase();
  const previous = allPartsByKey.get(key);
  const zh = part.meaningZh || chineseText(part.meaning) || previous?.meaningZh || (previous ? chineseText(previous.meaning) : "");
  const en = englishText(part.meaning) || previous?.meaning || part.meaning;
  allPartsByKey.set(key, { part: part.part, meaning: en, ...(zh ? { meaningZh: zh } : {}) });
}
export const wordParts: WordPart[] = [...allPartsByKey.values()];

function categoryFor(term: string, definition: string): WordCategory {
  const t = term.toLowerCase();
  const d = definition.toLowerCase();
  if (/medical specialty|specialty concerned|study of|specialist|physician who specializes|branch of medicine/.test(d) || /-logy$|-logist$/.test(t)) return "Specialties";
  if (/surgical removal|surgical repair|incision|visual examination|procedure|test that|imaging|radiograph|scan is|catheter|biopsy|endoscopy|-ectomy|-scopy|-tomy|-gram$|-graphy$/.test(d + " " + t)) return "Procedures";
  if (/inflammation|cancer|tumou?r|disease|disorder|syndrome|abnormal condition|infection|-itis$|-oma$|-pathy$|-algia$|-osis$|-emia$/.test(d + " " + t)) return "Conditions";
  if (/heart|blood|brain|nerve|kidney|renal|liver|hepatic|lung|respiratory|bone|muscle|skin|eye|ear|digestive|urinary|reproductive|lymph|endocrine/.test(d)) return "Body Systems";
  return "Foundations";
}

function inferParts(term: string): WordPart[] {
  const compact = term.toLowerCase().replace(/[^a-z]/g, "");
  return wordParts
    .map((part) => {
      const variants = part.part.split(/[,;]/).map((v) => v.toLowerCase().replace(/[^a-z]/g, "")).filter((v) => v.length >= 3);
      const score = Math.max(0, ...variants.filter((v) => compact.includes(v)).map((v) => v.length));
      return { part, score };
    })
    .filter((item) => item.score >= 3)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((item) => item.part);
}

const bookTerms = (data as { terms: BookTerm[] }).terms;
export const words: MedicalWord[] = bookTerms.map((item, index) => {
  const starter = starterByTerm.get(item.term.toLowerCase());
  return {
    id: starter?.id ?? `book-${String(index + 1).padStart(4, "0")}`,
    term: item.term,
    pronunciation: item.pronunciation,
    meaning: starter?.meaning ?? item.meaning ?? "",
    definition: item.definition,
    definitionZh: starter?.definitionZh ?? item.definitionZh ?? "",
    meaningSource: starter?.meaning ? "existing" : item.meaningSource,
    category: starter?.category ?? categoryFor(item.term, item.definition),
    parts: starter?.parts?.length ? starter.parts : inferParts(item.term),
    example: starter?.example ?? "",
    exampleZh: starter?.exampleZh ?? "",
  };
});

const included = new Set(bookTerms.map((item) => item.term.toLowerCase()));
for (const starter of starterWords) {
  if (!included.has(starter.term.toLowerCase())) words.push(starter);
}
