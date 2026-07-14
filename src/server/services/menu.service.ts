import { db } from '@/lib/db'
import { deleteImage } from '@/lib/storage'
import { CreateMenuCategoryInput, CreateMenuItemInput, UpdateMenuItemInput } from '@/lib/validators/menu'

export async function getPublicMenu() {
  const categories = await db.menuCategory.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
    include: {
      items: {
        where: { isAvailable: true },
        orderBy: { sortOrder: 'asc' }
      }
    }
  })
  
  return { categories }
}

export async function getAllCategories(includeInactive = true) {
  return db.menuCategory.findMany({
    where: includeInactive ? undefined : { isActive: true },
    orderBy: { sortOrder: 'asc' }
  })
}

export async function createCategory(data: CreateMenuCategoryInput) {
  return db.menuCategory.create({ data })
}

export async function updateCategory(id: string, data: Partial<CreateMenuCategoryInput>) {
  return db.menuCategory.update({
    where: { id },
    data
  })
}

export async function deleteCategory(id: string) {
  const category = await db.menuCategory.findUnique({ where: { id } })
  
  if (category && category.imageUrl) {
    try {
      const urlParts = category.imageUrl.split('/menu-images/')
      if (urlParts.length > 1) {
        const path = urlParts[1]
        await deleteImage('menu', path)
      }
    } catch (e) {
      console.error("Failed to delete category image from storage:", e)
    }
  }

  await db.menuCategory.delete({ where: { id } })
}

export async function reorderCategories(ids: string[]) {
  // Uses a transaction to update sortOrder based on array index
  await db.$transaction(
    ids.map((id, index) => 
      db.menuCategory.update({
        where: { id },
        data: { sortOrder: index }
      })
    )
  )
}

export async function getAllItems(categoryId?: string) {
  return db.menuItem.findMany({
    where: categoryId ? { categoryId } : undefined,
    orderBy: [{ categoryId: 'asc' }, { sortOrder: 'asc' }],
    include: { category: { select: { name: true } } }
  })
}

export async function createItem(data: CreateMenuItemInput) {
  return db.menuItem.create({ data })
}

export async function updateItem(id: string, data: Partial<CreateMenuItemInput>) {
  return db.menuItem.update({
    where: { id },
    data
  })
}

export async function deleteItem(id: string) {
  const item = await db.menuItem.findUnique({ where: { id } })
  
  if (item && item.imageUrl) {
    try {
      const urlParts = item.imageUrl.split('/menu-images/')
      if (urlParts.length > 1) {
        const path = urlParts[1]
        await deleteImage('menu', path)
      }
    } catch (e) {
      console.error("Failed to delete item image from storage:", e)
    }
  }

  await db.menuItem.delete({ where: { id } })
}

export async function toggleItemAvailability(id: string) {
  const item = await db.menuItem.findUnique({ where: { id } })
  if (!item) throw new Error('Menu item not found')
  
  return db.menuItem.update({
    where: { id },
    data: { isAvailable: !item.isAvailable }
  })
}
