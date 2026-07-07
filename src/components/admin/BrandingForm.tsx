"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { brandingSwatches } from "@/lib/catalogs";
import { discardBranding, saveBranding } from "@/lib/actions/admin";

type Branding = { name: string; domain: string; primaryColor: string; accentColor: string };

export function BrandingForm({ workspaceId, branding }: { workspaceId: string; branding: Branding }) {
  const [name, setName] = useState(branding.name);
  const [domain, setDomain] = useState(branding.domain);
  const [primaryColor, setPrimaryColor] = useState(branding.primaryColor);
  const [accentColor, setAccentColor] = useState(branding.accentColor);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function runAction(action: (formData: FormData) => Promise<void>) {
    const formData = new FormData();
    formData.set("workspaceId", workspaceId);
    formData.set("name", name);
    formData.set("domain", domain);
    formData.set("primaryColor", primaryColor);
    formData.set("accentColor", accentColor);
    startTransition(async () => {
      await action(formData);
      router.refresh();
    });
  }

  return (
    <div className="grid grid-cols-2 gap-5">
      <div>
        <div className="mb-4">
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate">Portal name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-border px-3 py-2.5 text-[13.5px] outline-none focus:border-brass"
          />
        </div>
        <div className="mb-4">
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate">Domain</label>
          <input
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="w-full rounded-lg border border-border px-3 py-2.5 text-[13.5px] outline-none focus:border-brass"
          />
        </div>
        <div className="mb-4">
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate">Primary</label>
          <div className="flex gap-2.5">
            {brandingSwatches.primary.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setPrimaryColor(c)}
                className="h-9 w-9 rounded-lg"
                style={{ background: c, outline: c === primaryColor ? "2px solid #16232E" : "none", outlineOffset: 2 }}
              />
            ))}
          </div>
        </div>
        <div className="mb-5">
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate">Accent</label>
          <div className="flex gap-2.5">
            {brandingSwatches.accent.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setAccentColor(c)}
                className="h-9 w-9 rounded-lg"
                style={{ background: c, outline: c === accentColor ? "2px solid #16232E" : "none", outlineOffset: 2 }}
              />
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2.5">
          <button
            type="button"
            disabled={isPending}
            onClick={() => runAction(discardBranding)}
            className="rounded-lg border border-border bg-white px-4 py-2.5 text-[13px] font-semibold text-ink hover:bg-parchment disabled:opacity-60"
          >
            Discard
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => runAction(saveBranding)}
            className="rounded-lg bg-navy px-4 py-2.5 text-[13px] font-semibold text-white disabled:opacity-60"
          >
            {isPending ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-[10px] border border-border">
        <div className="flex items-center gap-2.5 px-4 py-3.5" style={{ background: primaryColor }}>
          <span className="flex h-7 w-7 items-center justify-center rounded-md text-[11px] font-bold" style={{ background: accentColor, color: primaryColor }}>
            {name.slice(0, 1).toUpperCase()}
          </span>
          <span className="font-serif text-[15px] font-semibold text-white">{name}</span>
        </div>
        <div className="bg-parchment px-4 py-4 text-[12px] text-slate">
          <div className="mb-2">{domain}</div>
          <div className="h-1.5 w-2/3 overflow-hidden rounded-full bg-parchment-2">
            <div className="h-full w-2/3 rounded-full" style={{ background: accentColor }} />
          </div>
        </div>
      </div>
    </div>
  );
}
