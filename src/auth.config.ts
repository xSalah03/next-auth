import bcryptjs from "bcryptjs";
import { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./utils/prisma";
import { LoginSchema } from "./utils/validationSchemas";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Credentials({
      async authorize(data) {
        const validation = LoginSchema.safeParse(data);
        if (validation.success) {
          const { email, password } = validation.data;
          const user = await prisma.user.findUnique({ where: { email } });
          if (!user || !user.password) return null;
          const isPasswordMatch = await bcryptjs.compare(
            password,
            user.password
          );
          if (isPasswordMatch) return user;
        }
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
