export function Avatar({ initials, className = "" }: { initials: string; className?: string }) {
  return (
    <div
      className={`flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-full bg-brass text-[12px] font-bold text-navy ${className}`}
    >
      {initials}
    </div>
  );
}
