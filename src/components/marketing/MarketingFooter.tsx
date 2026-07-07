import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";
import { features } from "@/lib/features";

const columns = [
  { title: "Product", links: features.slice(0, 6) },
  { title: "More features", links: features.slice(6, 12) },
];

export function MarketingFooter() {
  return (
    <footer className="border-t border-border bg-navy text-parchment">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-2">
            <div className="mb-3 flex items-center gap-2.5">
              <BrandMark className="h-8 w-8 rounded-lg bg-white/10 p-1" />
              <span className="font-serif text-lg font-semibold text-white">Harbor</span>
            </div>
            <p className="max-w-xs text-[13px] leading-relaxed text-parchment/60">
              The client portal for firms who&apos;d rather show their clients where things stand
              than explain it over email.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <div className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-parchment/40">{col.title}</div>
              <ul className="space-y-2">
                {col.links.map((f) => (
                  <li key={f.slug}>
                    <Link href={`/features/${f.slug}`} className="text-[13px] text-parchment/75 hover:text-white">
                      {f.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 text-[12px] text-parchment/50 sm:flex-row sm:items-center">
          <span>© 2026 Harbor. A client-portal prototype.</span>
          <div className="flex gap-5">
            <Link href="/admin" className="hover:text-white">
              Admin Console
            </Link>
            <Link href="/portal" className="hover:text-white">
              Client Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
