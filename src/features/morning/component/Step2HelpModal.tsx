import { useTranslation } from "react-i18next";
import { ModalShell } from "./ModalShell";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const Step2HelpModal = ({ isOpen, onClose }: Props) => {
  const { t } = useTranslation();

  const tips = [
    t("Drag cards with the handle on the left to reorder priorities."),
    t("Use the complexity marker to keep workload balanced."),
    t("Use the details button to open context and available actions per task."),
    t("When the order looks right, confirm tasks to move to Today.")
  ];

  return (
    <ModalShell isOpen={isOpen} onClose={onClose} title={t("Step 2 Help")} testId="morning-step-help-modal">
      <p className="mb-2 text-secondary">{t("Use this step to rank your tasks for today in a realistic order.")}</p>
      <ul className="mb-0 ps-3">
        {tips.map((tip) => (
          <li key={tip}>{tip}</li>
        ))}
      </ul>
    </ModalShell>
  );
};
