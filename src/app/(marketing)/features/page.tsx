import type { Metadata } from "next";
import { features } from "@/lib/features";
import { FeatureCard } from "@/components/marketing/FeatureCard";

export const metadata: Metadata = {
  title: "Features — Harbor",
  description: "Everything Harbor ships with, across document management, communication, security, and more.",
};

export default function FeaturesHub() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-12 max-w-2xl">
        <span className="text-[11.5px] font-semibold uppercase tracking-wide text-brass">Features</span>
        <h1 className="mt-2 font-serif text-4xl font-semibold text-ink">
          Everything a client portal needs, none of it bolted on
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-slate">
          Twelve capabilities that make up Harbor — from the file manifest your clients approve
          from, to the API for the integration that doesn&apos;t exist yet. Every plan includes all
          of it.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <FeatureCard key={f.slug} feature={f} />
        ))}
      </div>
    </section>
  );
}
