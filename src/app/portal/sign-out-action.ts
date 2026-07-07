"use server";

import { signOut } from "@/auth";

export async function portalSignOutAction() {
  await signOut({ redirectTo: "/portal/login" });
}
