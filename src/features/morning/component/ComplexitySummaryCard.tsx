import { useTranslation } from "react-i18next";
import { CoachBadge } from "../../../components/ui/CoachBadge";
import { SectionCard } from "../../../components/ui/SectionCard";
import type { ComplexitySnapshot } from "../types";

interface Props {
  gaugeAngle: number;
  gaugeTransition: string;
  onRecalculate: () => void;
  snapshot: ComplexitySnapshot;
  testId?: string;
}

const badgeTone = (status: ComplexitySnapshot["status"]): "purple" | "warning" | "danger" => {
  if (status === "Overloaded") return "danger";
  if (status === "Moderate") return "warning";
  return "purple";
};

export const ComplexitySummaryCard = ({ gaugeAngle, gaugeTransition, onRecalculate, snapshot, testId }: Props) => {
  const { t } = useTranslation();
  const statusLabel = snapshot.status === "Overloaded" ? t("High") : snapshot.status === "Moderate" ? t("Moderate") : t("Light");

  return (
    <SectionCard className="px-3 py-3 px-md-4 d-flex align-items-center gap-3" testId={testId ?? "morning-complexity-summary-card"}>
      <div className="flex-grow-1 complexity-card">
        <div className="d-flex justify-content-between align-items-center gap-2 mb-2">
          <span className="fw-semibold">{t("Daily complexity")}</span>
          <CoachBadge tone={badgeTone(snapshot.status)}>{statusLabel}</CoachBadge>
        </div>

        <div
          id="complexity-gauge-control"
          data-testid="morning-complexity-gauge-control"
          className="complexity-gauge"
          role="button"
          tabIndex={0}
          aria-label={t("Recalculate daily complexity gauge")}
          onClick={onRecalculate}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onRecalculate();
            }
          }}
        >
          <svg viewBox="0 0 220 140" aria-hidden="true">
            <defs>
              <linearGradient id="gauge-mid-gradient" x1="75" y1="49.4" x2="145" y2="49.4" gradientUnits="userSpaceOnUse" gradientTransform="rotate(20 110 49.4)">
                <stop offset="0%" stopColor="#7acd42" />
                <stop offset="90%" stopColor="#7acd42" />
                <stop offset="100%" stopColor="#ff2323" />
              </linearGradient>
            </defs>

            <path className="gauge-segment gauge-green" d="M 40 110 A 70 70 0 0 1 75 49.4" />
            <path className="gauge-segment gauge-yellow" d="M 75 49.4 A 70 70 0 0 1 145 49.4" />
            <path className="gauge-segment gauge-red" d="M 145 49.4 A 70 70 0 0 1 180 110" />

            <g id="complexity-needle" className="gauge-needle" style={{ transform: `rotate(${gaugeAngle}deg)`, transition: gaugeTransition, WebkitTransform: `rotate(${gaugeAngle}deg)`, WebkitTransition: gaugeTransition, willChange: "transform" }}>
              <line x1="110" y1="110" x2="170" y2="110" />
              <circle cx="110" cy="110" r="4" />
              <circle cx="170" cy="110" r="3" />
            </g>

            <circle className="gauge-hub" cx="110" cy="110" r="10" />
          </svg>

          <div className="gauge-scale" aria-hidden="true">
            <span>{t("Light")}</span>
            <span>{t("Moderate")}</span>
            <span>{t("High")}</span>
          </div>
        </div>

        <div className="d-flex align-items-center justify-content-between gap-2 mt-3">
          <span className="small text-secondary">{t("Recommended threshold: 10 points")}</span>
          <CoachBadge className="px-3 py-2">
            {snapshot.total} {t("points")}
          </CoachBadge>
        </div>
      </div>
    </SectionCard>
  );
};
