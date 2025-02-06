import {z} from "zod";

export const UsernameValidation = z.string()
  .min(4, "Username must be at least 5 characters long")
  .max(20, "Username must be at least 20 characters long")
  .regex( /^[A-Za-z0-9_.-]+$/, "Username must not contain special character");

export const signUpSchema = z.object({
  username: UsernameValidation,
  password: z.string().min(6, {message: "Password must be at least 7 characters long"}).regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
})
