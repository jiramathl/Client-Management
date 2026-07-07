import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// Resolves the signed-in client-side member for portal pages/layout.
// Returns null if there's no session or the session isn't a client role —
// callers should redirect to /portal/login in that case.
export async function getCurrentClientMember() {
  const session = await auth();
  if (!session?.user || (session.user.role !== "OWNER" && session.user.role !== "CLIENT")) return null;

  const member = await prisma.member.findUnique({
    where: { id: session.user.id! },
    include: { workspace: { include: { branding: true } } },
  });
  return member;
}

async function getMemberGroupIds(memberId: string) {
  const memberships = await prisma.groupMember.findMany({ where: { memberId }, select: { groupId: true } });
  return memberships.map((m) => m.groupId);
}

// Server-side, query-time group visibility filtering — closes HANDOFF gap #5
// ("File visibility by group should be enforced server-side"). A file with no
// visibleGroupId is visible to everyone in the workspace; otherwise the
// signed-in member must belong to that group.
export async function getClientFiles(workspaceId: string, memberId: string) {
  const groupIds = await getMemberGroupIds(memberId);

  return prisma.file.findMany({
    where: {
      workspaceId,
      OR: [{ visibleGroupId: null }, { visibleGroupId: { in: groupIds } }],
    },
    orderBy: { createdAt: "desc" },
    include: { uploadedBy: true },
  });
}

// Same visibility rule, applied to a single file — used by the portal's file
// detail page and its preview/download routes so a client can't bypass
// group scoping just by guessing a file's URL.
export async function getClientFileDetail(workspaceId: string, memberId: string, fileId: string) {
  const groupIds = await getMemberGroupIds(memberId);
  return prisma.file.findFirst({
    where: {
      id: fileId,
      workspaceId,
      OR: [{ visibleGroupId: null }, { visibleGroupId: { in: groupIds } }],
    },
    include: { uploadedBy: true },
  });
}

export async function getClientHome(workspaceId: string, memberId: string) {
  const [tasks, files, waitingOnApproval, recentActivity] = await Promise.all([
    prisma.task.findMany({ where: { workspaceId } }),
    getClientFiles(workspaceId, memberId),
    prisma.file.findMany({ where: { workspaceId, approvalRequested: true }, take: 5 }),
    prisma.auditEvent.findMany({ where: { workspaceId }, orderBy: { createdAt: "desc" }, take: 5, include: { member: true } }),
  ]);

  const total = tasks.length;
  const done = tasks.filter((t) => t.column === "DONE").length;
  const progress = total === 0 ? 0 : Math.round((done / total) * 100);

  return { progress, recentFiles: files.slice(0, 5), waitingOnApproval, recentActivity };
}

export async function getClientTeam(workspaceId: string) {
  const members = await prisma.member.findMany({ where: { workspaceId }, orderBy: { createdAt: "asc" } });
  return {
    accountTeam: members.filter((m) => m.role === "TEAM"),
    organization: members.filter((m) => m.role !== "TEAM"),
  };
}

export async function getDMThread(workspaceId: string, clientEmail: string) {
  const thread = await prisma.directMessageThread.upsert({
    where: { workspaceId_clientEmail: { workspaceId, clientEmail } },
    create: { workspaceId, clientEmail },
    update: {},
    include: { messages: { orderBy: { createdAt: "asc" }, include: { author: true } } },
  });
  return thread;
}
