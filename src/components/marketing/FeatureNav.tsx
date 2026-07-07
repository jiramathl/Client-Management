import Link from "next/link";
import { Icon } from "@/lib/icons";
import type { Feature } from "@/lib/features";

export function FeatureNav({ prev, next }: { prev: Feature; next: Feature }) {
  return (
    <div className="grid grid-cols-1 gap-3 border-t border-border pt-8 sm:grid-cols-2">
      <Link
        href={`/features/${prev.slug}`}
        className="flex items-center gap-3 rounded-xl border border-border bg-white p-4 transition hover:border-brass"
      >
        <Icon name="arrowRight" className="h-4 w-4 rotate-180 text-slate-light" />
        <div>
          <div className="text-[10.5px] font-semibold uppercase tracking-wide text-slate-light">Previous</div>
          <div className="text-[13.5px] font-semibold text-ink">{prev.name}</div>
        </div>
      </Link>
      <Link
        href={`/features/${next.slug}`}
        className="flex items-center justify-end gap-3 rounded-xl border border-border bg-white p-4 text-right transition hover:border-brass"
      >
        <div>
          <div className="text-[10.5px] font-semibold uppercase tracking-wide text-slate-light">Next</div>
          <div className="text-[13.5px] font-semibold text-ink">{next.name}</div>
        </div>
        <Icon name="arrowRight" className="h-4 w-4 text-slate-light" />
      </Link>
    </div>
  );
}
