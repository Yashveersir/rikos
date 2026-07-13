import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().max(200).optional(),
  message: z.string().min(10).max(2000),
})

export type ContactInput = z.infer<typeof contactSchema>
