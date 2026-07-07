import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

// Single write path for "did something happen" — every mutating action in
// the app should call this instead of writing UsageEvent/AuditEvent by hand.
// Closes HANDOFF gap #1 for both tables: uploads, downloads, approvals, and
// every settings change become a real, queryable trail instead of a
// once-seeded array. AuditEvent additionally carries a best-effort IP for
// the Security tab's compliance-flavored view of the same activity.
export async function logActivity({
  workspaceId,
  memberId,
  category,
  action,
}: {
  workspaceId: string;
  memberId?: string | null;
  category: string;
  action: string;
}) {
  const ip = await getRequestIp();

  await Promise.all([
    prisma.usageEvent.create({ data: { workspaceId, memberId, category, action } }),
    prisma.auditEvent.create({ data: { workspaceId, memberId, action, ip } }),
  ]);
}

async function getRequestIp() {
  try {
    const h = await headers();
    return h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? h.get("x-real-ip") ?? "local";
  } catch {
    return "local";
  }
}
