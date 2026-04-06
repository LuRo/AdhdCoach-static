import { CoachBadge } from "../../../components/ui/CoachBadge";
import { InlineTranslation } from "../../../components/ui/InlineTranslation";
import { SummaryCard } from "../../../components/ui/SummaryCard";

interface Props {
  selectedTestDate: string;
  timeStatus: string;
  timeStatusKey: "onTrack" | "extraRunway" | "highFriction";
  totalInterruptions: number;
}

export const DebriefSummaryCard = ({ selectedTestDate, timeStatus, timeStatusKey, totalInterruptions }: Props) => (
  <SummaryCard
    className="debrief-summary-card"
    title={(
      <div className="d-flex justify-content-between align-items-center gap-2 mb-1">
        <InlineTranslation namespaceKey="debriefing.summary" translationKey="selectedDate" defaultText="Selected test date" />
        <div className="fw-semibold mb-2">{selectedTestDate}</div>
      </div>
    )}
    body={(
      <div className="d-flex flex-wrap gap-2 pt-3">
        <CoachBadge tone={timeStatusKey === "onTrack" ? "purple" : "warning"} className="rounded-pill px-3 py-2">{timeStatus}</CoachBadge>
        <CoachBadge tone={totalInterruptions >= 3 ? "danger" : "purple"} className="rounded-pill px-3 py-2">
          {totalInterruptions} <InlineTranslation namespaceKey="debriefing.summary" translationKey="interruptionHeading" defaultText="Interruption breakdown" />
        </CoachBadge>
      </div>
    )}
  />
);
