import { db } from '@/lib/db'

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
