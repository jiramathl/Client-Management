import { redirect } from "next/navigation";
import { getCurrentClientMember } from "@/lib/data/portal";
import { PortalHeader } from "@/components/portal/PortalHeader";

export default async function PortalShellLayout({ children }: { children: React.ReactNode }) {
  const member = await getCurrentClientMember();
  if (!member) redirect("/portal/login");

  const branding = member.workspace.branding;

  return (
    <div className="min-h-screen bg-parchment">
      <PortalHeader
        workspaceName={branding?.name ?? member.workspace.name}
        memberName={member.name}
        primaryColor={branding?.primaryColor ?? "#10263B"}
        accentColor={branding?.accentColor ?? "#C08829"}
      />
      <div className="mx-auto max-w-[980px] px-8 py-7">{children}</div>
    </div>
  );
}
