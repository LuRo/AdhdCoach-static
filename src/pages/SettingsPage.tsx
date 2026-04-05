import { useState } from "react";
import { InlineTranslationText } from "../i18n/InlineTranslationText";
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

const translationCopy = {
  en: {
    sectionLabel: "Translation",
    title: "In-page translation",
    description: "Show the interface in the selected language.",
    helperOn: "The UI follows the active language.",
    helperOff: "The UI stays in English until you turn translation back on.",
    enableLabel: "Enabled",
    disableLabel: "Disabled",
    editorTitle: "Inline translation editor",
    editorLead: "Edit the current locale copy directly. Empty fields revert to the default translation.",
    groupCommon: "Common labels",
    groupNav: "Navigation labels",
    groupPages: "Page headings",
    groupPlanner: "Planner labels"
  },
  de: {
    sectionLabel: "Übersetzung",
    title: "Übersetzung in der App",
    description: "Zeige die Oberfläche in der gewählten Sprache an.",
    helperOn: "Die Oberfläche folgt der aktiven Sprache.",
    helperOff: "Die Oberfläche bleibt auf Englisch, bis du die Übersetzung wieder einschaltest.",
    enableLabel: "Ein",
    disableLabel: "Aus",
    editorTitle: "Inline-Übersetzungseditor",
    editorLead: "Bearbeite die aktuelle Sprachfassung direkt. Leere Felder fallen auf die Standardübersetzung zurück.",
    groupCommon: "Allgemeine Labels",
    groupNav: "Navigationslabels",
    groupPages: "Seitentitel",
    groupPlanner: "Planer-Labels"
  },
  fr: {
    sectionLabel: "Traduction",
    title: "Traduction dans l'application",
    description: "Affiche l'interface dans la langue sélectionnée.",
    helperOn: "L'interface suit la langue active.",
    helperOff: "L'interface reste en anglais jusqu'à ce que vous réactiviez la traduction.",
    enableLabel: "Activée",
    disableLabel: "Désactivée",
    editorTitle: "Editeur de traduction en ligne",
    editorLead: "Modifiez directement la copie de la langue courante. Les champs vides reviennent à la traduction par défaut.",
    groupCommon: "Libellés courants",
    groupNav: "Libellés de navigation",
    groupPages: "Titres de page",
    groupPlanner: "Libellés du planificateur"
  }
} as const;
const emptyTestModes: TestModeSettings = {
  enabled: false,
  morningDateEnabled: false,
  todaySpeedEnabled: false
};

export const SettingsPage = ({ onClose, selectedTestDate, testDaySpeed, testModeSettings, onTestModeSettingsChange }: Props) => {
  const { copy, locale, translationEnabled, setTranslationEnabled } = useI18n();
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
          <p className="text-uppercase small fw-semibold text-secondary mb-0">
            <InlineTranslationText path="settings.sectionLabel" value={copy.settings.sectionLabel} />
          </p>
          <h1 id="settings-page-title" className="h2 mb-0">
            <InlineTranslationText path="settings.title" value={copy.settings.title} multiline />
          </h1>
          <p className="text-secondary mb-0">
            <InlineTranslationText path="settings.description" value={copy.settings.description} multiline />
          </p>
        </div>

        <CoachButton type="button" variant="outline" onClick={onClose} aria-label={copy.settings.closeAria} testId="settings-close-button">
          <InlineTranslationText path="common.close" value={copy.common.close} />
        </CoachButton>
      </div>

      <SectionCard className="p-4 p-lg-5 mb-4">
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
          <div>
            <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
              <CoachBadge tone={translationEnabled ? "purple" : "warning"} className="rounded-pill px-3 py-2">
                {translationCopy[locale].sectionLabel}
              </CoachBadge>
              <span className="small text-secondary">{translationEnabled ? translationCopy[locale].enableLabel : translationCopy[locale].disableLabel}</span>
            </div>
            <h2 className="h4 mb-2">{translationCopy[locale].title}</h2>
            <p className="text-secondary mb-0">{translationCopy[locale].description}</p>
          </div>
          <div className="form-check form-switch m-0">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id="translation-enabled"
              checked={translationEnabled}
              onChange={(event) => setTranslationEnabled(event.target.checked)}
            />
            <label className="form-check-label small fw-semibold" htmlFor="translation-enabled">
              {translationEnabled ? translationCopy[locale].enableLabel : translationCopy[locale].disableLabel}
            </label>
          </div>
        </div>
        <div className="small text-secondary">{translationEnabled ? translationCopy[locale].helperOn : translationCopy[locale].helperOff}</div>
      </SectionCard>

      {translationEnabled ? (
        <SectionCard className="p-4 p-lg-5 mb-4">
          <div className="mb-4">
            <CoachBadge tone="purple" className="rounded-pill px-3 py-2">
              {translationCopy[locale].editorTitle}
            </CoachBadge>
            <h2 className="h4 mt-3 mb-2">{translationCopy[locale].editorTitle}</h2>
            <p className="text-secondary mb-0">{translationCopy[locale].editorLead}</p>
          </div>

          <div className="d-grid gap-4">
            <div>
              <div className="small text-secondary fw-semibold mb-2">{translationCopy[locale].groupCommon}</div>
              <div className="d-grid gap-3">
                <label className="d-grid gap-1">
                  <span className="small text-secondary fw-semibold">close</span>
                  <InlineTranslationText path="common.close" value={copy.common.close} className="w-100" multiline />
                </label>
                <label className="d-grid gap-1">
                  <span className="small text-secondary fw-semibold">save</span>
                  <InlineTranslationText path="common.save" value={copy.common.save} className="w-100" multiline />
                </label>
                <label className="d-grid gap-1">
                  <span className="small text-secondary fw-semibold">cancel</span>
                  <InlineTranslationText path="common.cancel" value={copy.common.cancel} className="w-100" multiline />
                </label>
                <label className="d-grid gap-1">
                  <span className="small text-secondary fw-semibold">reset</span>
                  <InlineTranslationText path="common.reset" value={copy.common.reset} className="w-100" multiline />
                </label>
              </div>
            </div>

            <div>
              <div className="small text-secondary fw-semibold mb-2">{translationCopy[locale].groupNav}</div>
              <div className="d-grid gap-3">
                <label className="d-grid gap-1">
                  <span className="small text-secondary fw-semibold">logout</span>
                  <InlineTranslationText path="nav.logout" value={copy.nav.logout} className="w-100" multiline />
                </label>
                <label className="d-grid gap-1">
                  <span className="small text-secondary fw-semibold">settings aria</span>
                  <InlineTranslationText path="nav.settingsAria" value={copy.nav.settingsAria} className="w-100" multiline />
                </label>
                <label className="d-grid gap-1">
                  <span className="small text-secondary fw-semibold">profile aria</span>
                  <InlineTranslationText path="nav.profileAria" value={copy.nav.profileAria} className="w-100" multiline />
                </label>
              </div>
            </div>

            <div>
              <div className="small text-secondary fw-semibold mb-2">{translationCopy[locale].groupPages}</div>
              <div className="d-grid gap-3">
                <label className="d-grid gap-1">
                  <span className="small text-secondary fw-semibold">profile title</span>
                  <InlineTranslationText path="profile.title" value={copy.profile.title} className="w-100" multiline />
                </label>
                <label className="d-grid gap-1">
                  <span className="small text-secondary fw-semibold">settings title</span>
                  <InlineTranslationText path="settings.title" value={copy.settings.title} className="w-100" multiline />
                </label>
                <label className="d-grid gap-1">
                  <span className="small text-secondary fw-semibold">settings description</span>
                  <InlineTranslationText path="settings.description" value={copy.settings.description} className="w-100" multiline />
                </label>
                <label className="d-grid gap-1">
                  <span className="small text-secondary fw-semibold">question set heading</span>
                  <InlineTranslationText path="settings.questionSetHeading" value={copy.settings.questionSetHeading} className="w-100" multiline />
                </label>
              </div>
            </div>

            <div>
              <div className="small text-secondary fw-semibold mb-2">{translationCopy[locale].groupPlanner}</div>
              <div className="d-grid gap-3">
                <label className="d-grid gap-1">
                  <span className="small text-secondary fw-semibold">planner title</span>
                  <InlineTranslationText path="settings.plannerTitle" value={copy.settings.plannerTitle} className="w-100" multiline />
                </label>
                <label className="d-grid gap-1">
                  <span className="small text-secondary fw-semibold">planner text</span>
                  <InlineTranslationText path="settings.plannerText" value={copy.settings.plannerText} className="w-100" multiline />
                </label>
              </div>
            </div>
          </div>
        </SectionCard>
      ) : null}

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
