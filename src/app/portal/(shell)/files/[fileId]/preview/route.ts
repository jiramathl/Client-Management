import { NextResponse } from "next/server";
import { storage } from "@/lib/storage";
import { getMimeType } from "@/lib/fileKind";
import { getClientFileDetail, getCurrentClientMember } from "@/lib/data/portal";

export async function GET(_req: Request, ctx: RouteContext<"/portal/files/[fileId]/preview">) {
  const member = await getCurrentClientMember();
  if (!member) return new NextResponse("Unauthorized", { status: 401 });

  const { fileId } = await ctx.params;
  const file = await getClientFileDetail(member.workspaceId, member.id, fileId);
  if (!file?.storageKey) return new NextResponse("Not found", { status: 404 });

  const buffer = await storage.read(file.storageKey);
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": getMimeType(file.name),
      "Content-Disposition": `inline; filename="${encodeURIComponent(file.name)}"`,
    },
  });
}
