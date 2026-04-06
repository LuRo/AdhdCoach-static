import { type ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/utils/cn";

interface Props extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  logoSrc?: string;
  logoAlt?: string;
  logoClassName?: string;
  testId?: string;
}

export const LogoButton = ({
  className,
  logoSrc = "/adhd-logo.svg",
  logoAlt = "",
  logoClassName = "brand-logo",
  testId,
  type = "button",
  ...props
}: Props) => (
  <button
    type={type}
    className={cn("navbar-brand d-flex align-items-center gap-3 me-0 border-0 bg-transparent p-0", className)}
    data-testid={testId}
    {...props}
  >
    <img src={logoSrc} alt={logoAlt} className={logoClassName} />
  </button>
);
