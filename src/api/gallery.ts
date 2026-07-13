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
    return getGalleryImages(false)
  })

export const adminGetGallery = createServerFn({ method: 'GET' })
  .handler(async () => {
    requireAdmin()
    return getGalleryImages(true)
  })

export const adminAddGalleryImage = createServerFn({ method: 'POST' })
  .validator(z.object({
    url: z.string().url(),
    alt: z.string(),
    category: z.string().optional()
  }))
  .handler(async ({ data }) => {
    requireAdmin()
    return addGalleryImage(data.url, data.alt, data.category)
  })

export const adminUpdateGalleryImage = createServerFn({ method: 'POST' })
  .validator(z.object({
    id: z.string(),
    alt: z.string().optional(),
    category: z.string().optional(),
    isActive: z.boolean().optional()
  }))
  .handler(async ({ data }) => {
    requireAdmin()
    const { id, ...updateData } = data
    return updateGalleryImage(id, updateData)
  })

export const adminDeleteGalleryImage = createServerFn({ method: 'POST' })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    requireAdmin()
    await deleteGalleryImage(data.id)
    return { success: true }
  })

export const adminReorderGallery = createServerFn({ method: 'POST' })
  .validator(z.object({ ids: z.array(z.string()) }))
  .handler(async ({ data }) => {
    requireAdmin()
    await reorderImages(data.ids)
    return { success: true }
  })
