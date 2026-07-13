import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { 
  createMenuCategorySchema, 
  createMenuItemSchema, 
  updateMenuItemSchema 
} from '@/lib/validators/menu'
import { 
  getPublicMenu, 
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  reorderCategories,
  getAllItems,
  createItem,
  updateItem,
  deleteItem,
  toggleItemAvailability
} from '@/server/services/menu.service'
import { requireAdmin } from '@/server/middleware/auth.middleware'

// Format decimals to numbers for client serialization
const formatMenuData = (data: any): any => {
  if (Array.isArray(data)) return data.map(formatMenuData)
  if (data && typeof data === 'object') {
    const formatted = { ...data }
    if (formatted.price) formatted.price = Number(formatted.price)
    if (formatted.items) formatted.items = formatMenuData(formatted.items)
    return formatted
  }
  return data
}

export const publicGetMenu = createServerFn({ method: 'GET' })
  .handler(async () => {
    const data = await getPublicMenu()
    return formatMenuData(data)
  })

export const adminGetCategories = createServerFn({ method: 'GET' })
  .handler(async () => {
    requireAdmin()
    return getAllCategories(true)
  })

export const adminCreateCategory = createServerFn({ method: 'POST' })
  .validator(createMenuCategorySchema)
  .handler(async ({ data }) => {
    requireAdmin()
    return createCategory(data)
  })

export const adminUpdateCategory = createServerFn({ method: 'POST' })
  .validator(createMenuCategorySchema.partial().extend({ id: z.string() }))
  .handler(async ({ data }) => {
    requireAdmin()
    const { id, ...updateData } = data
    return updateCategory(id, updateData)
  })

export const adminDeleteCategory = createServerFn({ method: 'POST' })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    requireAdmin()
    await deleteCategory(data.id)
    return { success: true }
  })

export const adminReorderCategories = createServerFn({ method: 'POST' })
  .validator(z.object({ ids: z.array(z.string()) }))
  .handler(async ({ data }) => {
    requireAdmin()
    await reorderCategories(data.ids)
    return { success: true }
  })

export const adminGetItems = createServerFn({ method: 'GET' })
  .validator(z.object({ categoryId: z.string().optional() }).optional())
  .handler(async ({ data }) => {
    requireAdmin()
    const items = await getAllItems(data?.categoryId)
    return formatMenuData(items)
  })

export const adminCreateItem = createServerFn({ method: 'POST' })
  .validator(createMenuItemSchema)
  .handler(async ({ data }) => {
    requireAdmin()
    const item = await createItem(data)
    return formatMenuData(item)
  })

export const adminUpdateItem = createServerFn({ method: 'POST' })
  .validator(updateMenuItemSchema)
  .handler(async ({ data }) => {
    requireAdmin()
    const { id, ...updateData } = data
    const item = await updateItem(id, updateData)
    return formatMenuData(item)
  })

export const adminDeleteItem = createServerFn({ method: 'POST' })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    requireAdmin()
    await deleteItem(data.id)
    return { success: true }
  })

export const adminToggleItem = createServerFn({ method: 'POST' })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    requireAdmin()
    const item = await toggleItemAvailability(data.id)
    return formatMenuData(item)
  })
