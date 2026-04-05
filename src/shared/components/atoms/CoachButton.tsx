import { type ButtonHTMLAttributes, type PropsWithChildren } from "react";
import { cn } from "../../../shared/utils/cn";

type Variant = "primary" | "outline" | "danger" | "ghost";

interface Props extends PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> {
  variant?: Variant;
}

const variantClassMap: Record<Variant, string> = {
  primary: "btn btn-purple",
  outline: "btn btn-outline-purple",
  danger: "btn btn-outline-danger",
  ghost: "btn btn-light"
};

export const CoachButton = ({ children, className, variant = "primary", ...props }: Props) => (
  <button className={cn(variantClassMap[variant], className)} {...props}>
    {children}
  </button>
);

