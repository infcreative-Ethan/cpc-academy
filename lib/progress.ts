import type { MedicalWord } from "@/lib/words";

export type StudyProgress = {
  knownIds: string[];
  /** Permanently remembers words already introduced on any day or in a chapter. */
  introducedIds: string[];
  /** null for automatic Chapter 1→22 daily sequence; set for a selected chapter session. */
  dailyChapter: number | null;
  customWords: MedicalWord[];
  reviewMode: "dictation" | "zh-en" | "en-zh";
  reviewIds: string[];
  attempts: number;
  correct: number;
  streak: number;
  lastStudyDate: string;
  dailyIds: string[];
  dailyDate: string;
  dailySize: 20 | 30;
  dailyCompletedIds: string[];
  dailyStudyIndex: number;
  dailyStudyStarted: boolean;
  dailyStudyCompleted: boolean;
  reviewRounds: number;
  reviewHistory: { date: string; round: number; correct: number; total: number }[];
};

export const STORAGE_KEY = "cpc-academy-progress-v1";

export const emptyProgress: StudyProgress = {
  knownIds: [],
  introducedIds: [],
  dailyChapter: null,
  customWords: [],
  reviewMode: "dictation",
  reviewIds: [],
  attempts: 0,
  correct: 0,
  streak: 0,
  lastStudyDate: "",
  dailyIds: [],
  dailyDate: "",
  dailySize: 20,
  dailyCompletedIds: [],
  dailyStudyIndex: 0,
  dailyStudyStarted: false,
  dailyStudyCompleted: false,
  reviewRounds: 3,
  reviewHistory: [],
};

export function getTodayKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`;
}

export function loadProgress(): StudyProgress {
  if (typeof window === "undefined") return emptyProgress;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return emptyProgress;
    const old=JSON.parse(saved) as Partial<StudyProgress>;
    return {
      ...emptyProgress,
      ...old,
      // Previous daily learning and known-word states are retained, not erased.
      introducedIds:Array.from(new Set([...(Array.isArray(old.introducedIds)?old.introducedIds:[]),...(Array.isArray(old.dailyCompletedIds)?old.dailyCompletedIds:[])])),
      dailyChapter:Number.isInteger(old.dailyChapter)&&Number(old.dailyChapter)>=1&&Number(old.dailyChapter)<=22?Number(old.dailyChapter):null,
    };
  } catch {
    return emptyProgress;
  }
}

export function saveProgress(progress: StudyProgress) {
  if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}
