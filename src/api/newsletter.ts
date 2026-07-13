import { createServerFn } from '@tanstack/react-start'
import { newsletterSchema } from '@/lib/validators/newsletter'
import { subscribeToNewsletter } from '@/server/services/newsletter.service'
import { checkRateLimit } from '@/lib/rate-limit'
import { getRequest } from '@tanstack/react-start/server'

export const subscribeNewsletter = createServerFn({ method: 'POST' })
  .validator(newsletterSchema)
  .handler(async ({ data }) => {
      try { 
                const request = getRequest()
                const ip = request?.headers.get('x-forwarded-for') ?? 'unknown'
                
                const { allowed } = checkRateLimit(`newsletter:${ip}`, 3, 3600_000)
                if (!allowed) throw new Error('Too many requests. Please try again later.')
                
                return subscribeToNewsletter(data)
               } catch (e: any) { console.error("Server Error:", e); throw new Error(e.message || "Failed to process request"); }
  })
