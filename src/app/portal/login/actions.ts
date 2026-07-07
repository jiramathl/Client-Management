"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";

export async function portalLoginAction(_prevState: string | undefined, formData: FormData) {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      surface: "portal",
      redirectTo: "/portal",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return "Invalid email or password.";
    }
    throw error;
  }
}
