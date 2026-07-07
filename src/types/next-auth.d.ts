import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      role: "OWNER" | "CLIENT" | "TEAM";
      workspaceId?: string;
    };
  }

  interface User {
    role?: "OWNER" | "CLIENT" | "TEAM";
    workspaceId?: string;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    role?: "OWNER" | "CLIENT" | "TEAM";
    workspaceId?: string;
  }
}
