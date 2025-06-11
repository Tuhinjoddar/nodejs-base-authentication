import { z } from "zod";

// Helper function to capitalize each word
const capitalizeFirstLetterOfEachWord = (name: string) => {
  return name
    .split(" ")
    .map((word) => {
      if (word.length < 2) return word.toUpperCase();
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
};

// Common validation rules
const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Invalid email address");
const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");
const phoneNumberSchema = z
  .string()
  .trim()
  .min(10, "Phone number must be at least 10 digits");
const usernameSchema = z
  .string()
  .trim()
  .min(2, "Name must be at least 2 characters")
  .transform(capitalizeFirstLetterOfEachWord);

// Login Schema
export const loginValidation = z.object({
  email: emailSchema,
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Signup Schema
export const signupValidation = z
  .object({
    username: usernameSchema,
    email: emailSchema,
    phoneNumber: phoneNumberSchema,
    password: passwordSchema,
    confirmPassword: z.string().nonempty("Confirm Password is required"),
    agree: z.boolean().optional(),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords must match",
        path: ["confirmPassword"],
      });
    }
  });

// Update Profile Schema
export const updateProfileValidation = z.object({
  username: usernameSchema,
  email: emailSchema,
  phoneNumber: phoneNumberSchema,
});

// ✅ Define Zod Schema for OTP Validation
export const otpSchema = z.object({
  otp: z
    .string()
    .min(1, "OTP is required")
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});
