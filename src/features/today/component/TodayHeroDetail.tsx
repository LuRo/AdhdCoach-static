import type { DaySpeedMultiplier } from "../../morning/types";
import { CoachButton } from "../../../components/ui/CoachButton";
import { SummaryCard } from "../../../components/ui/SummaryCard";

interface Props {
  onTestDaySpeedChange: (speed: DaySpeedMultiplier) => void;
  showTestSpeedControl: boolean;
  testDaySpeed: DaySpeedMultiplier;
  ui: any;
}

const SPEED_OPTIONS: DaySpeedMultiplier[] = [1, 10, 20, 50, 100];

export const TodayHeroDetail = ({ onTestDaySpeedChange, showTestSpeedControl, testDaySpeed, ui }: Props) => (
  <SummaryCard
    className="today-hero-detail"
    title={ui.speedLabel}
    body={
      showTestSpeedControl ? (
        <div className="d-flex flex-wrap gap-2 pt-3" role="group" aria-label={ui.speedAria} data-testid="today-speed-group">
          {SPEED_OPTIONS.map((speed) => (
            <CoachButton
              key={speed}
              type="button"
              variant={testDaySpeed === speed ? "primary" : "outline"}
              className="px-3 py-1"
              onClick={() => onTestDaySpeedChange(speed)}
            >
              {speed}x
            </CoachButton>
          ))}
        </div>
      ) : (
        <div className="small text-secondary">{ui.liveSpeedNote}</div>
      )
    }
    footer={showTestSpeedControl ? <div className="small text-secondary">{ui.simulationNote}</div> : undefined}
  />
);
