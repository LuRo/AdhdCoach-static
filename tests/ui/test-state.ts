import type { Page } from "@playwright/test";

type TestModeSettings = {
  enabled: boolean;
  morningDateEnabled: boolean;
  todaySpeedEnabled: boolean;
};

type QuestionSet = {
  version: number;
  questions: [string, string, string];
  answerOptions: [[string, string, string, string, string], [string, string, string, string, string], [string, string, string, string, string]];
  updatedAt: string;
};

type AppDb = {
  selectedTestDate: string;
  testModeSettings: TestModeSettings;
  questionSets: QuestionSet[];
  plannerByDate: Record<string, unknown>;
  submissionsByDate: Record<string, unknown>;
};

const APP_DB_KEY = "adhd-coach-static-local-db";
const LOCALE_KEY = "adhd-coach-static-locale";
const TRANSLATION_KEY = "adhd-coach-static-translations-enabled";

const DEFAULT_QUESTION_SET: QuestionSet = {
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
  updatedAt: "2026-04-06T00:00:00.000Z"
};

export const createAppDb = (overrides: Partial<AppDb> = {}): AppDb => ({
  selectedTestDate: "2026-04-06",
  testModeSettings: {
    enabled: false,
    morningDateEnabled: false,
    todaySpeedEnabled: false
  },
  questionSets: [DEFAULT_QUESTION_SET],
  plannerByDate: {},
  submissionsByDate: {},
  ...overrides
});

export const seedAppState = async (page: Page, overrides: Partial<AppDb> = {}) => {
  const db = createAppDb(overrides);

  await page.addInitScript(
    ({ appDbKey, localeKey, translationKey, value }) => {
      window.localStorage.setItem(appDbKey, JSON.stringify(value));
      window.localStorage.setItem(localeKey, "en");
      window.localStorage.setItem(translationKey, "true");
    },
    {
      appDbKey: APP_DB_KEY,
      localeKey: LOCALE_KEY,
      translationKey: TRANSLATION_KEY,
      value: db
    }
  );
};
