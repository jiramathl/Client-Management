import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { Panel } from "@/components/ui/Panel";
import { integrationsCatalog } from "@/lib/catalogs";
import { getIntegrationsData, getWorkspace } from "@/lib/data/admin";
import { toggleIntegration } from "@/lib/actions/admin";

export default async function IntegrationsPage(props: PageProps<"/admin/[workspaceId]/integrations">) {
  const { workspaceId } = await props.params;
  const [workspace, { integrations, salesforceSync }] = await Promise.all([getWorkspace(workspaceId), getIntegrationsData(workspaceId)]);
  if (!workspace) return null;

  const enabledByCode = new Map(integrations.map((i) => [i.code, i.enabled]));
  const salesforceEnabled = enabledByCode.get("SF");

  return (
    <>
      <AdminTopbar eyebrow={workspace.name} title="Integrations" />
      <div className="flex-1 p-7">
        {salesforceEnabled && salesforceSync && (
          <Panel className="mb-5">
            <div className="flex items-center justify-between border-b border-border px-[18px] py-3.5">
              <h3 className="font-serif text-[14.5px] font-semibold">Salesforce sync</h3>
              <span className="text-[11.5px] font-semibold text-success">Connected</span>
            </div>
            <div className="grid grid-cols-4 gap-4 p-[18px] text-[13px]">
              <div>
                <div className="text-[11px] text-slate-light">Account</div>
                <div className="font-medium text-ink">{salesforceSync.account}</div>
              </div>
              <div>
                <div className="text-[11px] text-slate-light">Contact</div>
                <div className="font-medium text-ink">{salesforceSync.contact}</div>
              </div>
              <div>
                <div className="text-[11px] text-slate-light">Records synced</div>
                <div className="font-medium text-ink">{salesforceSync.recordsSynced}</div>
              </div>
              <div>
                <div className="text-[11px] text-slate-light">Last synced</div>
                <div className="font-medium text-ink">{salesforceSync.lastSyncedAt.toLocaleString()}</div>
              </div>
            </div>
          </Panel>
        )}

        <div className="grid grid-cols-4 gap-3">
          {integrationsCatalog.map((cat) => {
            const enabled = enabledByCode.get(cat.code) ?? false;
            return (
              <div key={cat.code} className="flex flex-col gap-2 rounded-[10px] border border-border bg-white p-3.5">
                <div className="flex items-center justify-between">
                  <span className="flex h-[34px] w-[34px] items-center justify-center rounded-lg bg-parchment text-[13px] font-bold text-teal">{cat.code[0]}</span>
                  <form action={toggleIntegration}>
                    <input type="hidden" name="workspaceId" value={workspaceId} />
                    <input type="hidden" name="code" value={cat.code} />
                    <input type="hidden" name="nextValue" value={(!enabled).toString()} />
                    <button
                      type="submit"
                      className={`rounded-md px-2.5 py-1 text-[11px] font-semibold ${enabled ? "bg-[#E5F1EA] text-success" : "bg-parchment-2 text-slate"}`}
                    >
                      {enabled ? "Connected" : "Connect"}
                    </button>
                  </form>
                </div>
                <div className="text-[13px] font-semibold text-ink">{cat.name}</div>
                <div className="text-[11.5px] leading-relaxed text-slate-light">{cat.desc}</div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
