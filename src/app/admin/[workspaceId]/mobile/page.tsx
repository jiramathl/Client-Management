import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { Panel, PanelHead } from "@/components/ui/Panel";
import { Icon } from "@/lib/icons";
import { getWorkspace } from "@/lib/data/admin";

export default async function MobilePage(props: PageProps<"/admin/[workspaceId]/mobile">) {
  const { workspaceId } = await props.params;
  const workspace = await getWorkspace(workspaceId);
  if (!workspace) return null;

  return (
    <>
      <AdminTopbar eyebrow={workspace.name} title="Mobile" />
      <div className="flex-1 p-7">
        <Panel>
          <PanelHead>
            <h3 className="font-serif text-[14.5px] font-semibold">The portal, installable on your client&apos;s phone</h3>
          </PanelHead>
          <div className="grid grid-cols-[1fr_220px] gap-6 p-[18px]">
            <div>
              <p className="mb-4 text-[13.5px] leading-relaxed text-slate">
                Harbor&apos;s Client Portal is a Progressive Web App — {workspace.name}&apos;s contacts can add it to
                their home screen straight from their browser, full-screen and branded, with no app-store review
                cycle standing between an update and their device.
              </p>
              <ul className="space-y-2.5 text-[13px] text-ink">
                <li className="flex items-start gap-2">
                  <Icon name="check" className="mt-0.5 h-4 w-4 flex-shrink-0 text-success" />
                  Same files, tasks, and message thread as desktop — reflowed, not a stripped-down &ldquo;mobile
                  version.&rdquo;
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="check" className="mt-0.5 h-4 w-4 flex-shrink-0 text-success" />
                  Installs from any modern mobile browser — Chrome, Edge, and Safari on iOS 16.4+.
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="check" className="mt-0.5 h-4 w-4 flex-shrink-0 text-success" />
                  Share the link below — it&apos;s the same sign-in {workspace.name}&apos;s contacts already use.
                </li>
              </ul>
              <div className="mt-5 rounded-lg border border-border bg-parchment px-3.5 py-2.5 font-mono text-[12.5px] text-ink">
                harbor.app/portal/login
              </div>
            </div>

            <div className="flex flex-col items-center gap-3">
              <div className="grid grid-cols-6 gap-[3px] rounded-lg border border-border bg-white p-3">
                {Array.from({ length: 36 }).map((_, i) => (
                  <span key={i} className={`h-3 w-3 rounded-sm ${[2, 3, 5, 7, 9, 11, 14, 16, 18, 20, 23, 25, 27, 29, 31, 33].includes(i) ? "bg-navy" : "bg-parchment-2"}`} />
                ))}
              </div>
              <span className="text-center text-[11px] text-slate-light">Share the link — a real QR code is a Phase 5 addition</span>
            </div>
          </div>
        </Panel>
      </div>
    </>
  );
}
