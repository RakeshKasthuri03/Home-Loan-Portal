import { z } from "zod";

/* ✅ Reusable fields */

export const nameSchema = z
  .string()
  .min(2, "Minimum 2 characters required");

export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Invalid email address");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Must contain at least one uppercase letter")
  .regex(/[0-9]/, "Must contain at least one number");

export const phoneSchema = z
  .string()
  .regex(/^[6-9]\d{9}$/, "Invalid phone number");

