import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { Panel, PanelHead } from "@/components/ui/Panel";
import { BrandingForm } from "@/components/admin/BrandingForm";
import { getBranding, getWorkspace } from "@/lib/data/admin";

export default async function BrandingPage(props: PageProps<"/admin/[workspaceId]/branding">) {
  const { workspaceId } = await props.params;
  const [workspace, branding] = await Promise.all([getWorkspace(workspaceId), getBranding(workspaceId)]);
  if (!workspace || !branding) return null;

  return (
    <>
      <AdminTopbar eyebrow={workspace.name} title="Branding" />
      <div className="flex-1 p-7">
        <Panel>
          <PanelHead>
            <h3 className="font-serif text-[14.5px] font-semibold">Make this portal unmistakably yours</h3>
          </PanelHead>
          <div className="p-[18px]">
            <BrandingForm
              key={`${branding.name}-${branding.domain}-${branding.primaryColor}-${branding.accentColor}`}
              workspaceId={workspaceId}
              branding={branding}
            />
          </div>
        </Panel>
      </div>
    </>
  );
}
