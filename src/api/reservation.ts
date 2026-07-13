import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { createReservationSchema, updateReservationSchema } from '@/lib/validators/reservation'
import { 
  createReservation, 
  getReservations, 
  getReservationStats, 
  getAvailableTables 
} from '@/server/services/reservation.service'
import { checkRateLimit } from '@/lib/rate-limit'
import { getRequest } from '@tanstack/react-start/server'
import { requireAdmin } from '@/server/middleware/auth.middleware'

export const submitReservation = createServerFn({ method: 'POST' })
  .validator(createReservationSchema)
  .handler(async ({ data }) => {
    console.log("HIT SUBMIT RESERVATION HANDLER", data);
    const request = getRequest()
    const ip = request?.headers.get('x-forwarded-for') ?? 'unknown'
    
    // Rate limit based on email and IP to prevent spamming
    const { allowed } = checkRateLimit(`reservation:${data.email}`, 3, 3600_000)
    if (!allowed) throw new Error('Too many requests. Please try again later.')
    
    console.log("Creating reservation:", data);
    const reservation = await createReservation(data)
    return { success: true, id: reservation.id }
  })

export const adminGetReservations = createServerFn({ method: 'GET' })
  .validator(z.object({
    page: z.number().optional(),
    limit: z.number().optional(),
    status: z.string().optional(),
    date: z.string().optional()
  }).optional())
  .handler(async ({ data }) => {
    console.log("HIT SUBMIT RESERVATION HANDLER", data);
    requireAdmin()
    return getReservations(data)
  })

export const adminUpdateReservation = createServerFn({ method: 'POST' })
  .validator(updateReservationSchema)
  .handler(async ({ data }) => {
    console.log("HIT SUBMIT RESERVATION HANDLER", data);
    requireAdmin()
    const reservation = await import('@/server/services/reservation.service').then(m => m.updateReservation(data))
    return { success: true, id: reservation.id }
  })

export const adminGetReservationStats = createServerFn({ method: 'GET' })
  .handler(async () => {
    requireAdmin()
    return getReservationStats()
  })

export const publicGetAvailableTables = createServerFn({ method: 'GET' })
  .validator(z.object({ date: z.string(), time: z.string(), guests: z.number() }))
  .handler(async ({ data }) => {
    console.log("HIT SUBMIT RESERVATION HANDLER", data);
    return getAvailableTables(data.date, data.time, data.guests)
  })
