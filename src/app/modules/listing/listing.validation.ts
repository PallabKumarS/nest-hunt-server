import { z } from "zod";

const createListingsValidation = z.object({
  body: z.object({
    houseLocation: z.string({
      required_error: "House location is required",
    }),
    description: z.string({
      required_error: "Description is required",
    }),
    rentPrice: z.number({
      required_error: "Rent price is required",
    }),
    bedroomNumber: z.number({
      required_error: "Bedroom number is required",
    }),
    images: z
      .array(z.string({ required_error: "At least one image is required" }))
      .min(1),
  }),
});

const updateListingsValidation = createListingsValidation.partial();

export const ListingsValidation = {
  createListingsValidation,
  updateListingsValidation,
};
