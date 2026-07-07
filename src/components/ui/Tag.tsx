const statusStyles = {
  approved: "bg-[#E5F1EA] text-success",
  review: "bg-[#FBF0DC] text-[#93670F]",
  draft: "bg-parchment-2 text-slate",
} as const;

export function Tag({ status, children }: { status: keyof typeof statusStyles; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-[3px] text-[10.5px] font-semibold ${statusStyles[status]}`}>
      {children}
    </span>
  );
}
