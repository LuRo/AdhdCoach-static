import { type HTMLAttributes } from "react";
import { cn } from "../../../shared/utils/cn";

interface Props extends HTMLAttributes<HTMLSpanElement> {
  tone?: "purple" | "warning" | "danger";
}

const toneClassMap: Record<NonNullable<Props["tone"]>, string> = {
  purple: "text-bg-purple",
  warning: "text-bg-warning",
  danger: "text-bg-danger"
};

export const CoachBadge = ({ className, tone = "purple", ...props }: Props) => (
  <span className={cn("badge", toneClassMap[tone], className)} {...props} />
);

