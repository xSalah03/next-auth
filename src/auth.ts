import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./utils/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { LoginSchema } from "./utils/validationSchemas";
import * as bcryptjs from "bcryptjs";

// import GitHub from "next-auth/providers/github";
// import Google from "next-auth/providers/google";

const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
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
});
export { handlers, auth, signIn, signOut };
