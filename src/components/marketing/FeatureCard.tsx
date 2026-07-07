import Link from "next/link";
import { Icon } from "@/lib/icons";
import type { Feature } from "@/lib/features";

export function FeatureCard({ feature }: { feature: Feature }) {
  return (
    <Link
      href={`/features/${feature.slug}`}
      className="group flex flex-col gap-3 rounded-xl border border-border bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(16,38,59,0.1)]"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-parchment text-teal">
        <Icon name={feature.icon} className="h-5 w-5" />
      </span>
      <div>
        <h3 className="font-serif text-[16px] font-semibold text-ink">{feature.name}</h3>
        <p className="mt-1 text-[13px] leading-relaxed text-slate">{feature.tagline}</p>
      </div>
      <span className="mt-auto flex items-center gap-1.5 text-[12.5px] font-semibold text-brass opacity-0 transition group-hover:opacity-100">
        Learn more <Icon name="arrowRight" className="h-3.5 w-3.5" />
      </span>
    </Link>
  );
}
