import { type ButtonHTMLAttributes } from "react";
import { CoachButton } from "./CoachButton";

interface Props extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  testId?: string;
}

export const TrashBinButton = ({ className, testId, ...props }: Props) => (
  <CoachButton type="button" variant="danger" className={className} testId={testId} {...props}>
    <i className="bi bi-trash" aria-hidden="true" />
  </CoachButton>
);
