import { z } from "zod";
import {
  emailSchema,
  passwordSchema,
  phoneSchema,
  nameSchema,
} from "./common.schema";

/* ✅ LOGIN VALIDATION */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

/* ✅ SIGNUP VALIDATION */
export const signupSchema = z
  .object({
    firstName: nameSchema,
    middleName: z.string().optional(),
    lastName: nameSchema,
    email: emailSchema,
    phone: phoneSchema,
    gender: z.string().min(1, "Gender is required"),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });