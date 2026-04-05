import type { BacklogTask, DaySpeedMultiplier, EnergyLevel, StepId, Task, TodayTask } from "./types";

export type DebriefAnswerValue = 1 | 2 | 3 | 4 | 5;
export type DebriefAnswerOptions = [string, string, string, string, string];
export type DebriefQuestionAnswerOptions = [DebriefAnswerOptions, DebriefAnswerOptions, DebriefAnswerOptions];

export interface DebriefQuestionSet {
  version: number;
  questions: [string, string, string];
  answerOptions: DebriefQuestionAnswerOptions;
  updatedAt: string;
}

export interface TestModeSettings {
  enabled: boolean;
  morningDateEnabled: boolean;
  todaySpeedEnabled: boolean;
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
  testDaySpeed?: DaySpeedMultiplier;
}

export interface LocalAppDb {
  selectedTestDate: string;
  testModeSettings: TestModeSettings;
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
  answerOptions: [
    ["Not at all", "A little", "Somewhat", "Mostly", "Very much"],
    ["Not at all", "A little", "Somewhat", "Mostly", "Very much"],
    ["Not at all", "A little", "Somewhat", "Mostly", "Very much"]
  ],
  updatedAt: new Date().toISOString()
};

export const DEFAULT_TEST_MODE_SETTINGS: TestModeSettings = {
  enabled: false,
  morningDateEnabled: false,
  todaySpeedEnabled: false
};

const isBrowser = () => typeof window !== "undefined" && typeof window.localStorage !== "undefined";

const isAnswerOptions = (value: unknown): value is DebriefAnswerOptions =>
  Array.isArray(value) && value.length === 5 && value.every((option) => typeof option === "string");

const normalizeAnswerOptions = (value: unknown): DebriefAnswerOptions => {
  if (isAnswerOptions(value)) {
    return [...value] as DebriefAnswerOptions;
  }

  return [...DEFAULT_QUESTION_SET.answerOptions[0]] as DebriefAnswerOptions;
};

const normalizeQuestionAnswerOptions = (value: unknown): DebriefQuestionAnswerOptions => {
  if (Array.isArray(value) && value.length === 3) {
    const [q1, q2, q3] = value;
    if (isAnswerOptions(q1) && isAnswerOptions(q2) && isAnswerOptions(q3)) {
      return [
        [...q1] as DebriefAnswerOptions,
        [...q2] as DebriefAnswerOptions,
        [...q3] as DebriefAnswerOptions
      ];
    }

    if (isAnswerOptions(q1)) {
      const normalized = [...q1] as DebriefAnswerOptions;
      return [normalized, [...normalized] as DebriefAnswerOptions, [...normalized] as DebriefAnswerOptions];
    }
  }

  if (isAnswerOptions(value)) {
    const normalized = [...value] as DebriefAnswerOptions;
    return [normalized, [...normalized] as DebriefAnswerOptions, [...normalized] as DebriefAnswerOptions];
  }

  return [
    [...DEFAULT_QUESTION_SET.answerOptions[0]] as DebriefAnswerOptions,
    [...DEFAULT_QUESTION_SET.answerOptions[1]] as DebriefAnswerOptions,
    [...DEFAULT_QUESTION_SET.answerOptions[2]] as DebriefAnswerOptions
  ];
};

const normalizeTestModeSettings = (value: unknown): TestModeSettings => {
  if (!value || typeof value !== "object") {
    return { ...DEFAULT_TEST_MODE_SETTINGS };
  }

  const candidate = value as Partial<TestModeSettings>;
  const enabled = typeof candidate.enabled === "boolean" ? candidate.enabled : DEFAULT_TEST_MODE_SETTINGS.enabled;

  return {
    enabled,
    morningDateEnabled: enabled && candidate.morningDateEnabled === true,
    todaySpeedEnabled: enabled && candidate.todaySpeedEnabled === true
  };
};

const normalizeQuestionSet = (value: unknown): DebriefQuestionSet | null => {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<DebriefQuestionSet> & { answerOptions?: unknown };

  if (
    typeof candidate.version !== "number" ||
    !Array.isArray(candidate.questions) ||
    candidate.questions.length !== 3 ||
    !candidate.questions.every((question) => typeof question === "string") ||
    typeof candidate.updatedAt !== "string"
  ) {
    return null;
  }

  return {
    version: candidate.version,
    questions: [candidate.questions[0], candidate.questions[1], candidate.questions[2]],
    answerOptions: normalizeQuestionAnswerOptions(candidate.answerOptions),
    updatedAt: candidate.updatedAt
  };
};

const normalizeDb = (raw: Partial<LocalAppDb>): LocalAppDb => {
  const questionSets = Array.isArray(raw.questionSets)
    ? raw.questionSets.map(normalizeQuestionSet).filter((entry): entry is DebriefQuestionSet => entry !== null)
    : null;
  const legacyQuestionSet = normalizeQuestionSet((raw as { questionSet?: unknown }).questionSet);

  return {
    selectedTestDate: typeof raw.selectedTestDate === "string" ? raw.selectedTestDate : new Date().toISOString().slice(0, 10),
    testModeSettings: normalizeTestModeSettings(raw.testModeSettings),
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
      testModeSettings: { ...DEFAULT_TEST_MODE_SETTINGS },
      questionSets: [{ ...DEFAULT_QUESTION_SET }],
      plannerByDate: {},
      submissionsByDate: {}
    };
  }

  const raw = window.localStorage.getItem(DB_KEY);
  if (!raw) {
    return {
      selectedTestDate: new Date().toISOString().slice(0, 10),
      testModeSettings: { ...DEFAULT_TEST_MODE_SETTINGS },
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
      testModeSettings: { ...DEFAULT_TEST_MODE_SETTINGS },
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

export const getTestModeSettings = () => readRawDb().testModeSettings;

export const setTestModeSettings = (testModeSettings: TestModeSettings) => {
  const db = readRawDb();
  writeRawDb({ ...db, testModeSettings: normalizeTestModeSettings(testModeSettings) });
};

export const getQuestionSet = () => {
  const db = readRawDb();
  return db.questionSets[db.questionSets.length - 1] ?? { ...DEFAULT_QUESTION_SET };
};

export const getQuestionSets = () => readRawDb().questionSets;

export const saveQuestionSet = (questions: [string, string, string], answerOptions: DebriefQuestionAnswerOptions = getQuestionSet().answerOptions) => {
  const db = readRawDb();
  const nextVersion = (db.questionSets[db.questionSets.length - 1]?.version ?? 0) + 1;
  const nextQuestionSet: DebriefQuestionSet = {
    version: nextVersion,
    questions,
    answerOptions,
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
      [testDate]: [submission]
    }
  });
};

export const getQuestionSetByVersion = (version: number) => {
  const db = readRawDb();
  return db.questionSets.find((entry) => entry.version === version) ?? null;
};

export const getAnswerOptionsForQuestion = (questionIndex: 0 | 1 | 2) => getQuestionSet().answerOptions[questionIndex];

export const getAnswerOptionsForQuestionByVersion = (version: number, questionIndex: 0 | 1 | 2) =>
  getQuestionSetByVersion(version)?.answerOptions[questionIndex] ?? DEFAULT_QUESTION_SET.answerOptions[questionIndex];

export const getAnswerOptions = (locale: "en" | "de" | "fr"): Array<{ value: DebriefAnswerValue; label: string }> => {
  const labels =
    locale === "de"
      ? ["Gar nicht", "Ein wenig", "Etwas", "Größtenteils", "Sehr"]
      : locale === "fr"
        ? ["Pas du tout", "Un peu", "Assez", "Surtout", "Tout à fait"]
        : ["Not at all", "A little", "Somewhat", "Mostly", "Very much"];

  return labels.map((label, index) => ({ value: (index + 1) as DebriefAnswerValue, label }));
};
