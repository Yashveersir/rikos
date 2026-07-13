import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { requireAdmin } from '@/server/middleware/auth.middleware'
import { 
  getAllSettings,
  setSettings
} from '@/server/services/cms.service'

// We need to slightly update cms service to expose these
// For now, I'll implement them inline using the existing methods

export const publicGetSettings = createServerFn({ method: 'GET' })
  .handler(async () => {
      try { 
                      const cmsService = await import('@/server/services/cms.service')
                      return cmsService.getSettings([
                        'restaurant_name',
                        'restaurant_phone',
                        'restaurant_email',
                        'restaurant_address',
                        'opening_hours',
                        'instagram_url',
                        'facebook_url',
                        'restaurant_logo'
                      ])
                     } catch (e: any) { console.error("Server Error:", e); return { success: false, error: e.message || "Failed to process request" }; }
  })

export const adminGetSettings = createServerFn({ method: 'GET' })
  .handler(async () => {
      try { 
                      requireAdmin()
                      const cmsService = await import('@/server/services/cms.service')
                      return cmsService.getAllSettings()
                     } catch (e: any) { console.error("Server Error:", e); return { success: false, error: e.message || "Failed to process request" }; }
  })

export const adminSaveSettings = createServerFn({ method: 'POST' })
  .validator(z.record(z.string(), z.string()))
  .handler(async ({ data }) => {
      try { 
                      requireAdmin()
                      const cmsService = await import('@/server/services/cms.service')
                      await cmsService.setSettings(data as Record<string, string>)
                      return { success: true }
                     } catch (e: any) { console.error("Server Error:", e); return { success: false, error: e.message || "Failed to process request" }; }
  })
