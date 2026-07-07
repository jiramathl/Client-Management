import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import type { MemberRole } from "@/generated/prisma";

// Two surfaces share one Credentials provider: "admin" only matches TEAM
// members (your firm's people), "portal" only matches OWNER/CLIENT members
// (client-side people). See HANDOFF.md's role definitions. A member's role
// is fixed at seed/invite time, so the surface a login form is submitted
// from is what decides which role set is eligible — not a user choice.
export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  providers: [
    Credentials({
      credentials: { email: {}, password: {}, surface: {} },
      authorize: async (credentials) => {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        const surface = credentials?.surface as "admin" | "portal" | undefined;
        if (!email || !password || !surface) return null;

        const allowedRoles: MemberRole[] = surface === "admin" ? ["TEAM"] : ["OWNER", "CLIENT"];
        const member = await prisma.member.findFirst({
          where: { email, role: { in: allowedRoles }, passwordHash: { not: null } },
        });
        if (!member?.passwordHash) return null;

        const valid = await bcrypt.compare(password, member.passwordHash);
        if (!valid) return null;

        return { id: member.id, name: member.name, email: member.email, role: member.role, workspaceId: member.workspaceId };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.workspaceId = user.workspaceId;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role!;
        session.user.workspaceId = token.workspaceId;
      }
      return session;
    },
  },
});
