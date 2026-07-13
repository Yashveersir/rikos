import { db } from '@/lib/db'
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
