import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { createReservationSchema, updateReservationSchema } from '@/lib/validators/reservation'
import { 
  createReservation, 
  getReservations, 
  getReservationStats, 
  getAvailableTables,
  updateReservation
} from '@/server/services/reservation.service'
import { checkRateLimit } from '@/lib/rate-limit'
import { getRequest } from '@tanstack/react-start/server'
import { requireAdmin } from '@/server/middleware/auth.middleware'

export const submitReservation = createServerFn({ method: 'POST' })
  .handler(async ({ data }) => {
      try {
            // Validate manually to prevent ZodError serialization crashes
            const validated = createReservationSchema.parse(data)
            
            let ip = 'unknown';
            try {
              const req = (await import('@tanstack/react-start/server')).getRequest?.();
              if (req) ip = (req.headers as any)?.get?.('x-forwarded-for') || (req.headers as any)?.['x-forwarded-for'] || 'unknown';
            } catch(e) {}
            
            const { allowed } = await checkRateLimit(`reservation:${validated.email}`, 3, 3600_000)
            if (!allowed) return { success: false, error: 'Too many requests. Please try again later.', id: undefined }
            
            const reservation = await createReservation(validated)
            return { success: true, id: reservation.id, error: null }
          } catch (e: any) { 
            console.error("Server Error:", e); 
            return { success: false, error: e.errors ? e.errors[0]?.message || "Invalid input" : (e.message || "Failed to save reservation. Please try again."), id: undefined }; 
          }
  })

export const adminGetReservations = createServerFn({ method: 'GET' })
  .validator(z.object({
    page: z.number().optional(),
    limit: z.number().optional(),
    status: z.string().optional(),
    date: z.string().optional()
  }).optional())
  .handler(async ({ data }) => {
      try { 
                      requireAdmin()
                      return getReservations(data)
                     } catch (e) { return { success: false, error: e instanceof Error ? e.message : "Failed to process request" }; }
  })

export const adminUpdateReservation = createServerFn({ method: 'POST' })
  .validator(updateReservationSchema)
  .handler(async ({ data }) => {
      try { 
                      requireAdmin()
                      const reservation = await updateReservation(data)
                      return { success: true, id: reservation.id }
                     } catch (e) { return { success: false, error: e instanceof Error ? e.message : "Failed to process request" }; }
  })

export const adminGetReservationStats = createServerFn({ method: 'GET' })
  .handler(async () => {
      try { 
                      requireAdmin()
                      return getReservationStats()
                     } catch (e) { return { success: false, error: e instanceof Error ? e.message : "Failed to process request" }; }
  })

export const publicGetAvailableTables = createServerFn({ method: 'GET' })
  .validator(z.object({ date: z.string(), time: z.string(), guests: z.number() }))
  .handler(async ({ data }) => {
      try { 
                      return getAvailableTables(data.date, data.time, data.guests)
                     } catch (e) { return { success: false, error: e instanceof Error ? e.message : "Failed to process request" }; }
  })
