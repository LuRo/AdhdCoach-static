import { type HTMLAttributes, type PropsWithChildren } from "react";
import { cn } from "../../lib/utils/cn";

interface Props extends PropsWithChildren<HTMLAttributes<HTMLDivElement>> {
  testId?: string;
}

export const SectionCard = ({ children, className, testId, ...props }: Props) => (
  <div className={cn("section-card align-items-start pt-4 pb-4 ps-lg-5 pe-lg-4", className)} data-testid={testId} {...props}>
    {children}
  </div>
);

