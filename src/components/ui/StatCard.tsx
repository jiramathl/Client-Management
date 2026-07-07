export function StatCard({ num, label, delta }: { num: string; label: string; delta?: string }) {
  return (
    <div className="rounded-[10px] border border-border bg-white px-[18px] py-4">
      <div className="font-serif text-[28px] font-semibold">{num}</div>
      <div className="mt-0.5 text-xs text-slate">{label}</div>
      {delta && <div className="mt-1.5 text-[11px] font-semibold text-success">{delta}</div>}
    </div>
  );
}
