import { z } from "zod";

const createRequestValidation = z.object({
  body: z.object({
    name: z.string({
      required_error: "Name is required",
    }),
  }),
});

const updateRequestValidation = createRequestValidation.partial();

export const RequestValidation = {
  createRequestValidation,
  updateRequestValidation,
};