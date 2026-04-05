import { useState } from "react";
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

const formatDate = (value: string) => new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(value));

const emptyTestModes: TestModeSettings = {
  enabled: false,
  morningDateEnabled: false,
  todaySpeedEnabled: false
};

export const SettingsPage = ({
  onClose,
  selectedTestDate,
  testDaySpeed,
  testModeSettings,
  onTestModeSettingsChange
}: Props) => {
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
    <section className="section-panel active" id="settings-panel" aria-labelledby="Settings" role="tabpanel" data-testid="settings-page">
      <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3 mb-4">
        <div className="d-flex flex-column gap-2">
          <p className="text-uppercase small fw-semibold text-secondary mb-0">Settings</p>
          <h1 className="h2 mb-0">Application settings</h1>
          <p className="text-secondary mb-0">Configure the debrief question set and the test-mode switches used by Morning and Today.</p>
        </div>

        <CoachButton type="button" variant="outline" onClick={onClose} aria-label="Close settings page" testId="settings-close-button">
          Close
        </CoachButton>
      </div>

      <SectionCard className="p-4 p-lg-5 mb-4">
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
          <div>
            <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
              <CoachBadge tone={testModeSettings.enabled ? "purple" : "warning"} className="rounded-pill px-3 py-2">
                Test mode
              </CoachBadge>
              <span className="small text-secondary">{testModeSettings.enabled ? "On" : "Off"}</span>
            </div>
            <h2 className="h4 mb-2">Master switch controls whether test options are available at all.</h2>
            <p className="text-secondary mb-0">Turn it off and the individual modes are cleared and hidden everywhere.</p>
          </div>
          <div className="text-end small text-secondary">
            <div>Stored current day</div>
            <div className="fw-semibold text-dark">{formatDate(selectedTestDate)}</div>
          </div>
        </div>

        <div className="d-grid gap-3">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 p-3 rounded-4 border">
            <div>
              <div className="fw-semibold">Master test mode</div>
              <div className="small text-secondary">On enables the test controls below. Off clears them and hides them on every page.</div>
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
                {testModeSettings.enabled ? "On" : "Off"}
              </label>
            </div>
          </div>

          {showIndividualModes ? (
            <>
              <div className="d-grid gap-3 p-3 rounded-4 border">
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
                  <div>
                    <div className="fw-semibold">Set current day manually</div>
                    <div className="small text-secondary">Show the Morning date picker and store the selected day locally.</div>
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
                      {testModeSettings.morningDateEnabled ? "On" : "Off"}
                    </label>
                  </div>
                </div>
              </div>

              <div className="d-grid gap-3 p-3 rounded-4 border">
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
                  <div>
                    <div className="fw-semibold">Set live speed</div>
                    <div className="small text-secondary">Show the Today speed selector and simulate the timer multiplier.</div>
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
                      {testModeSettings.todaySpeedEnabled ? "On" : "Off"}
                    </label>
                  </div>
                </div>
                <div className="small text-secondary">
                  Active speed: {testModeSettings.todaySpeedEnabled ? `${testDaySpeed}x` : "1x live speed"}
                </div>
              </div>
            </>
          ) : (
            <div className="alert alert-info mb-0">Test options are hidden while master test mode is off.</div>
          )}
        </div>
      </SectionCard>

      <SectionCard className="p-4 p-lg-5 mb-4">
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
          <div>
            <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
              <CoachBadge tone="purple" className="rounded-pill px-3 py-2">Debrief questions</CoachBadge>
              <span className="small text-secondary">Version {version}</span>
            </div>
            <h2 className="h4 mb-2">Edit each question in its own tab.</h2>
            <p className="text-secondary mb-0">Each tab controls one prompt and its own answer scale. Historical submissions keep the version that was active when they were saved.</p>
          </div>
          <div className="text-end small text-secondary">
            <div>Last updated</div>
            <div className="fw-semibold text-dark">
              {new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(savedAt))}
            </div>
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
              Question {index + 1}
            </button>
          ))}
        </div>

        <div className="d-grid gap-4">
          <div className="d-grid gap-3">
            <label className="d-grid gap-1">
              <span className="small text-secondary fw-semibold">Question {activeQuestionIndex + 1}</span>
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
              <CoachBadge tone="purple" className="rounded-pill px-3 py-2">Answer labels</CoachBadge>
              <span className="small text-secondary">Used only for Question {activeQuestionIndex + 1}</span>
            </div>
            {activeAnswerDrafts.map((answer, index) => (
              <label key={index} className="d-grid gap-1">
                <span className="small text-secondary fw-semibold">Answer {index + 1}</span>
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
          <CoachButton type="button" testId="settings-save-question-set-button" onClick={handleSave}>Save question set</CoachButton>
          <CoachButton type="button" variant="outline" testId="settings-reset-question-set-button" onClick={handleReset}>
            Reset to saved
          </CoachButton>
        </div>
      </SectionCard>

      <SectionCard className="p-4 p-lg-5">
        <span className="badge rounded-pill text-bg-light border mb-3">Planner defaults</span>
        <h2 className="h4 mb-2">Local day simulation is stored per test date.</h2>
        <p className="text-secondary mb-0">
          Use the morning planner to select a test date, then save the plan and debrief answers locally for that day.
        </p>
      </SectionCard>
    </section>
  );
};
