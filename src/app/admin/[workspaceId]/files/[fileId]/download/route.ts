import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { storage } from "@/lib/storage";
import { currentMember } from "@/lib/actions/admin";
import { logActivity } from "@/lib/activityLog";

export async function GET(_req: Request, ctx: RouteContext<"/admin/[workspaceId]/files/[fileId]/download">) {
  const session = await auth();
  if (!session?.user || session.user.role !== "TEAM") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { workspaceId, fileId } = await ctx.params;
  const file = await prisma.file.findFirst({ where: { id: fileId, workspaceId } });
  if (!file?.storageKey) return new NextResponse("Not found", { status: 404 });

  const actor = await currentMember(workspaceId);
  await logActivity({ workspaceId, memberId: actor?.id, category: "Files", action: `Downloaded ${file.name}` });

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
