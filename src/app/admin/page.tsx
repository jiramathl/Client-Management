import { redirect } from "next/navigation";
import { getWorkspaces } from "@/lib/data/admin";

export default async function AdminRootPage() {
  const workspaces = await getWorkspaces();
  if (workspaces.length === 0) redirect("/admin/login");
  redirect(`/admin/${workspaces[0].id}/overview`);
}
