import { db } from '@/lib/db'
import { deleteImage } from '@/lib/storage'

export async function getGalleryImages(includeInactive = false) {
  return db.galleryImage.findMany({
    where: includeInactive ? undefined : { isActive: true },
    orderBy: { sortOrder: 'asc' }
  })
}

export async function addGalleryImage(url: string, alt: string, category?: string) {
  const count = await db.galleryImage.count()
  return db.galleryImage.create({
    data: {
      url,
      alt,
      category,
      sortOrder: count
    }
  })
}

export async function updateGalleryImage(id: string, data: Partial<{ alt: string; category: string; isActive: boolean }>) {
  return db.galleryImage.update({
    where: { id },
    data
  })
}

export async function deleteGalleryImage(id: string) {
  const image = await db.galleryImage.findUnique({ where: { id } })
  
  if (image && image.url) {
    try {
      // Supabase storage URLs typically end with /<bucket>/<path>
      // For gallery, bucket is 'gallery-images'
      const urlParts = image.url.split('/gallery-images/')
      if (urlParts.length > 1) {
        const path = urlParts[1]
        await deleteImage('gallery', path)
      }
    } catch (e) {
      console.error("Failed to delete image from storage:", e)
      // Continue to delete from DB even if storage deletion fails
    }
  }

  await db.galleryImage.delete({ where: { id } })
}

export async function reorderImages(ids: string[]) {
  await db.$transaction(
    ids.map((id, index) => 
      db.galleryImage.update({
        where: { id },
        data: { sortOrder: index }
      })
    )
  )
}
