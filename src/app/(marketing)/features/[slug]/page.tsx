import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { features, getFeature, getAdjacentFeatures } from "@/lib/features";
import { Icon } from "@/lib/icons";
import { Button } from "@/components/ui/Button";
import { ProductMockup } from "@/components/marketing/ProductMockup";
import { FeatureNav } from "@/components/marketing/FeatureNav";
import Link from "next/link";

export function generateStaticParams() {
  return features.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata(props: PageProps<"/features/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const feature = getFeature(slug);
  if (!feature) return {};
  return {
    title: `${feature.name} — Harbor`,
    description: feature.subhead,
  };
}

export default async function FeatureDetailPage(props: PageProps<"/features/[slug]">) {
  const { slug } = await props.params;
  const feature = getFeature(slug);
  if (!feature) notFound();

  const { prev, next } = getAdjacentFeatures(slug);

  return (
    <article>
      <section className="mx-auto max-w-6xl px-6 pt-14 pb-4">
        <Link href="/features" className="mb-6 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-slate hover:text-ink">
          <Icon name="arrowRight" className="h-3.5 w-3.5 rotate-180" /> All features
        </Link>
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1 text-[11.5px] font-semibold text-brass">
              <Icon name={feature.icon} className="h-3.5 w-3.5" /> {feature.name}
            </span>
            <h1 className="font-serif text-3xl font-semibold leading-tight text-ink sm:text-4xl">{feature.headline}</h1>
            <p className="mt-4 text-[15px] leading-relaxed text-slate">{feature.subhead}</p>
            <div className="mt-7 flex gap-3">
              <Button as={Link} href="/#get-started" variant="primary" className="px-6 py-3">
                Get a demo
              </Button>
              <Button as={Link} href="/features" variant="ghost" className="px-6 py-3">
                See all features
              </Button>
            </div>
          </div>
          <ProductMockup variant={feature.mockup} />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {feature.benefits.map((b) => (
            <div key={b.title} className="rounded-xl border border-border bg-white p-6">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-parchment text-teal">
                <Icon name="check" className="h-4.5 w-4.5" />
              </div>
              <h3 className="font-serif text-[16px] font-semibold text-ink">{b.title}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-slate">{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <FeatureNav prev={prev} next={next} />
      </section>
    </article>
  );
}
