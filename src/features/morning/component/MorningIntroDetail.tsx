import { useTranslation } from "react-i18next";
import { InlineTranslation } from "../../../components/ui/InlineTranslation";

interface Props {
  currentDateLabel: string;
  onTestDateChange: (date: string) => void;
  selectedTestDate: string;
  showTestDateControl: boolean;
}

export const MorningIntroDetail = ({ currentDateLabel, onTestDateChange, selectedTestDate, showTestDateControl }: Props) => {
  const { t } = useTranslation();

  if (!showTestDateControl) {
    return (
      <div className="py-2" data-testid="morning-current-day-summary-card">        
          <InlineTranslation 
            namespaceKey="morning.panel"
            translationKey="todayIsPrefix"
            defaultText="Today is the"
          />&nbsp;{currentDateLabel}
      </div>
    );
  }

  return (
    <div className="d-grid gap-2 min-w-0">
      <label className="d-grid gap-1">
        <span className="small text-secondary fw-semibold">{t("Set current day manually")}</span>
        <input
          type="date"
          className="form-control"
          data-testid="morning-selected-date-input"
          value={selectedTestDate}
          onChange={(event) => onTestDateChange(event.target.value)}
        />
      </label>
    </div>
  );
};
