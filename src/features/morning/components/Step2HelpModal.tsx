import { useI18n } from "../../../i18n";
import { ModalShell } from "./ModalShell";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const Step2HelpModal = ({ isOpen, onClose }: Props) => {
  const { copy } = useI18n();

  return (
    <ModalShell isOpen={isOpen} onClose={onClose} title={copy.ui.step2HelpModal.title} testId="morning-step-help-modal">
      <p className="mb-2 text-secondary">{copy.ui.step2HelpModal.intro}</p>
      <ul className="mb-0 ps-3">
        {copy.ui.step2HelpModal.tips.map((tip) => (
          <li key={tip}>{tip}</li>
        ))}
      </ul>
    </ModalShell>
  );
};
