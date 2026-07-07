import type { ComponentPropsWithoutRef, ElementType } from "react";

const variants = {
  primary: "bg-navy text-white hover:opacity-90",
  ghost: "bg-white text-ink border border-border hover:bg-parchment",
  brass: "bg-brass text-navy hover:opacity-90",
} as const;

type ButtonProps<T extends ElementType> = {
  as?: T;
  variant?: keyof typeof variants;
} & ComponentPropsWithoutRef<T>;

export function Button<T extends ElementType = "button">({
  as,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps<T>) {
  const Component = as ?? "button";
  return (
    <Component
      className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition active:scale-[0.98] ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
