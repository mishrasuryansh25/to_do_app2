import {z} from "zod";

export const registerSchema=z.object({
    username: z.string()
    .min(3, "username must be at-least 3 characters")
    .max(10,"username must be at-most charachters  "),

    password: z.string()
    .min(6,"password must be at-least 6 characters")
    .max(8,"password must be at-most 8 characters"),
});

export const loginSchema = z.object({
    username: z.string().min(1,"Username is required"),
    password: z.string().min(1,"Password is required"),
});