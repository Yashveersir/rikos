import { z } from 'zod' 

export const newsletterSchema = z.object({
  email: z.string().email(),
  name: z.string().max(100).optional(),
  source: z.string().optional(),
})

export type NewsletterInput = z.infer<typeof newsletterSchema>
