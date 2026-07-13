import { createServerFn } from '@tanstack/react-start'
import { contactSchema } from '@/lib/validators/contact'
import { createContactMessage, getContactMessages, markMessageAsRead } from '@/server/services/contact.service'
import { checkRateLimit } from '@/lib/rate-limit'
import { getRequest } from '@tanstack/react-start/server'
import { requireAdmin } from '@/server/middleware/auth.middleware'
import { z } from 'zod'

export const submitContact = createServerFn({ method: 'POST' })
  .validator(contactSchema)
  .handler(async ({ data }) => {
      try { 
                      const request = getRequest()
                      const ip = request?.headers.get('x-forwarded-for') ?? 'unknown'
                      
                      const { allowed } = checkRateLimit(`contact:${ip}`, 5, 3600_000)
                      if (!allowed) throw new Error('Too many requests. Please try again later.')
                      
                      await createContactMessage(data, ip)
                      return { success: true }
                     } catch (e: any) { console.error("Server Error:", e); return { success: false, error: e.message || "Failed to process request" }; }
  })

export const adminGetMessages = createServerFn({ method: 'GET' })
  .handler(async () => {
      try { 
                      requireAdmin()
                      return getContactMessages()
                     } catch (e: any) { console.error("Server Error:", e); return { success: false, error: e.message || "Failed to process request" }; }
  })

export const adminMarkAsRead = createServerFn({ method: 'POST' })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
      try { 
                      requireAdmin()
                      await markMessageAsRead(data.id)
                      return { success: true }
                     } catch (e: any) { console.error("Server Error:", e); return { success: false, error: e.message || "Failed to process request" }; }
  })
