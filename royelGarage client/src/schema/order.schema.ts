import { z } from "zod";

export const OrderSchema = z.object({
    quantity: z.number().min(1, "Quantity must be at least 1"),
  });