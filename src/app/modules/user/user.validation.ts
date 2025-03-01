import { z } from "zod";

const createUserValidation = z.object({
  name: z.string().min(1, "Name is required"),
  password: z.string().min(1, "Password is required"),
  email: z.string().min(1, "Email is required").email(),
});

const updateUserValidation = createUserValidation.partial();

export const UserValidation = { createUserValidation, updateUserValidation };
