import { z } from 'zod'

export const createReservationSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(10).max(15),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  guests: z.number().int().min(1).max(20),
  occasion: z.enum(['BIRTHDAY','ANNIVERSARY','CORPORATE','DATE_NIGHT','CASUAL','OTHER']).default('CASUAL'),
  specialRequests: z.string().max(500).optional(),
})

export const updateReservationSchema = z.object({
  id: z.string(),
  status: z.enum(['CONFIRMED','REJECTED','CANCELLED','COMPLETED']).optional(),
  tableId: z.string().optional(),
  internalNotes: z.string().optional(),
  date: z.string().optional(),
  time: z.string().optional(),
})

export type CreateReservationInput = z.infer<typeof createReservationSchema>
export type UpdateReservationInput = z.infer<typeof updateReservationSchema>
