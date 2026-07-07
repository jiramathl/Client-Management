import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/lib/icons";
import { features } from "@/lib/features";

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        <Link href="/" className="flex items-center gap-2.5">
          <BrandMark className="h-8 w-8 rounded-lg bg-navy p-1" />
          <span className="font-serif text-lg font-semibold text-ink">Harbor</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          <div className="group relative">
            <button className="flex items-center gap-1 text-[13.5px] font-medium text-ink">
              Features <Icon name="arrowRight" className="h-3 w-3 rotate-90" />
            </button>
            <div className="invisible absolute left-1/2 top-full grid w-[560px] -translate-x-1/2 grid-cols-2 gap-1 rounded-xl border border-border bg-white p-3 opacity-0 shadow-[0_20px_50px_rgba(16,38,59,0.14)] transition group-hover:visible group-hover:opacity-100">
              {features.map((f) => (
                <Link
                  key={f.slug}
                  href={`/features/${f.slug}`}
                  className="flex items-start gap-2.5 rounded-lg px-2.5 py-2 hover:bg-parchment"
                >
                  <span className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-parchment text-teal">
                    <Icon name={f.icon} className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-[12.5px] font-semibold text-ink">{f.name}</span>
                    <span className="block text-[11px] text-slate-light">{f.tagline}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
          <Link href="/features" className="text-[13.5px] font-medium text-ink">
            All features
          </Link>
          <Link href="/#pricing" className="text-[13.5px] font-medium text-ink">
            Pricing
          </Link>
        </nav>

        <div className="flex items-center gap-2.5">
          <Button as={Link} href="/admin" variant="ghost" className="hidden sm:inline-flex">
            Sign in
          </Button>
          <Button as={Link} href="/#get-started" variant="primary">
            Get a demo
          </Button>
        </div>
      </div>
    </header>
  );
}
