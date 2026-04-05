import { useState } from "react";
import { CoachBadge } from "../shared/components/atoms/CoachBadge";
import { CoachButton } from "../shared/components/atoms/CoachButton";
import { SectionCard } from "../shared/components/atoms/SectionCard";
import { getQuestionSet, saveQuestionSet } from "../features/morning/store";

interface Props {
  onClose: () => void;
}

export const SettingsPage = ({ onClose }: Props) => {
  const [savedQuestionSet, setSavedQuestionSet] = useState(() => getQuestionSet());
  const [drafts, setDrafts] = useState<[string, string, string]>(savedQuestionSet.questions);
  const [version, setVersion] = useState(savedQuestionSet.version);
  const [savedAt, setSavedAt] = useState(savedQuestionSet.updatedAt);

  const updateQuestion = (index: 0 | 1 | 2, value: string) => {
    setDrafts((previous) => {
      const next = [...previous] as [string, string, string];
      next[index] = value;
      return next;
    });
  };

  const handleSave = () => {
    const next = saveQuestionSet(drafts);
    setSavedQuestionSet(next);
    setVersion(next.version);
    setSavedAt(next.updatedAt);
  };

  return (
    <section className="section-panel active" id="settings-panel" aria-labelledby="Settings" role="tabpanel">
      <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3 mb-4">
        <div className="d-flex flex-column gap-2">
          <p className="text-uppercase small fw-semibold text-secondary mb-0">Settings</p>
          <h1 className="h2 mb-0">Application settings</h1>
          <p className="text-secondary mb-0">Configure the debrief question set and the day-planning defaults.</p>
        </div>

        <CoachButton type="button" variant="outline" onClick={onClose} aria-label="Close settings page">
          Close
        </CoachButton>
      </div>

      <SectionCard className="p-4 p-lg-5 mb-4">
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
          <div>
            <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
              <CoachBadge tone="purple" className="rounded-pill px-3 py-2">Debrief questions</CoachBadge>
              <span className="small text-secondary">Version {version}</span>
            </div>
            <h2 className="h4 mb-2">Move the question text here.</h2>
            <p className="text-secondary mb-0">The debrief page only answers these questions. Each save creates a new local version.</p>
          </div>
          <div className="text-end small text-secondary">
            <div>Last updated</div>
            <div className="fw-semibold text-dark">
              {new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(savedAt))}
            </div>
          </div>
        </div>

        <div className="d-grid gap-3">
          {drafts.map((question, index) => (
            <label key={index} className="d-grid gap-1">
              <span className="small text-secondary fw-semibold">Question {index + 1}</span>
              <input
                className="form-control"
                value={question}
                onChange={(event) => updateQuestion(index as 0 | 1 | 2, event.target.value)}
              />
            </label>
          ))}
        </div>

        <div className="d-flex flex-wrap gap-2 mt-4">
          <CoachButton type="button" onClick={handleSave}>Save question set</CoachButton>
          <CoachButton type="button" variant="outline" onClick={() => setDrafts(savedQuestionSet.questions)}>
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
