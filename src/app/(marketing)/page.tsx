import Link from "next/link";
import { Icon } from "@/lib/icons";
import { features } from "@/lib/features";
import { Button } from "@/components/ui/Button";
import { FeatureCard } from "@/components/marketing/FeatureCard";
import { ProductMockup } from "@/components/marketing/ProductMockup";

const pricingTiers = [
  {
    name: "Standard",
    blurb: "For a handful of active client relationships.",
    included: ["Document management & file sharing", "Task management", "Client communication", "Access & permissions"],
  },
  {
    name: "Professional",
    blurb: "For firms managing a full client portfolio.",
    included: ["Everything in Standard", "Custom branding per client", "Native integrations", "Usage & audit reporting"],
    featured: true,
  },
  {
    name: "Enterprise",
    blurb: "For organizations with compliance requirements.",
    included: ["Everything in Professional", "API integrations", "Advanced data protection & compliance", "Dedicated onboarding"],
  },
];

export default function Home() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-8 sm:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1 text-[11.5px] font-semibold text-brass">
              <Icon name="sparkle" className="h-3.5 w-3.5" /> Client portal, reimagined
            </span>
            <h1 className="font-serif text-4xl font-semibold leading-[1.1] text-ink sm:text-5xl">
              The client portal your clients actually enjoy opening
            </h1>
            <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-slate">
              Harbor puts files, tasks, and one real conversation thread in a portal branded for
              each client — so &ldquo;where do things stand&rdquo; stops being a status-update email.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button as={Link} href="#get-started" variant="primary" className="px-6 py-3">
                Get a demo
              </Button>
              <Button as={Link} href="/features" variant="ghost" className="px-6 py-3">
                Explore all features
              </Button>
            </div>
          </div>
          <ProductMockup variant="kanban" />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-8 rounded-2xl border border-border bg-white p-8 sm:grid-cols-2 sm:p-10">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-ink">Two portals. One workspace.</h2>
            <p className="mt-3 text-[14.5px] leading-relaxed text-slate">
              Your team runs everything from the Admin Console — every client, every file, every
              policy. Each client only ever sees their own branded Client Portal: their files,
              their tasks, their thread. Nothing crosses over.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-[13px]">
            <div className="rounded-xl border border-border p-4">
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-md bg-navy text-white">
                <Icon name="layers" className="h-4 w-4" />
              </div>
              <div className="font-semibold text-ink">Admin Console</div>
              <div className="mt-1 text-slate-light">Manage every client from one sidebar.</div>
            </div>
            <div className="rounded-xl border border-border p-4">
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-md bg-brass text-navy">
                <Icon name="overview" className="h-4 w-4" />
              </div>
              <div className="font-semibold text-ink">Client Portal</div>
              <div className="mt-1 text-slate-light">Branded, scoped to that client only.</div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="mb-10 max-w-xl">
          <span className="text-[11.5px] font-semibold uppercase tracking-wide text-brass">Everything included</span>
          <h2 className="mt-2 font-serif text-3xl font-semibold text-ink">
            Twelve capabilities, one portal
          </h2>
          <p className="mt-3 text-[14.5px] leading-relaxed text-slate">
            Every one of these ships together — there&apos;s no add-on tier where document
            management works but task management doesn&apos;t.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <FeatureCard key={f.slug} feature={f} />
          ))}
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-6xl px-6 py-14">
        <div className="mb-10 max-w-xl">
          <span className="text-[11.5px] font-semibold uppercase tracking-wide text-brass">Pricing</span>
          <h2 className="mt-2 font-serif text-3xl font-semibold text-ink">Priced for your client roster, not per feature</h2>
          <p className="mt-3 text-[14.5px] leading-relaxed text-slate">
            Every plan gets the same twelve capabilities on your own clients&apos; portals — plans
            scale with how many client workspaces and how much compliance depth you need.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          {pricingTiers.map((tier) => (
            <div
              key={tier.name}
              className={`flex flex-col rounded-2xl border p-6 ${tier.featured ? "border-brass bg-white shadow-[0_20px_50px_rgba(16,38,59,0.12)]" : "border-border bg-white"}`}
            >
              <div className="font-serif text-lg font-semibold text-ink">{tier.name}</div>
              <p className="mt-1 text-[13px] text-slate">{tier.blurb}</p>
              <ul className="mt-5 flex-1 space-y-2.5">
                {tier.included.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[13px] text-ink">
                    <Icon name="check" className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-success" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button variant={tier.featured ? "brass" : "ghost"} className="mt-6 w-full justify-center">
                Contact sales
              </Button>
            </div>
          ))}
        </div>
      </section>

      <section id="get-started" className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-col items-center gap-5 rounded-2xl bg-navy px-8 py-14 text-center">
          <h2 className="max-w-xl font-serif text-3xl font-semibold text-white">
            Give every client a portal worth logging into
          </h2>
          <p className="max-w-md text-[14.5px] text-parchment/70">
            See Harbor set up for a client that looks like yours — files, tasks, and branding included.
          </p>
          <Button variant="brass" className="px-6 py-3">
            Get a demo
          </Button>
        </div>
      </section>
    </>
  );
}
