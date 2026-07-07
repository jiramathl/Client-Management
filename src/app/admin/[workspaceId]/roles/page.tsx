import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { Panel, PanelHead } from "@/components/ui/Panel";
import { Icon } from "@/lib/icons";
import { roleDefs } from "@/lib/catalogs";
import { getRolesData, getWorkspace } from "@/lib/data/admin";
import { approvePendingRequest, denyPendingRequest, toggleCanApprove } from "@/lib/actions/admin";

function Check({ on }: { on: boolean }) {
  return on ? <Icon name="check" className="h-4 w-4 text-success" /> : <span className="text-slate-light">—</span>;
}

export default async function RolesPage(props: PageProps<"/admin/[workspaceId]/roles">) {
  const { workspaceId } = await props.params;
  const [workspace, { members, pendingRequests }] = await Promise.all([getWorkspace(workspaceId), getRolesData(workspaceId)]);
  if (!workspace) return null;

  return (
    <>
      <AdminTopbar eyebrow={workspace.name} title="Roles & SSO" />
      <div className="flex-1 space-y-5 p-7">
        <Panel>
          <PanelHead>
            <h3 className="font-serif text-[14.5px] font-semibold">Role permissions</h3>
          </PanelHead>
          <div className="grid grid-cols-[140px_1fr_60px_60px_60px_60px] gap-2.5 border-b border-parchment-2 px-[18px] py-2.5 text-[11px] font-semibold uppercase tracking-wide text-slate-light">
            <span>Role</span>
            <span>Description</span>
            <span>View</span>
            <span>Upload</span>
            <span>Invite</span>
            <span>Manage</span>
          </div>
          {roleDefs.map((r) => (
            <div key={r.key} className="grid grid-cols-[140px_1fr_60px_60px_60px_60px] items-center gap-2.5 border-b border-parchment-2 px-[18px] py-3 text-[13px] last:border-b-0">
              <span className="font-semibold text-ink">{r.label}</span>
              <span className="text-slate">{r.desc}</span>
              <Check on={r.view} />
              <Check on={r.upload} />
              <Check on={r.invite} />
              <Check on={r.manage} />
            </div>
          ))}
        </Panel>

        <Panel>
          <PanelHead>
            <h3 className="font-serif text-[14.5px] font-semibold">Approval permission</h3>
          </PanelHead>
          {members.map((m) => (
            <div key={m.id} className="flex items-center justify-between border-b border-parchment-2 px-[18px] py-3 last:border-b-0">
              <div>
                <div className="text-[13px] font-medium text-ink">{m.name}</div>
                <div className="text-[11px] text-slate-light">{m.email}</div>
              </div>
              <form action={toggleCanApprove}>
                <input type="hidden" name="workspaceId" value={workspaceId} />
                <input type="hidden" name="memberId" value={m.id} />
                <input type="hidden" name="nextValue" value={(!m.canApprove).toString()} />
                <button type="submit" className="relative h-[22px] w-[38px] rounded-full transition" style={{ background: m.canApprove ? "#3D7A5C" : "#DFD7C6" }}>
                  <span
                    className="absolute top-[3px] h-4 w-4 rounded-full bg-white shadow transition-all"
                    style={{ left: m.canApprove ? 17 : 3 }}
                  />
                </button>
              </form>
            </div>
          ))}
        </Panel>

        <Panel>
          <PanelHead>
            <h3 className="font-serif text-[14.5px] font-semibold">Pending SSO requests</h3>
          </PanelHead>
          {pendingRequests.length === 0 ? (
            <div className="p-8 text-center text-[13px] text-slate-light">No one waiting on access.</div>
          ) : (
            pendingRequests.map((p) => (
              <div key={p.id} className="flex items-center justify-between border-b border-parchment-2 px-[18px] py-3 last:border-b-0">
                <div>
                  <div className="text-[13px] font-medium text-ink">{p.name}</div>
                  <div className="text-[11px] text-slate-light">
                    {p.email} · via {p.provider}
                  </div>
                </div>
                <div className="flex gap-2">
                  <form action={approvePendingRequest}>
                    <input type="hidden" name="workspaceId" value={workspaceId} />
                    <input type="hidden" name="requestId" value={p.id} />
                    <button type="submit" className="rounded-lg bg-success px-3 py-1.5 text-[11.5px] font-semibold text-white">
                      Approve
                    </button>
                  </form>
                  <form action={denyPendingRequest}>
                    <input type="hidden" name="workspaceId" value={workspaceId} />
                    <input type="hidden" name="requestId" value={p.id} />
                    <button type="submit" className="rounded-lg bg-parchment-2 px-3 py-1.5 text-[11.5px] font-semibold text-ink">
                      Deny
                    </button>
                  </form>
                </div>
              </div>
            ))
          )}
        </Panel>
      </div>
    </>
  );
}
