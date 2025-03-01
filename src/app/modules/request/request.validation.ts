import { z } from "zod";

const createRequestValidation = z.object({
  body: z.object({
    tenantId: z.string({
      required_error: "Tenant is required",
    }),
    listingId: z.string({
      required_error: "Listing is required",
    }),
    landlordId: z.string({
      required_error: "Landlord is required",
    }),
  }),
});

const updateRequestValidation = createRequestValidation.partial();

export const RequestValidation = {
  createRequestValidation,
  updateRequestValidation,
};
