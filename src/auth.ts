import NextAuth from "next-auth";
import { prisma } from "./utils/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "./auth.config";

// import GitHub from "next-auth/providers/github";
// import Google from "next-auth/providers/google";

const { handlers, auth, signIn, signOut } = NextAuth({
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        const user = await prisma.user.findUnique({
          where: { id: token.sub },
        });
        if (user) session.user.role = user.role;
      }
      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true;

      const userFromDb = await prisma.user.findUnique({
        where: { id: user.id },
      });
      if (!userFromDb?.emailVerified) return false;
      return true;
    },
  },
  events: {
    async linkAccount({ user }) {
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },

  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
});
export { handlers, auth, signIn, signOut };
