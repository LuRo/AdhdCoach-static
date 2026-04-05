import type { BacklogTask, EnergyLevel, StepId, Task, TodayTask } from "./types";

export type DebriefAnswerValue = 1 | 2 | 3 | 4 | 5;

export interface DebriefQuestionSet {
  version: number;
  questions: [string, string, string];
  updatedAt: string;
}

export interface DebriefSubmission {
  submittedAt: string;
  date: string;
  questionSetVersion: number;
  answers: {
    q1: DebriefAnswerValue;
    q2: DebriefAnswerValue;
    q3: DebriefAnswerValue;
    note?: string;
  };
}

export interface PlannerSnapshot {
  tasks: Task[];
  todayTasks: TodayTask[];
  backlogTasks: BacklogTask[];
  selectedEnergy: EnergyLevel;
  currentStep: StepId;
  tasksLocked: boolean;
}

export interface LocalAppDb {
  selectedTestDate: string;
  questionSets: DebriefQuestionSet[];
  plannerByDate: Record<string, PlannerSnapshot>;
  submissionsByDate: Record<string, DebriefSubmission[]>;
}

const DB_KEY = "adhd-coach-static-local-db";

const DEFAULT_QUESTION_SET: DebriefQuestionSet = {
  version: 1,
  questions: [
    "What helped you stay engaged when the day started to drift?",
    "Where did the work feel heavier than expected?",
    "What recovery move actually helped you get back on task?"
  ],
  updatedAt: new Date().toISOString()
};

const isBrowser = () => typeof window !== "undefined" && typeof window.localStorage !== "undefined";

const isQuestionSet = (value: unknown): value is DebriefQuestionSet => {
  if (!value || typeof value !== "object") return false;
  const candidate = value as DebriefQuestionSet;
  return (
    typeof candidate.version === "number" &&
    Array.isArray(candidate.questions) &&
    candidate.questions.length === 3 &&
    candidate.questions.every((question) => typeof question === "string") &&
    typeof candidate.updatedAt === "string"
  );
};

const normalizeDb = (raw: Partial<LocalAppDb>): LocalAppDb => {
  const questionSets = Array.isArray(raw.questionSets) && raw.questionSets.every(isQuestionSet) ? raw.questionSets : null;
  const legacyQuestionSet = isQuestionSet((raw as { questionSet?: unknown }).questionSet)
    ? (raw as { questionSet?: DebriefQuestionSet }).questionSet
    : null;

  return {
    selectedTestDate: typeof raw.selectedTestDate === "string" ? raw.selectedTestDate : new Date().toISOString().slice(0, 10),
    questionSets: questionSets && questionSets.length > 0 ? questionSets : legacyQuestionSet ? [legacyQuestionSet] : [{ ...DEFAULT_QUESTION_SET }],
    plannerByDate:
      raw.plannerByDate && typeof raw.plannerByDate === "object" ? (raw.plannerByDate as Record<string, PlannerSnapshot>) : {},
    submissionsByDate:
      raw.submissionsByDate && typeof raw.submissionsByDate === "object"
        ? (raw.submissionsByDate as Record<string, DebriefSubmission[]>)
        : {}
  };
};

const readRawDb = (): LocalAppDb => {
  if (!isBrowser()) {
    return {
      selectedTestDate: new Date().toISOString().slice(0, 10),
      questionSets: [{ ...DEFAULT_QUESTION_SET }],
      plannerByDate: {},
      submissionsByDate: {}
    };
  }

  const raw = window.localStorage.getItem(DB_KEY);
  if (!raw) {
    return {
      selectedTestDate: new Date().toISOString().slice(0, 10),
      questionSets: [{ ...DEFAULT_QUESTION_SET }],
      plannerByDate: {},
      submissionsByDate: {}
    };
  }

  try {
    return normalizeDb(JSON.parse(raw) as Partial<LocalAppDb>);
  } catch {
    return {
      selectedTestDate: new Date().toISOString().slice(0, 10),
      questionSets: [{ ...DEFAULT_QUESTION_SET }],
      plannerByDate: {},
      submissionsByDate: {}
    };
  }
};

const writeRawDb = (db: LocalAppDb) => {
  if (!isBrowser()) return;
  window.localStorage.setItem(DB_KEY, JSON.stringify(db));
};

export const getLocalAppDb = () => readRawDb();

export const getSelectedTestDate = () => readRawDb().selectedTestDate;

export const setSelectedTestDate = (selectedTestDate: string) => {
  const db = readRawDb();
  writeRawDb({ ...db, selectedTestDate });
};

export const getQuestionSet = () => {
  const db = readRawDb();
  return db.questionSets[db.questionSets.length - 1] ?? { ...DEFAULT_QUESTION_SET };
};

export const getQuestionSets = () => readRawDb().questionSets;

export const saveQuestionSet = (questions: [string, string, string]) => {
  const db = readRawDb();
  const nextVersion = (db.questionSets[db.questionSets.length - 1]?.version ?? 0) + 1;
  const nextQuestionSet: DebriefQuestionSet = {
    version: nextVersion,
    questions,
    updatedAt: new Date().toISOString()
  };

  writeRawDb({ ...db, questionSets: [...db.questionSets, nextQuestionSet] });
  return nextQuestionSet;
};

export const getPlannerSnapshot = (testDate: string) => readRawDb().plannerByDate[testDate] ?? null;

export const savePlannerSnapshot = (testDate: string, snapshot: PlannerSnapshot) => {
  const db = readRawDb();
  writeRawDb({
    ...db,
    plannerByDate: {
      ...db.plannerByDate,
      [testDate]: snapshot
    }
  });
};

export const getSubmissionsForDate = (testDate: string) => readRawDb().submissionsByDate[testDate] ?? [];

export const appendSubmissionForDate = (testDate: string, submission: DebriefSubmission) => {
  const db = readRawDb();
  const previous = db.submissionsByDate[testDate] ?? [];
  writeRawDb({
    ...db,
    submissionsByDate: {
      ...db.submissionsByDate,
      [testDate]: [...previous, submission]
    }
  });
};

export const getQuestionSetByVersion = (version: number) => {
  const db = readRawDb();
  return db.questionSets.find((entry) => entry.version === version) ?? null;
};

export const getAnswerOptions = () => [
  { value: 1 as const, label: "Not at all" },
  { value: 2 as const, label: "A little" },
  { value: 3 as const, label: "Somewhat" },
  { value: 4 as const, label: "Mostly" },
  { value: 5 as const, label: "Very much" }
];
