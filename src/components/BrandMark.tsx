// Ported 1:1 from the prototype's sidebar brand mark (harbor-handoff/index.html ~line 1237)
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none">
      <path d="M4 20c3 3 6 4.5 12 4.5S25 23 28 20" stroke="#E4C077" strokeWidth={1.8} fill="none" />
      <path d="M16 4v13" stroke="#F6F3EC" strokeWidth={1.8} />
      <path d="M16 6c4 0 6 2 6 2s-2 4-6 4-6-4-6-4 2-2 6-2Z" fill="#C08829" />
    </svg>
  );
}
