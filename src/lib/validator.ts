import * as z from "zod"
export const eventFormSchema = z.object({
    name: z.string().min(3, 'name must be at least 3 characters'),
    email: z.string().min(3, 'Email must be at least 3 characters'),
    // categoryId: z.string(),
    description: z.string().min(3, 'Description must be at least 3 characters').max(400, 'Description must be less than 400 characters'),
  })