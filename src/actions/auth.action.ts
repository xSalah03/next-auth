"use server";

import { prisma } from "@/utils/prisma";
import { loginSchema, registerSchema } from "@/utils/validationSchemas";
import { z } from "zod";
import * as bcrypt from "bcryptjs";
import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";

type loginDto = z.infer<typeof loginSchema>;
type registerDto = z.infer<typeof registerSchema>;

// Login
export const loginAction = async (data: loginDto) => {
  const validation = loginSchema.safeParse(data);
  if (validation.error)
    return { success: false, message: "Invalid credentials" };
  const { email, password } = validation.data;
  try {
    await signIn("credentials", { email, password, redirectTo: "/profile" });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { success: false, message: "Invalid email or password" };
        default:
          return { success: false, message: "Something went wrong" };
      }
    }
    throw error;
  }
  return { success: true, message: "Login Successful" };
};

// Register
export const registerAction = async (data: registerDto) => {
  const validation = registerSchema.safeParse(data);
  if (validation.error)
    return { success: false, message: "Invalid credentials" };

  const { name, email, password } = validation.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (user) return { success: false, message: "User already exists" };

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });
  return { success: true, message: "Register Successful" };
};

// Logout
export const logoutAction = async () => {
  await signOut();
};
