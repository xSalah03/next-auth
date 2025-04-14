"use server";

import { prisma } from "@/utils/prisma";
import { LoginSchema, RegisterSchema } from "@/utils/validationSchemas";
import { z } from "zod";
import * as bcrypt from "bcryptjs";
import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { defaultLoginRedirect } from "@/routes";
import { generateVerificationToken } from "@/utils/generateToken";

type loginDto = z.infer<typeof LoginSchema>;
type registerDto = z.infer<typeof RegisterSchema>;

// Login
export const loginAction = async (data: loginDto) => {
  const validation = LoginSchema.safeParse(data);

  if (!validation.success)
    return { success: false, message: "Invalid credentials" };

  const { email, password } = validation.data;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !user.email || !user.password)
    return { success: false, message: "User not found" };

  if (!user.emailVerified) {
    const verificationToken = await generateVerificationToken(email);
    return { success: false, message: "Please verify your email" };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: defaultLoginRedirect,
    });
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
  const validation = RegisterSchema.safeParse(data);

  if (validation.error)
    return { success: false, message: "Invalid credentials" };

  const { name, email, password } = validation.data;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) return { success: false, message: "User already exists" };

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    const verificationToken = await generateVerificationToken(email);
    console.log(verificationToken);

    return { success: false, message: "Please verify your email" };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Something went wrong, please try again",
    };
  }
};

// Logout
export const logoutAction = async () => {
  await signOut();
};
