"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { clientColorPalette, orgInitials, uniqueSlug } from "@/lib/workspaceHelpers";
import { integrationsCatalog } from "@/lib/catalogs";
import { storage } from "@/lib/storage";
import { logActivity } from "@/lib/activityLog";
import bcrypt from "bcryptjs";

function revalidateTab(workspaceId: string, tab: string) {
  revalidatePath(`/admin/${workspaceId}/${tab}`);
}

// Resolves the signed-in TEAM member's row *within this specific workspace*
// (each workspace has its own Member row for "You" — see prisma/seed.ts).
// Exported so route handlers (file preview/download) can attribute activity
// log entries to the right person too.
export async function currentMember(workspaceId: string) {
  const session = await auth();
  if (!session?.user?.email) return null;
  return prisma.member.findUnique({ where: { workspaceId_email: { workspaceId, email: session.user.email } } });
}

// ---------- Clients (workspaces) ----------

export async function createClient({ name, ownerName, ownerEmail }: { name: string; ownerName: string; ownerEmail: string }) {
  const existing = await prisma.workspace.findMany({ select: { id: true } });
  const id = uniqueSlug(name, existing.map((w) => w.id));
  const color = clientColorPalette[existing.length % clientColorPalette.length];
  const domain = `portal.${id.replace(/-/g, "")}.com`;

  const workspace = await prisma.workspace.create({
    data: {
      id,
      name,
      code: orgInitials(name),
      color,
      plan: "Standard",
      quotaGB: 2,
      members: { create: { name: ownerName, email: ownerEmail, role: "OWNER", status: "OFFLINE" } },
      security: { create: { twoFA: false, sso: false, watermark: false } },
      branding: {
        create: {
          name,
          primaryColor: "#10263B",
          accentColor: color,
          domain,
          defaultName: name,
          defaultPrimaryColor: "#10263B",
          defaultAccentColor: color,
          defaultDomain: domain,
        },
      },
      integrations: { create: integrationsCatalog.map((i) => ({ code: i.code, enabled: false })) },
    },
  });

  await logActivity({ workspaceId: workspace.id, category: "Members", action: `Client created with owner ${ownerEmail}` });
  return { id: workspace.id };
}

export async function deleteClient({ workspaceId, currentWorkspaceId }: { workspaceId: string; currentWorkspaceId: string }) {
  const remaining = await prisma.workspace.count();
  if (remaining <= 1) throw new Error("At least one client must remain.");

  await prisma.workspace.delete({ where: { id: workspaceId } });

  if (workspaceId === currentWorkspaceId) {
    const next = await prisma.workspace.findFirst({ where: { NOT: { id: workspaceId } }, orderBy: { createdAt: "asc" } });
    if (next) redirect(`/admin/${next.id}/overview`);
  }
}

// ---------- Members ----------

export async function inviteMember(formData: FormData) {
  const workspaceId = formData.get("workspaceId") as string;
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;
  if (!name || !email || !password) return;

  const actor = await currentMember(workspaceId);
  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.member.create({
    data: { workspaceId, name, email, role: "CLIENT", status: "OFFLINE", passwordHash },
  });
  await logActivity({ workspaceId, memberId: actor?.id, category: "Members", action: `Invited ${email}` });
  revalidateTab(workspaceId, "members");
}

export async function setMemberPassword(formData: FormData) {
  const workspaceId = formData.get("workspaceId") as string;
  const memberId = formData.get("memberId") as string;
  const password = formData.get("password") as string;
  if (!password || password.length < 6) return;

  const actor = await currentMember(workspaceId);
  const target = await prisma.member.update({
    where: { id: memberId },
    data: { passwordHash: await bcrypt.hash(password, 10) },
  });
  await logActivity({ workspaceId, memberId: actor?.id, category: "Security", action: `Reset password for ${target.name}` });
  revalidateTab(workspaceId, "members");
}

export async function removeMember(formData: FormData) {
  const workspaceId = formData.get("workspaceId") as string;
  const memberId = formData.get("memberId") as string;
  const actor = await currentMember(workspaceId);
  const removed = await prisma.member.findUnique({ where: { id: memberId } });
  await prisma.member.delete({ where: { id: memberId } });
  await logActivity({ workspaceId, memberId: actor?.id, category: "Members", action: `Removed ${removed?.name ?? "a member"}` });
  revalidateTab(workspaceId, "members");
  revalidateTab(workspaceId, "groups");
  revalidateTab(workspaceId, "roles");
}

// ---------- Groups ----------

export async function createGroup(formData: FormData) {
  const workspaceId = formData.get("workspaceId") as string;
  const name = (formData.get("name") as string)?.trim();
  if (!name) return;
  const actor = await currentMember(workspaceId);
  await prisma.group.create({ data: { workspaceId, name } });
  await logActivity({ workspaceId, memberId: actor?.id, category: "Members", action: `Created group "${name}"` });
  revalidateTab(workspaceId, "groups");
}

export async function deleteGroup(formData: FormData) {
  const workspaceId = formData.get("workspaceId") as string;
  const groupId = formData.get("groupId") as string;
  const actor = await currentMember(workspaceId);
  const group = await prisma.group.findUnique({ where: { id: groupId } });
  await prisma.group.delete({ where: { id: groupId } });
  await logActivity({ workspaceId, memberId: actor?.id, category: "Members", action: `Deleted group "${group?.name ?? groupId}"` });
  revalidateTab(workspaceId, "groups");
}

export async function addMemberToGroup(formData: FormData) {
  const workspaceId = formData.get("workspaceId") as string;
  const groupId = formData.get("groupId") as string;
  const memberId = formData.get("memberId") as string;
  if (!memberId) return;
  const actor = await currentMember(workspaceId);
  const [group, target] = await Promise.all([
    prisma.group.findUnique({ where: { id: groupId } }),
    prisma.member.findUnique({ where: { id: memberId } }),
  ]);
  await prisma.groupMember.upsert({
    where: { groupId_memberId: { groupId, memberId } },
    create: { groupId, memberId },
    update: {},
  });
  await logActivity({
    workspaceId,
    memberId: actor?.id,
    category: "Members",
    action: `Added ${target?.name ?? "a member"} to "${group?.name ?? groupId}"`,
  });
  revalidateTab(workspaceId, "groups");
}

export async function removeMemberFromGroup(formData: FormData) {
  const workspaceId = formData.get("workspaceId") as string;
  const groupId = formData.get("groupId") as string;
  const memberId = formData.get("memberId") as string;
  const actor = await currentMember(workspaceId);
  const [group, target] = await Promise.all([
    prisma.group.findUnique({ where: { id: groupId } }),
    prisma.member.findUnique({ where: { id: memberId } }),
  ]);
  await prisma.groupMember.delete({ where: { groupId_memberId: { groupId, memberId } } });
  await logActivity({
    workspaceId,
    memberId: actor?.id,
    category: "Members",
    action: `Removed ${target?.name ?? "a member"} from "${group?.name ?? groupId}"`,
  });
  revalidateTab(workspaceId, "groups");
}

// ---------- Roles & SSO ----------

export async function toggleCanApprove(formData: FormData) {
  const workspaceId = formData.get("workspaceId") as string;
  const memberId = formData.get("memberId") as string;
  const nextValue = formData.get("nextValue") === "true";
  const actor = await currentMember(workspaceId);
  const target = await prisma.member.update({ where: { id: memberId }, data: { canApprove: nextValue } });
  await logActivity({
    workspaceId,
    memberId: actor?.id,
    category: "Security",
    action: `${nextValue ? "Granted" : "Revoked"} approval permission for ${target.name}`,
  });
  revalidateTab(workspaceId, "roles");
}

export async function approvePendingRequest(formData: FormData) {
  const workspaceId = formData.get("workspaceId") as string;
  const requestId = formData.get("requestId") as string;
  const actor = await currentMember(workspaceId);

  const request = await prisma.pendingRequest.findUnique({ where: { id: requestId } });
  if (!request) return;

  const existing = await prisma.member.findUnique({ where: { workspaceId_email: { workspaceId, email: request.email } } });
  if (!existing) {
    await prisma.member.create({
      data: { workspaceId, name: request.name, email: request.email, role: "CLIENT", status: "ONLINE" },
    });
  }
  await prisma.pendingRequest.delete({ where: { id: requestId } });
  await logActivity({ workspaceId, memberId: actor?.id, category: "Security", action: `Approved SSO request from ${request.email}` });
  revalidateTab(workspaceId, "roles");
  revalidateTab(workspaceId, "members");
}

export async function denyPendingRequest(formData: FormData) {
  const workspaceId = formData.get("workspaceId") as string;
  const requestId = formData.get("requestId") as string;
  const actor = await currentMember(workspaceId);
  const request = await prisma.pendingRequest.findUnique({ where: { id: requestId } });
  await prisma.pendingRequest.delete({ where: { id: requestId } });
  await logActivity({ workspaceId, memberId: actor?.id, category: "Security", action: `Denied SSO request from ${request?.email ?? "unknown"}` });
  revalidateTab(workspaceId, "roles");
}

// ---------- Files ----------

async function nextFileCode(workspaceId: string) {
  const files = await prisma.file.findMany({ where: { workspaceId }, select: { code: true } });
  const maxSuffix = files.reduce((max, f) => {
    const n = parseInt(f.code.replace("DOC-", ""), 10);
    return Number.isFinite(n) && n > max ? n : max;
  }, 1000);
  return `DOC-${maxSuffix + 1}`;
}

export async function createFile(formData: FormData) {
  const workspaceId = formData.get("workspaceId") as string;
  const file = formData.get("file") as File | null;
  if (!file || !file.name) return;

  const member = await currentMember(workspaceId);
  const code = await nextFileCode(workspaceId);
  const buffer = Buffer.from(await file.arrayBuffer());
  const storageKey = await storage.save(`${workspaceId}/${code}-${file.name}`, buffer);

  await prisma.file.create({
    data: { workspaceId, name: file.name, code, sizeBytes: buffer.length, status: "DRAFT", uploadedById: member?.id ?? null, storageKey },
  });
  await logActivity({ workspaceId, memberId: member?.id, category: "Files", action: `Uploaded ${file.name}` });
  revalidateTab(workspaceId, "files");
}

export async function deleteFile(formData: FormData) {
  const workspaceId = formData.get("workspaceId") as string;
  const fileId = formData.get("fileId") as string;
  const actor = await currentMember(workspaceId);
  const file = await prisma.file.findUnique({ where: { id: fileId } });
  if (file?.storageKey) await storage.delete(file.storageKey);
  await prisma.file.delete({ where: { id: fileId } });
  await logActivity({ workspaceId, memberId: actor?.id, category: "Files", action: `Deleted ${file?.name ?? "a file"}` });
  revalidateTab(workspaceId, "files");
}

export async function updateFileVisibility(formData: FormData) {
  const workspaceId = formData.get("workspaceId") as string;
  const fileId = formData.get("fileId") as string;
  const visibleGroupId = (formData.get("visibleGroupId") as string) || null;
  const actor = await currentMember(workspaceId);
  const [file, group] = await Promise.all([
    prisma.file.update({ where: { id: fileId }, data: { visibleGroupId } }),
    visibleGroupId ? prisma.group.findUnique({ where: { id: visibleGroupId } }) : Promise.resolve(null),
  ]);
  await logActivity({
    workspaceId,
    memberId: actor?.id,
    category: "Files",
    action: `Changed visibility of ${file.name} to ${group ? group.name : "everyone"}`,
  });
  revalidatePath(`/admin/${workspaceId}/files/${fileId}`);
}

export async function recordFileView(workspaceId: string, fileId: string) {
  const member = await currentMember(workspaceId);
  await prisma.fileView.create({ data: { fileId, memberId: member?.id ?? null } });
}

// ---------- Security ----------

export async function updateSecurity(formData: FormData) {
  const workspaceId = formData.get("workspaceId") as string;
  const field = formData.get("field") as "twoFA" | "sso" | "watermark";
  const nextValue = formData.get("nextValue") === "true";
  const actor = await currentMember(workspaceId);

  await prisma.securitySettings.update({ where: { workspaceId }, data: { [field]: nextValue } });
  await logActivity({
    workspaceId,
    memberId: actor?.id,
    category: "Security",
    action: `${nextValue ? "Enabled" : "Disabled"} ${field}`,
  });
  revalidateTab(workspaceId, "security");
}

// ---------- Integrations ----------

export async function toggleIntegration(formData: FormData) {
  const workspaceId = formData.get("workspaceId") as string;
  const code = formData.get("code") as string;
  const nextValue = formData.get("nextValue") === "true";
  const actor = await currentMember(workspaceId);

  await prisma.integration.upsert({
    where: { workspaceId_code: { workspaceId, code } },
    create: { workspaceId, code, enabled: nextValue },
    update: { enabled: nextValue },
  });
  await logActivity({
    workspaceId,
    memberId: actor?.id,
    category: "Integrations",
    action: `${nextValue ? "Connected" : "Disconnected"} ${code}`,
  });
  revalidateTab(workspaceId, "integrations");
}

// ---------- Branding ----------

export async function saveBranding(formData: FormData) {
  const workspaceId = formData.get("workspaceId") as string;
  const name = formData.get("name") as string;
  const domain = formData.get("domain") as string;
  const primaryColor = formData.get("primaryColor") as string;
  const accentColor = formData.get("accentColor") as string;
  const actor = await currentMember(workspaceId);

  await prisma.brandingSettings.update({
    where: { workspaceId },
    data: { name, domain, primaryColor, accentColor },
  });
  await logActivity({ workspaceId, memberId: actor?.id, category: "Branding", action: "Updated branding" });
  revalidateTab(workspaceId, "branding");
}

export async function discardBranding(formData: FormData) {
  const workspaceId = formData.get("workspaceId") as string;
  const actor = await currentMember(workspaceId);
  const branding = await prisma.brandingSettings.findUnique({ where: { workspaceId } });
  if (!branding) return;

  await prisma.brandingSettings.update({
    where: { workspaceId },
    data: {
      name: branding.defaultName,
      domain: branding.defaultDomain,
      primaryColor: branding.defaultPrimaryColor,
      accentColor: branding.defaultAccentColor,
    },
  });
  await logActivity({ workspaceId, memberId: actor?.id, category: "Branding", action: "Discarded branding changes" });
  revalidateTab(workspaceId, "branding");
}
