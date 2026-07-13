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
                let ip = 'unknown';
                try {
                  const req = (await import('@tanstack/react-start/server')).getRequest?.();
                  if (req) ip = (req.headers as any)?.get?.('x-forwarded-for') || (req.headers as any)?.['x-forwarded-for'] || 'unknown';
                } catch(e) {}
                
                const { allowed } = checkRateLimit(`contact:${ip}`, 5, 3600_000)
                if (!allowed) return { success: false, error: 'Too many requests. Please try again later.' }
                
                await createContactMessage(data, ip)
                return { success: true, error: null }
               } catch (e: any) { 
                 console.error("Server Error:", e); 
                 return { success: false, error: e.message || "Failed to process request" }; 
               }
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
