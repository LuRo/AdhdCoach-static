import { type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/utils/cn";

interface Props extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  body: ReactNode;
  footer?: ReactNode;
  testId?: string;
  title: ReactNode;
}

export const SummaryCard = ({ body, className, footer, testId, title, ...props }: Props) => (
  <div className={cn("summary-card d-flex flex-column mw-100 p-1", className)} data-testid={testId} {...props}>
    <div className="summary-card-title small text-secondary text-uppercase fw-semibold">
      {title}
    </div>
    <div className="summary-card-body d-flex flex-column flex-grow-1">
      {body}
    </div>
    {footer ? <div className="summary-card-footer mt-auto pt-1">{footer}</div> : null}
  </div>
);
