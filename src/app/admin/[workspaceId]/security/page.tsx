import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { Panel, PanelHead } from "@/components/ui/Panel";
import { complianceBadges } from "@/lib/catalogs";
import { getSecurityData, getWorkspace } from "@/lib/data/admin";
import { updateSecurity } from "@/lib/actions/admin";

const toggles = [
  { field: "twoFA" as const, name: "Require two-factor authentication", desc: "Every member must confirm sign-in with a second factor." },
  { field: "sso" as const, name: "Enforce SSO sign-in", desc: "Block password-only sign-in for this workspace." },
  { field: "watermark" as const, name: "Watermark all files", desc: "Stamp every file with the viewer's identity." },
];

export default async function SecurityPage(props: PageProps<"/admin/[workspaceId]/security">) {
  const { workspaceId } = await props.params;
  const [workspace, { security, auditEvents }] = await Promise.all([getWorkspace(workspaceId), getSecurityData(workspaceId)]);
  if (!workspace || !security) return null;

  return (
    <>
      <AdminTopbar eyebrow={workspace.name} title="Security" />
      <div className="flex-1 p-7">
        <div className="grid grid-cols-[1.6fr_1fr] items-start gap-4.5">
          <div className="space-y-5">
            <Panel>
              <PanelHead>
                <h3 className="font-serif text-[14.5px] font-semibold">Access policy</h3>
              </PanelHead>
              {toggles.map((t) => {
                const on = security[t.field];
                return (
                  <div key={t.field} className="flex items-center justify-between border-b border-parchment-2 px-[18px] py-3.5 last:border-b-0">
                    <div>
                      <div className="text-[13.5px] font-semibold text-ink">{t.name}</div>
                      <div className="mt-0.5 text-[12px] text-slate-light">{t.desc}</div>
                    </div>
                    <form action={updateSecurity}>
                      <input type="hidden" name="workspaceId" value={workspaceId} />
                      <input type="hidden" name="field" value={t.field} />
                      <input type="hidden" name="nextValue" value={(!on).toString()} />
                      <button type="submit" className="relative h-[22px] w-[38px] flex-shrink-0 rounded-full transition" style={{ background: on ? "#3D7A5C" : "#DFD7C6" }}>
                        <span className="absolute top-[3px] h-4 w-4 rounded-full bg-white shadow transition-all" style={{ left: on ? 17 : 3 }} />
                      </button>
                    </form>
                  </div>
                );
              })}
            </Panel>

            <Panel>
              <PanelHead>
                <h3 className="font-serif text-[14.5px] font-semibold">Audit trail</h3>
              </PanelHead>
              {auditEvents.length === 0 ? (
                <div className="p-8 text-center text-[13px] text-slate-light">Nothing logged yet.</div>
              ) : (
                auditEvents.map((a) => (
                  <div key={a.id} className="grid grid-cols-[120px_1fr_140px] items-center gap-2.5 border-b border-parchment-2 px-[18px] py-2.5 text-[12.5px] last:border-b-0">
                    <span className="text-[11px] text-slate-light">{a.createdAt.toLocaleString()}</span>
                    <span className="text-ink">
                      <b>{a.member?.name ?? "Unknown"}</b> — {a.action}
                    </span>
                    <span className="text-right text-[11px] text-slate-light">{a.ip ?? "—"}</span>
                  </div>
                ))
              )}
            </Panel>
          </div>

          <Panel>
            <PanelHead>
              <h3 className="font-serif text-[14.5px] font-semibold">Compliance</h3>
            </PanelHead>
            <div className="grid grid-cols-2 gap-2.5 p-[18px]">
              {complianceBadges.map((b) => (
                <div key={b.code} className="rounded-[9px] border border-border bg-parchment p-3 text-center">
                  <div className="mx-auto mb-2 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-navy text-[12px] font-bold text-brass-soft">
                    {b.code.slice(0, 3)}
                  </div>
                  <div className="text-[11.5px] font-bold text-ink">{b.name}</div>
                  <div className="mt-0.5 text-[10px] text-slate-light">{b.sub}</div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
}
