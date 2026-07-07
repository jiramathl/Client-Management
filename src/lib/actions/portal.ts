"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentClientMember } from "@/lib/data/portal";
import { logActivity } from "@/lib/activityLog";

export async function sendPortalMessage(formData: FormData) {
  const threadId = formData.get("threadId") as string;
  const text = (formData.get("text") as string)?.trim();
  const member = await getCurrentClientMember();
  if (!member || !text) return;

  await prisma.message.create({ data: { threadId, authorId: member.id, text } });
  await logActivity({ workspaceId: member.workspaceId, memberId: member.id, category: "Messages", action: "Sent a message" });
  revalidatePath("/portal/messages");
}

export async function togglePersonal2FA(formData: FormData) {
  const nextValue = formData.get("nextValue") === "true";
  const member = await getCurrentClientMember();
  if (!member) return;

  await prisma.member.update({ where: { id: member.id }, data: { personal2FA: nextValue } });
  await logActivity({
    workspaceId: member.workspaceId,
    memberId: member.id,
    category: "Security",
    action: `${nextValue ? "Enabled" : "Disabled"} personal two-factor authentication`,
  });
  revalidatePath("/portal/account");
}

export async function approveFileAsClient(formData: FormData) {
  const fileId = formData.get("fileId") as string;
  const member = await getCurrentClientMember();
  if (!member?.canApprove) return;

  const file = await prisma.file.update({ where: { id: fileId }, data: { status: "APPROVED", approvalRequested: false } });
  await logActivity({ workspaceId: member.workspaceId, memberId: member.id, category: "Files", action: `Approved ${file.name}` });
  revalidatePath("/portal/home");
  revalidatePath("/portal/files");
}
