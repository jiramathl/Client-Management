import { signOutAction } from "@/app/admin/sign-out-action";
import { Icon } from "@/lib/icons";

export function AdminTopbar({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-white px-7 py-[18px]">
      <div className="flex flex-col">
        <span className="mb-0.5 text-[11px] font-semibold uppercase tracking-wide text-brass">{eyebrow}</span>
        <h1 className="font-serif text-[22px] font-semibold text-ink">{title}</h1>
      </div>
      <form action={signOutAction}>
        <button
          type="submit"
          className="flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-2 text-[12.5px] font-semibold text-slate transition hover:bg-parchment"
        >
          <Icon name="x" className="h-3.5 w-3.5" /> Sign out
        </button>
      </form>
    </div>
  );
}
