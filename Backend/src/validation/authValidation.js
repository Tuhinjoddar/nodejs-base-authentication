

import { z } from "zod";
// Define a Zod schema for user signup


const capitalizeFirstLetterOfEachWord = (name) => {
    return name
        .split(" ")
        .map((word) => {
            if (word.length < 2) return word.toUpperCase(); // Handle single-letter words
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(); // Capitalize first letter, lowercase rest
        })
        .join(" "); // Join words back into a sentence
};


const usernameSchema = z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .transform(capitalizeFirstLetterOfEachWord);

const emailSchema = z
    .string()
    .trim()
    .toLowerCase()
    .email("Invalid email address")

const phoneNumberSchema = z
    .string()
    .trim()
    .min(10, "Phone number must be at least 10 digits");

const passwordSchema = z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number");



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
        confirmPassword: z.string().nonempty("This field is required"),
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




// Reset Password validation

export const resetPasswordSchema = z
    .object({
        email: emailSchema,
        newPassword: z.string()
            .min(6, "Password must be at least 6 characters")
            .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
            .regex(/[a-z]/, "Password must contain at least one lowercase letter")
            .regex(/[0-9]/, "Password must contain at least one number"),
        otp: z.string().length(6, "OTP must be exactly 6 digits"),
    })
