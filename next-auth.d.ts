import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      role: Role;
    };
  }
  interface User {
    role?: string;
  }
  interface JWT {
    role?: string;
  }
}
