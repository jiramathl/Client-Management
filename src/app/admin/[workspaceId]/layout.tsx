import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getWorkspace, getWorkspaces } from "@/lib/data/admin";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminWorkspaceLayout(props: LayoutProps<"/admin/[workspaceId]">) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const { workspaceId } = await props.params;
  const [workspace, workspaces] = await Promise.all([getWorkspace(workspaceId), getWorkspaces()]);
  if (!workspace) notFound();

  return (
    <div className="flex min-h-screen">
      <AdminSidebar workspaces={workspaces} currentWorkspaceId={workspace.id} userName={session.user.name ?? "You"} />
      <div className="flex flex-1 flex-col">{props.children}</div>
    </div>
  );
}
