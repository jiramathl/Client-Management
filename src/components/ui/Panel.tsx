import type { ReactNode } from "react";

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-[10px] border border-border bg-white ${className}`}>{children}</div>;
}

export function PanelHead({ children }: { children: ReactNode }) {
  return <div className="flex items-center justify-between border-b border-border px-[18px] py-4">{children}</div>;
}
