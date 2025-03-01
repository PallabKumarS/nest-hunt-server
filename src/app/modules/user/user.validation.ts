import { z } from "zod";

const createUserValidationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  password: z.string().min(1, "Password is required"),
  email: z.string().min(1, "Email is required").email(),
});

const updateUserValidationSchema = createUserValidationSchema.partial();

export const UserValidation = { createUserValidationSchema, updateUserValidationSchema };
