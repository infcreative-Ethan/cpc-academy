export type StudyProgress = {
  knownIds: string[];
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
    return saved ? { ...emptyProgress, ...JSON.parse(saved) } : emptyProgress;
  } catch {
    return emptyProgress;
  }
}

export function saveProgress(progress: StudyProgress) {
  if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}
