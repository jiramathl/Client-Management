"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BrandMark } from "@/components/BrandMark";
import { Icon } from "@/lib/icons";
import { adminNavGroups } from "@/lib/adminNav";
import { createClient, deleteClient } from "@/lib/actions/admin";
import type { Workspace } from "@/generated/prisma";

export function AdminSidebar({
  workspaces,
  currentWorkspaceId,
  userName,
}: {
  workspaces: Workspace[];
  currentWorkspaceId: string;
  userName: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return workspaces;
    return workspaces.filter((w) => w.name.toLowerCase().includes(q) || w.code.toLowerCase().includes(q));
  }, [workspaces, query]);

  const currentTab = pathname.split("/")[3] ?? "overview";

  function handleAddClient(formData: FormData) {
    const name = (formData.get("name") as string)?.trim();
    const ownerName = (formData.get("ownerName") as string)?.trim();
    const ownerEmail = (formData.get("ownerEmail") as string)?.trim();
    if (!name || !ownerName || !ownerEmail) return;

    setError(null);
    startTransition(async () => {
      const { id } = await createClient({ name, ownerName, ownerEmail });
      setShowAddForm(false);
      router.push(`/admin/${id}/overview`);
    });
  }

  function handleRemoveClient(workspaceId: string, name: string) {
    if (!window.confirm(`Remove ${name}? This deletes all of its files, tasks, members, and messages.`)) return;
    setError(null);
    startTransition(async () => {
      try {
        await deleteClient({ workspaceId, currentWorkspaceId });
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Couldn't remove this client.");
      }
    });
  }

  return (
    <aside className="flex h-screen w-[264px] min-w-[264px] flex-col bg-navy py-5 text-parchment">
      <div className="mb-4 flex items-center gap-2.5 border-b border-white/10 px-5 pb-[18px]">
        <BrandMark className="h-[30px] w-[30px] flex-shrink-0" />
        <div>
          <div className="font-serif text-[19px] font-semibold leading-tight">Harbor</div>
          <span className="-mt-0.5 block text-[10px] uppercase tracking-wide text-brass-soft">Admin Console</span>
        </div>
      </div>

      <div className="px-5">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10.5px] uppercase tracking-wide text-white/40">Clients ({workspaces.length})</span>
          <button
            type="button"
            onClick={() => setShowAddForm((s) => !s)}
            className="flex h-5 w-5 items-center justify-center rounded text-brass-soft hover:bg-white/10"
            title="Add client"
          >
            <Icon name="plus" className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="mb-2 flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5">
          <Icon name="search" className="h-3.5 w-3.5 text-white/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search clients…"
            className="w-full bg-transparent text-[12.5px] text-parchment placeholder:text-white/30 outline-none"
          />
        </div>
      </div>

      {showAddForm && (
        <form
          action={handleAddClient}
          className="mx-5 mb-3 space-y-1.5 rounded-lg border border-white/10 bg-white/5 p-2.5"
        >
          <input name="name" required placeholder="Client name" className="w-full rounded-md bg-white/10 px-2 py-1.5 text-[12px] text-white placeholder:text-white/35 outline-none" />
          <input name="ownerName" required placeholder="Owner name" className="w-full rounded-md bg-white/10 px-2 py-1.5 text-[12px] text-white placeholder:text-white/35 outline-none" />
          <input name="ownerEmail" type="email" required placeholder="Owner email" className="w-full rounded-md bg-white/10 px-2 py-1.5 text-[12px] text-white placeholder:text-white/35 outline-none" />
          <button type="submit" disabled={isPending} className="w-full rounded-md bg-brass py-1.5 text-[12px] font-semibold text-navy disabled:opacity-60">
            {isPending ? "Creating…" : "Create client"}
          </button>
        </form>
      )}
      {error && <div className="mx-5 mb-2 text-[11.5px] text-red-300">{error}</div>}

      <div className="mb-2 max-h-[220px] space-y-0.5 overflow-y-auto px-3">
        {filtered.length === 0 && <div className="px-2 py-2 text-[12px] text-white/35">No clients match &ldquo;{query}&rdquo;.</div>}
        {filtered.map((w) => {
          const isActive = w.id === currentWorkspaceId;
          return (
            <div key={w.id} className={`group flex items-center gap-2.5 rounded-lg px-2 py-2 transition ${isActive ? "bg-brass-soft/15" : "hover:bg-white/5"}`}>
              <Link href={`/admin/${w.id}/${currentTab}`} className="flex flex-1 items-center gap-2.5 overflow-hidden">
                <span
                  className="flex h-[15px] w-[15px] flex-shrink-0 items-center justify-center rounded-full border-2 border-navy text-[9px] font-semibold text-navy"
                  style={{ background: w.color }}
                >
                  {w.code}
                </span>
                <span className={`truncate text-[13.5px] font-medium ${isActive ? "text-brass-soft" : "text-parchment"}`}>{w.name}</span>
              </Link>
              <button
                type="button"
                onClick={() => handleRemoveClient(w.id, w.name)}
                className="flex-shrink-0 text-white/25 opacity-0 hover:text-danger group-hover:opacity-100"
                title="Remove client"
              >
                <Icon name="x" className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      <nav className="flex-1 overflow-y-auto px-3">
        {adminNavGroups.map((group) => (
          <div key={group.title ?? "root"} className="mb-3">
            {group.title && (
              <div className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-wide text-white/35">{group.title}</div>
            )}
            {group.items.map((item) => {
              const href = item.href(currentWorkspaceId);
              const isActive = pathname === href;
              if (!item.enabled) {
                return (
                  <div
                    key={item.key}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13.5px] font-medium text-white/30"
                    title="Coming in a later phase"
                  >
                    <Icon name={item.icon} className="h-4 w-4 flex-shrink-0" />
                    <span>{item.label}</span>
                    <span className="ml-auto rounded-full bg-white/10 px-1.5 py-0.5 text-[9px] font-semibold">Soon</span>
                  </div>
                );
              }
              return (
                <Link
                  key={item.key}
                  href={href}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13.5px] font-medium transition ${
                    isActive ? "bg-white/10 text-white" : "text-parchment/72 hover:bg-white/5 hover:text-parchment"
                  }`}
                >
                  <Icon name={item.icon} className="h-4 w-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="mt-2 flex items-center gap-2.5 border-t border-white/10 px-5 pt-3">
        <span className="flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-full bg-brass text-[12px] font-bold text-navy">
          {userName
            .split(" ")
            .map((p) => p[0])
            .join("")
            .toUpperCase()}
        </span>
        <div>
          <div className="text-[12.5px] font-semibold text-parchment">{userName}</div>
          <div className="text-[11px] text-white/45">Account Manager</div>
        </div>
      </div>
    </aside>
  );
}
