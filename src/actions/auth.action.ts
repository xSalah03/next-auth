"use server";

import { loginSchema, registerSchema } from "@/utils/validationSchemas";
import { z } from "zod";

type loginDto = z.infer<typeof loginSchema>;
type registerDto = z.infer<typeof registerSchema>;

export const loginAction = async (data: loginDto) => {
  const validation = loginSchema.safeParse(data);
  if (validation.error) return { error: "Invalid credentials" };

  console.log(data);
  return { success: "Login Successful" };
};

export const registerAction = async (data: registerDto) => {
  const validation = registerSchema.safeParse(data);
  if (validation.error) return { error: "Invalid credentials" };

  console.log(data);
  return { success: "Register Successful" };
};
