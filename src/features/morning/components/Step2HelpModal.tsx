import { ModalShell } from "./ModalShell";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const Step2HelpModal = ({ isOpen, onClose }: Props) => (
  <ModalShell isOpen={isOpen} onClose={onClose} title="Step 2 Help">
    <p className="mb-2 text-secondary">Use this step to rank your tasks for today in a realistic order.</p>
    <ul className="mb-0 ps-3">
      <li>Drag cards with the handle on the left to reorder priorities.</li>
      <li>Use the complexity marker to keep workload balanced.</li>
      <li>Use the details button to open context and available actions per task.</li>
      <li>When the order looks right, confirm tasks to move to Today.</li>
    </ul>
  </ModalShell>
);
