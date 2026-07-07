import { NextResponse } from "next/server";
import { storage } from "@/lib/storage";
import { getClientFileDetail, getCurrentClientMember } from "@/lib/data/portal";
import { logActivity } from "@/lib/activityLog";

export async function GET(_req: Request, ctx: RouteContext<"/portal/files/[fileId]/download">) {
  const member = await getCurrentClientMember();
  if (!member) return new NextResponse("Unauthorized", { status: 401 });

  const { fileId } = await ctx.params;
  // Re-checks group visibility server-side — a client can't bypass scoping
  // just by guessing a file id in the URL.
  const file = await getClientFileDetail(member.workspaceId, member.id, fileId);
  if (!file?.storageKey) return new NextResponse("Not found", { status: 404 });

  await logActivity({ workspaceId: member.workspaceId, memberId: member.id, category: "Files", action: `Downloaded ${file.name}` });

  const buffer = await storage.read(file.storageKey);
  const bytes = new Uint8Array(buffer);
  return new NextResponse(bytes, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="${encodeURIComponent(file.name)}"`,
      "Content-Length": String(bytes.length),
    },
  });
}
