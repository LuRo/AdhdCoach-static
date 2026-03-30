import { type HTMLAttributes, type PropsWithChildren } from "react";
import { cn } from "../../app/cn";

interface Props extends PropsWithChildren<HTMLAttributes<HTMLDivElement>> {}

export const SectionCard = ({ children, className, ...props }: Props) => (
  <div className={cn("section-card", className)} {...props}>
    {children}
  </div>
);
