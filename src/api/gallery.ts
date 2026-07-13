import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { requireAdmin } from '@/server/middleware/auth.middleware'
import {
  getGalleryImages,
  addGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
  reorderImages
} from '@/server/services/gallery.service'

export const publicGetGallery = createServerFn({ method: 'GET' })
  .handler(async () => {
      try { 
                return getGalleryImages(false)
               } catch (e: any) { console.error("Server Error:", e); throw new Error(e.message || "Failed to process request"); }
  })

export const adminGetGallery = createServerFn({ method: 'GET' })
  .handler(async () => {
      try { 
                requireAdmin()
                return getGalleryImages(true)
               } catch (e: any) { console.error("Server Error:", e); throw new Error(e.message || "Failed to process request"); }
  })

export const adminAddGalleryImage = createServerFn({ method: 'POST' })
  .validator(z.object({
    url: z.string().url(),
    alt: z.string(),
    category: z.string().optional()
  }))
  .handler(async ({ data }) => {
      try { 
                requireAdmin()
                return addGalleryImage(data.url, data.alt, data.category)
               } catch (e: any) { console.error("Server Error:", e); throw new Error(e.message || "Failed to process request"); }
  })

export const adminUpdateGalleryImage = createServerFn({ method: 'POST' })
  .validator(z.object({
    id: z.string(),
    alt: z.string().optional(),
    category: z.string().optional(),
    isActive: z.boolean().optional()
  }))
  .handler(async ({ data }) => {
      try { 
                requireAdmin()
                const { id, ...updateData } = data
                return updateGalleryImage(id, updateData)
               } catch (e: any) { console.error("Server Error:", e); throw new Error(e.message || "Failed to process request"); }
  })

export const adminDeleteGalleryImage = createServerFn({ method: 'POST' })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
      try { 
                requireAdmin()
                await deleteGalleryImage(data.id)
                return { success: true }
               } catch (e: any) { console.error("Server Error:", e); throw new Error(e.message || "Failed to process request"); }
  })

export const adminReorderGallery = createServerFn({ method: 'POST' })
  .validator(z.object({ ids: z.array(z.string()) }))
  .handler(async ({ data }) => {
      try { 
                requireAdmin()
                await reorderImages(data.ids)
                return { success: true }
               } catch (e: any) { console.error("Server Error:", e); throw new Error(e.message || "Failed to process request"); }
  })
