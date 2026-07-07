import { prisma } from "@/lib/prisma";

export function getWorkspaces() {
  return prisma.workspace.findMany({ orderBy: { createdAt: "asc" } });
}

export function getWorkspace(id: string) {
  return prisma.workspace.findUnique({ where: { id } });
}

export async function getOverviewData(workspaceId: string) {
  const [workspace, fileCount, openTaskCount, memberCount, recentAudit, dueSoonTasks] = await Promise.all([
    prisma.workspace.findUnique({ where: { id: workspaceId } }),
    prisma.file.count({ where: { workspaceId } }),
    prisma.task.count({ where: { workspaceId, column: { in: ["TODO", "DOING"] } } }),
    prisma.member.count({ where: { workspaceId } }),
    prisma.auditEvent.findMany({
      where: { workspaceId },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { member: true },
    }),
    prisma.task.findMany({
      where: { workspaceId, column: { in: ["TODO", "DOING"] } },
      orderBy: { dueDate: "asc" },
      take: 5,
      include: { assignee: true },
    }),
  ]);

  return { workspace, fileCount, openTaskCount, memberCount, recentAudit, dueSoonTasks };
}

export function getFiles(workspaceId: string) {
  return prisma.file.findMany({
    where: { workspaceId },
    orderBy: { createdAt: "desc" },
    include: { uploadedBy: true, visibleGroup: true },
  });
}

export async function getTasksByColumn(workspaceId: string) {
  const tasks = await prisma.task.findMany({
    where: { workspaceId },
    orderBy: { dueDate: "asc" },
    include: { assignee: true },
  });
  return {
    TODO: tasks.filter((t) => t.column === "TODO"),
    DOING: tasks.filter((t) => t.column === "DOING"),
    DONE: tasks.filter((t) => t.column === "DONE"),
  };
}

export function getMembers(workspaceId: string) {
  return prisma.member.findMany({ where: { workspaceId }, orderBy: { createdAt: "asc" } });
}

export function getGroups(workspaceId: string) {
  return prisma.group.findMany({
    where: { workspaceId },
    include: { members: { include: { member: true } } },
    orderBy: { name: "asc" },
  });
}

export async function getRolesData(workspaceId: string) {
  const [members, pendingRequests] = await Promise.all([
    prisma.member.findMany({ where: { workspaceId }, orderBy: { createdAt: "asc" } }),
    prisma.pendingRequest.findMany({ where: { workspaceId }, orderBy: { requestedAt: "desc" } }),
  ]);
  return { members, pendingRequests };
}

export async function getSecurityData(workspaceId: string) {
  const [security, auditEvents] = await Promise.all([
    prisma.securitySettings.findUnique({ where: { workspaceId } }),
    prisma.auditEvent.findMany({ where: { workspaceId }, orderBy: { createdAt: "desc" }, take: 20, include: { member: true } }),
  ]);
  return { security, auditEvents };
}

export function getUsageEvents(workspaceId: string, category?: string) {
  return prisma.usageEvent.findMany({
    where: { workspaceId, ...(category && category !== "All" ? { category } : {}) },
    orderBy: { createdAt: "desc" },
    include: { member: true },
  });
}

export async function getIntegrationsData(workspaceId: string) {
  const [integrations, salesforceSync] = await Promise.all([
    prisma.integration.findMany({ where: { workspaceId } }),
    prisma.salesforceSync.findUnique({ where: { workspaceId } }),
  ]);
  return { integrations, salesforceSync };
}

export function getBranding(workspaceId: string) {
  return prisma.brandingSettings.findUnique({ where: { workspaceId } });
}

export async function getFileDetail(workspaceId: string, fileId: string) {
  const file = await prisma.file.findFirst({
    where: { id: fileId, workspaceId },
    include: {
      uploadedBy: true,
      visibleGroup: true,
      views: { orderBy: { viewedAt: "desc" }, include: { member: true } },
    },
  });
  return file;
}

export function findMemberByEmail(workspaceId: string, email: string) {
  return prisma.member.findUnique({ where: { workspaceId_email: { workspaceId, email } } });
}
