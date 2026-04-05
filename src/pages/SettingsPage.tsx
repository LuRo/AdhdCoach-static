import { useState } from "react";
import { useI18n } from "../i18n";
import { CoachBadge } from "../shared/components/atoms/CoachBadge";
import { CoachButton } from "../shared/components/atoms/CoachButton";
import { SectionCard } from "../shared/components/atoms/SectionCard";
import {
  getQuestionSet,
  saveQuestionSet,
  type DebriefAnswerOptions,
  type DebriefQuestionAnswerOptions,
  type TestModeSettings
} from "../features/morning/store";

interface Props {
  onClose: () => void;
  selectedTestDate: string;
  testDaySpeed: 1 | 10 | 20 | 50 | 100;
  testModeSettings: TestModeSettings;
  onTestModeSettingsChange: (settings: TestModeSettings) => void;
}

const cloneAnswerOptions = (answerOptions: DebriefQuestionAnswerOptions): DebriefQuestionAnswerOptions => [
  [...answerOptions[0]] as DebriefAnswerOptions,
  [...answerOptions[1]] as DebriefAnswerOptions,
  [...answerOptions[2]] as DebriefAnswerOptions
];

const formatDate = (value: string, locale: string) => new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(value));

const formatDateTime = (value: string, locale: string) => new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));

const emptyTestModes: TestModeSettings = {
  enabled: false,
  morningDateEnabled: false,
  todaySpeedEnabled: false
};

export const SettingsPage = ({ onClose, selectedTestDate, testDaySpeed, testModeSettings, onTestModeSettingsChange }: Props) => {
  const { copy, locale } = useI18n();
  const [savedQuestionSet, setSavedQuestionSet] = useState(() => getQuestionSet());
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<0 | 1 | 2>(0);
  const [questionDrafts, setQuestionDrafts] = useState<[string, string, string]>(savedQuestionSet.questions);
  const [answerDrafts, setAnswerDrafts] = useState<DebriefQuestionAnswerOptions>(cloneAnswerOptions(savedQuestionSet.answerOptions));
  const [version, setVersion] = useState(savedQuestionSet.version);
  const [savedAt, setSavedAt] = useState(savedQuestionSet.updatedAt);

  const updateQuestion = (index: 0 | 1 | 2, value: string) => {
    setQuestionDrafts((previous) => {
      const next = [...previous] as [string, string, string];
      next[index] = value;
      return next;
    });
  };

  const updateAnswer = (questionIndex: 0 | 1 | 2, answerIndex: 0 | 1 | 2 | 3 | 4, value: string) => {
    setAnswerDrafts((previous) => {
      const next = cloneAnswerOptions(previous);
      next[questionIndex][answerIndex] = value;
      return next;
    });
  };

  const handleSave = () => {
    const next = saveQuestionSet(questionDrafts, answerDrafts);
    setSavedQuestionSet(next);
    setQuestionDrafts(next.questions);
    setAnswerDrafts(cloneAnswerOptions(next.answerOptions));
    setVersion(next.version);
    setSavedAt(next.updatedAt);
  };

  const handleReset = () => {
    setQuestionDrafts(savedQuestionSet.questions);
    setAnswerDrafts(cloneAnswerOptions(savedQuestionSet.answerOptions));
  };

  const handleMasterToggle = (enabled: boolean) => {
    onTestModeSettingsChange(
      enabled
        ? {
            ...testModeSettings,
            enabled: true
          }
        : { ...emptyTestModes }
    );
  };

  const handleMorningToggle = (morningDateEnabled: boolean) => {
    onTestModeSettingsChange({
      ...testModeSettings,
      enabled: true,
      morningDateEnabled
    });
  };

  const handleTodaySpeedToggle = (todaySpeedEnabled: boolean) => {
    onTestModeSettingsChange({
      ...testModeSettings,
      enabled: true,
      todaySpeedEnabled
    });
  };

  const activeAnswerDrafts = answerDrafts[activeQuestionIndex];
  const showIndividualModes = testModeSettings.enabled;

  return (
    <section className="section-panel active" id="settings-panel" aria-labelledby="settings-page-title" role="tabpanel" data-testid="settings-page">
      <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3 mb-4">
        <div className="d-flex flex-column gap-2">
          <p className="text-uppercase small fw-semibold text-secondary mb-0">{copy.settings.sectionLabel}</p>
          <h1 id="settings-page-title" className="h2 mb-0">
            {copy.settings.title}
          </h1>
          <p className="text-secondary mb-0">{copy.settings.description}</p>
        </div>

        <CoachButton type="button" variant="outline" onClick={onClose} aria-label={copy.settings.closeAria} testId="settings-close-button">
          {copy.common.close}
        </CoachButton>
      </div>

      <SectionCard className="p-4 p-lg-5 mb-4">
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
          <div>
            <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
              <CoachBadge tone={testModeSettings.enabled ? "purple" : "warning"} className="rounded-pill px-3 py-2">
                {copy.settings.testModeBadge}
              </CoachBadge>
              <span className="small text-secondary">{testModeSettings.enabled ? copy.settings.toggleOn : copy.settings.toggleOff}</span>
            </div>
            <h2 className="h4 mb-2">{copy.settings.masterHeading}</h2>
            <p className="text-secondary mb-0">{copy.settings.masterDescription}</p>
          </div>
          <div className="text-end small text-secondary">
            <div>{copy.settings.storedCurrentDay}</div>
            <div className="fw-semibold text-dark">{formatDate(selectedTestDate, locale)}</div>
          </div>
        </div>

        <div className="d-grid gap-3">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 p-3 rounded-4 border">
            <div>
              <div className="fw-semibold">{copy.settings.masterSwitchTitle}</div>
              <div className="small text-secondary">{copy.settings.masterSwitchDescription}</div>
            </div>
            <div className="form-check form-switch m-0">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="test-mode-enabled"
                data-testid="settings-test-mode-master-switch"
                checked={testModeSettings.enabled}
                onChange={(event) => handleMasterToggle(event.target.checked)}
              />
              <label className="form-check-label small fw-semibold" htmlFor="test-mode-enabled">
                {testModeSettings.enabled ? copy.settings.toggleOn : copy.settings.toggleOff}
              </label>
            </div>
          </div>

          {showIndividualModes ? (
            <>
              <div className="d-grid gap-3 p-3 rounded-4 border">
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
                  <div>
                    <div className="fw-semibold">{copy.settings.morningModeTitle}</div>
                    <div className="small text-secondary">{copy.settings.morningModeDescription}</div>
                  </div>
                  <div className="form-check form-switch m-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="test-mode-morning-date"
                      data-testid="settings-test-mode-morning-date-switch"
                      checked={testModeSettings.morningDateEnabled}
                      onChange={(event) => handleMorningToggle(event.target.checked)}
                    />
                    <label className="form-check-label small fw-semibold" htmlFor="test-mode-morning-date">
                      {testModeSettings.morningDateEnabled ? copy.settings.toggleOn : copy.settings.toggleOff}
                    </label>
                  </div>
                </div>
              </div>

              <div className="d-grid gap-3 p-3 rounded-4 border">
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
                  <div>
                    <div className="fw-semibold">{copy.settings.todaySpeedTitle}</div>
                    <div className="small text-secondary">{copy.settings.todaySpeedDescription}</div>
                  </div>
                  <div className="form-check form-switch m-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="test-mode-today-speed"
                      data-testid="settings-test-mode-today-speed-switch"
                      checked={testModeSettings.todaySpeedEnabled}
                      onChange={(event) => handleTodaySpeedToggle(event.target.checked)}
                    />
                    <label className="form-check-label small fw-semibold" htmlFor="test-mode-today-speed">
                      {testModeSettings.todaySpeedEnabled ? copy.settings.toggleOn : copy.settings.toggleOff}
                    </label>
                  </div>
                </div>
                <div className="small text-secondary">
                  {copy.settings.activeSpeedLabel}: {testModeSettings.todaySpeedEnabled ? `${testDaySpeed}x` : copy.settings.liveSpeed}
                </div>
              </div>
            </>
          ) : (
            <div className="alert alert-info mb-0">{copy.settings.testOptionsHidden}</div>
          )}
        </div>
      </SectionCard>

      <SectionCard className="p-4 p-lg-5 mb-4">
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
          <div>
            <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
              <CoachBadge tone="purple" className="rounded-pill px-3 py-2">{copy.settings.debriefBadge}</CoachBadge>
              <span className="small text-secondary">
                {copy.settings.versionLabel} {version}
              </span>
            </div>
            <h2 className="h4 mb-2">{copy.settings.questionSetHeading}</h2>
            <p className="text-secondary mb-0">{copy.settings.questionSetDescription}</p>
          </div>
          <div className="text-end small text-secondary">
            <div>{copy.settings.lastUpdated}</div>
            <div className="fw-semibold text-dark">{formatDateTime(savedAt, locale)}</div>
          </div>
        </div>

        <div className="d-flex flex-wrap gap-2 mb-4" data-testid="settings-question-tabs">
          {questionDrafts.map((question, index) => (
            <button
              key={index}
              type="button"
              className={`btn ${activeQuestionIndex === index ? "btn-purple" : "btn-outline-purple"}`}
              data-testid={`settings-question-tab-question-${index + 1}`}
              onClick={() => setActiveQuestionIndex(index as 0 | 1 | 2)}
            >
              {copy.settings.questionLabel.replace("{{index}}", String(index + 1))}
            </button>
          ))}
        </div>

        <div className="d-grid gap-4">
          <div className="d-grid gap-3">
            <label className="d-grid gap-1">
              <span className="small text-secondary fw-semibold">
                {copy.settings.questionLabel.replace("{{index}}", String(activeQuestionIndex + 1))}
              </span>
              <input
                className="form-control"
                data-testid={`settings-question-${activeQuestionIndex + 1}-input`}
                value={questionDrafts[activeQuestionIndex]}
                onChange={(event) => updateQuestion(activeQuestionIndex, event.target.value)}
              />
            </label>
          </div>

          <div className="d-grid gap-3">
            <div className="d-flex flex-wrap align-items-center gap-2">
              <CoachBadge tone="purple" className="rounded-pill px-3 py-2">{copy.settings.answerLabelsBadge}</CoachBadge>
              <span className="small text-secondary">{copy.settings.answerLabelsUsedFor.replace("{{index}}", String(activeQuestionIndex + 1))}</span>
            </div>
            {activeAnswerDrafts.map((answer, index) => (
              <label key={index} className="d-grid gap-1">
                <span className="small text-secondary fw-semibold">{copy.settings.answerLabel.replace("{{index}}", String(index + 1))}</span>
                <input
                  className="form-control"
                  data-testid={`settings-question-${activeQuestionIndex + 1}-answer-${index + 1}-input`}
                  value={answer}
                  onChange={(event) => updateAnswer(activeQuestionIndex, index as 0 | 1 | 2 | 3 | 4, event.target.value)}
                />
              </label>
            ))}
          </div>
        </div>

        <div className="d-flex flex-wrap gap-2 mt-4">
          <CoachButton type="button" testId="settings-save-question-set-button" onClick={handleSave}>
            {copy.settings.saveQuestionSet}
          </CoachButton>
          <CoachButton type="button" variant="outline" testId="settings-reset-question-set-button" onClick={handleReset}>
            {copy.settings.resetToSaved}
          </CoachButton>
        </div>
      </SectionCard>

      <SectionCard className="p-4 p-lg-5">
        <span className="badge rounded-pill text-bg-light border mb-3">{copy.settings.plannerBadge}</span>
        <h2 className="h4 mb-2">{copy.settings.plannerTitle}</h2>
        <p className="text-secondary mb-0">{copy.settings.plannerText}</p>
      </SectionCard>
    </section>
  );
};
