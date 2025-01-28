import { z } from "zod";

export const productSchema = z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    brand: z.string().min(1, { message: 'Brand is required' }),
    price: z.number().min(1, { message: 'Price must be greater than or equal to 1' }),
    category: z.enum(['Mountain', 'Road', 'Hybrid', 'Electric'], { message: 'Invalid category' }),
    description: z.string().min(10, { message: 'Description must be 10 character long' }),
    quantity: z.number().int().min(1, { message: 'Quantity must be at least 1' }),
  });