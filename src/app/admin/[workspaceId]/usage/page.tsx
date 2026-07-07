import Link from "next/link";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { Panel, PanelHead } from "@/components/ui/Panel";
import { StatCard } from "@/components/ui/StatCard";
import { usageCategories } from "@/lib/catalogs";
import { getUsageEvents, getWorkspace } from "@/lib/data/admin";

export default async function UsagePage(props: PageProps<"/admin/[workspaceId]/usage">) {
  const { workspaceId } = await props.params;
  const searchParams = await props.searchParams;
  const category = typeof searchParams.category === "string" ? searchParams.category : "All";

  const [workspace, allEvents, filteredEvents] = await Promise.all([
    getWorkspace(workspaceId),
    getUsageEvents(workspaceId),
    getUsageEvents(workspaceId, category),
  ]);
  if (!workspace) return null;

  const counts = Object.fromEntries(usageCategories.map((c) => [c, allEvents.filter((e) => e.category === c).length]));
  const topCategories = usageCategories.slice(0, 3);

  return (
    <>
      <AdminTopbar eyebrow={workspace.name} title="Usage" />
      <div className="flex-1 p-7">
        <div className="mb-5 grid grid-cols-4 gap-3.5">
          <StatCard num={String(allEvents.length)} label="Total events" />
          {topCategories.map((c) => (
            <StatCard key={c} num={String(counts[c] ?? 0)} label={c} />
          ))}
        </div>

        <Panel>
          <PanelHead>
            <div className="flex items-center gap-2 overflow-x-auto">
              {["All", ...usageCategories].map((c) => (
                <Link
                  key={c}
                  href={`/admin/${workspaceId}/usage${c === "All" ? "" : `?category=${c}`}`}
                  className={`whitespace-nowrap rounded-full px-3 py-1.5 text-[12px] font-semibold ${
                    category === c ? "bg-navy text-white" : "bg-parchment-2 text-slate"
                  }`}
                >
                  {c}
                </Link>
              ))}
            </div>
          </PanelHead>
          {filteredEvents.length === 0 ? (
            <div className="p-8 text-center text-[13px] text-slate-light">No activity in this category.</div>
          ) : (
            filteredEvents.map((e) => (
              <div key={e.id} className="flex items-center justify-between border-b border-parchment-2 px-[18px] py-3 last:border-b-0">
                <div>
                  <span className="mr-2 rounded-full bg-parchment-2 px-2 py-0.5 text-[10.5px] font-semibold text-slate">{e.category}</span>
                  <span className="text-[13px] text-ink">
                    <b>{e.member?.name ?? "Someone"}</b> {e.action}
                  </span>
                </div>
                <span className="text-[11px] text-slate-light">{e.createdAt.toLocaleString()}</span>
              </div>
            ))
          )}
        </Panel>
      </div>
    </>
  );
}
