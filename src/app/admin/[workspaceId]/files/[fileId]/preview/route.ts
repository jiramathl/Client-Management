import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { storage } from "@/lib/storage";
import { getMimeType } from "@/lib/fileKind";

// Inline rendering for the file detail page's preview panel — distinct from
// /download (which forces "Save As" and is the action the audit trail logs).
export async function GET(_req: Request, ctx: RouteContext<"/admin/[workspaceId]/files/[fileId]/preview">) {
  const session = await auth();
  if (!session?.user || session.user.role !== "TEAM") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { workspaceId, fileId } = await ctx.params;
  const file = await prisma.file.findFirst({ where: { id: fileId, workspaceId } });
  if (!file?.storageKey) return new NextResponse("Not found", { status: 404 });

  const buffer = await storage.read(file.storageKey);
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": getMimeType(file.name),
      "Content-Disposition": `inline; filename="${encodeURIComponent(file.name)}"`,
    },
  });
}
