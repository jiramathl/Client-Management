import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { StatCard } from "@/components/ui/StatCard";
import { Panel, PanelHead } from "@/components/ui/Panel";
import { getOverviewData } from "@/lib/data/admin";

export default async function OverviewPage(props: PageProps<"/admin/[workspaceId]/overview">) {
  const { workspaceId } = await props.params;
  const { workspace, fileCount, openTaskCount, memberCount, recentAudit, dueSoonTasks } = await getOverviewData(workspaceId);
  if (!workspace) return null;

  return (
    <>
      <AdminTopbar eyebrow={workspace.name} title="Overview" />
      <div className="flex-1 p-7">
        <div className="mb-6 grid grid-cols-4 gap-3.5">
          <StatCard num={String(fileCount)} label="Files" />
          <StatCard num={String(openTaskCount)} label="Open tasks" />
          <StatCard num={String(memberCount)} label="Members" />
          <StatCard num={workspace.plan} label="Plan" />
        </div>

        <div className="grid grid-cols-[1.6fr_1fr] items-start gap-4.5">
          <Panel>
            <PanelHead>
              <h3 className="font-serif text-[14.5px] font-semibold">Recent activity</h3>
            </PanelHead>
            {recentAudit.length === 0 ? (
              <div className="p-6 text-center text-[13px] text-slate-light">Nothing logged yet.</div>
            ) : (
              recentAudit.map((a) => (
                <div key={a.id} className="border-b border-parchment-2 px-[18px] py-3.5 last:border-b-0">
                  <div className="text-[13px] leading-relaxed">
                    <b>{a.member?.name ?? "Someone"}</b> {a.action}
                  </div>
                  <div className="mt-0.5 text-[11px] text-slate-light">{a.createdAt.toLocaleDateString()}</div>
                </div>
              ))
            )}
          </Panel>

          <Panel>
            <PanelHead>
              <h3 className="font-serif text-[14.5px] font-semibold">Due soon</h3>
            </PanelHead>
            {dueSoonTasks.length === 0 ? (
              <div className="p-6 text-center text-[13px] text-slate-light">Nothing due soon.</div>
            ) : (
              dueSoonTasks.map((t) => (
                <div key={t.id} className="flex items-center justify-between border-b border-parchment-2 px-[18px] py-3 last:border-b-0">
                  <span className="text-[13px] font-medium text-ink">{t.title}</span>
                  <span className="text-[11px] text-slate-light">{t.dueDate?.toLocaleDateString() ?? "—"}</span>
                </div>
              ))
            )}
          </Panel>
        </div>
      </div>
    </>
  );
}
