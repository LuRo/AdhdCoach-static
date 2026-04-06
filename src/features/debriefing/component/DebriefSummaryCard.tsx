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
    title={<InlineTranslation namespaceKey="debriefing.summary" translationKey="selectedDate" defaultText="Selected test date" />}
    body={<div className="fw-semibold mb-2">{selectedTestDate}</div>}
    footer={(
      <div className="d-flex flex-wrap gap-2">
        <CoachBadge tone={timeStatusKey === "onTrack" ? "purple" : "warning"} className="rounded-pill px-3 py-2">{timeStatus}</CoachBadge>
        <CoachBadge tone={totalInterruptions >= 3 ? "danger" : "purple"} className="rounded-pill px-3 py-2">
          {totalInterruptions} <InlineTranslation namespaceKey="debriefing.summary" translationKey="interruptionHeading" defaultText="Interruption breakdown" />
        </CoachBadge>
      </div>
    )}
  />
);
