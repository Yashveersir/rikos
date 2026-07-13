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
  if (data === null || data === undefined) return data
  
  if (typeof data === 'object' && typeof data.toNumber === 'function') {
    return data.toNumber()
  }
  
  if (data instanceof Date) return data
  
  if (Array.isArray(data)) return data.map(formatMenuData)
  
  if (typeof data === 'object') {
    const formatted: any = {}
    for (const key in data) {
      formatted[key] = formatMenuData(data[key])
    }
    return formatted
  }
  
  return data
}

export const publicGetMenu = createServerFn({ method: 'GET' })
  .handler(async () => {
      try { 
                      const data = await getPublicMenu()
                      return formatMenuData(data)
                     } catch (e: any) { console.error("Server Error:", e); return { success: false, error: e.message || "Failed to process request" }; }
  })

export const adminGetCategories = createServerFn({ method: 'GET' })
  .handler(async () => {
      try { 
                      requireAdmin()
                      return getAllCategories(true)
                     } catch (e: any) { console.error("Server Error:", e); return { success: false, error: e.message || "Failed to process request" }; }
  })

export const adminCreateCategory = createServerFn({ method: 'POST' })
  .validator(createMenuCategorySchema)
  .handler(async ({ data }) => {
      try { 
                      requireAdmin()
                      return createCategory(data)
                     } catch (e: any) { console.error("Server Error:", e); return { success: false, error: e.message || "Failed to process request" }; }
  })

export const adminUpdateCategory = createServerFn({ method: 'POST' })
  .validator(createMenuCategorySchema.partial().extend({ id: z.string() }))
  .handler(async ({ data }) => {
      try { 
                      requireAdmin()
                      const { id, ...updateData } = data
                      return updateCategory(id, updateData)
                     } catch (e: any) { console.error("Server Error:", e); return { success: false, error: e.message || "Failed to process request" }; }
  })

export const adminDeleteCategory = createServerFn({ method: 'POST' })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
      try { 
                      requireAdmin()
                      await deleteCategory(data.id)
                      return { success: true }
                     } catch (e: any) { console.error("Server Error:", e); return { success: false, error: e.message || "Failed to process request" }; }
  })

export const adminReorderCategories = createServerFn({ method: 'POST' })
  .validator(z.object({ ids: z.array(z.string()) }))
  .handler(async ({ data }) => {
      try { 
                      requireAdmin()
                      await reorderCategories(data.ids)
                      return { success: true }
                     } catch (e: any) { console.error("Server Error:", e); return { success: false, error: e.message || "Failed to process request" }; }
  })

export const adminGetItems = createServerFn({ method: 'GET' })
  .validator(z.object({ categoryId: z.string().optional() }).optional())
  .handler(async ({ data }) => {
      try { 
                      requireAdmin()
                      const items = await getAllItems(data?.categoryId)
                      return formatMenuData(items)
                     } catch (e: any) { console.error("Server Error:", e); return { success: false, error: e.message || "Failed to process request" }; }
  })

export const adminCreateItem = createServerFn({ method: 'POST' })
  .validator(createMenuItemSchema)
  .handler(async ({ data }) => {
      try { 
                      requireAdmin()
                      const item = await createItem(data)
                      return formatMenuData(item)
                     } catch (e: any) { console.error("Server Error:", e); return { success: false, error: e.message || "Failed to process request" }; }
  })

export const adminUpdateItem = createServerFn({ method: 'POST' })
  .validator(updateMenuItemSchema)
  .handler(async ({ data }) => {
      try { 
                      requireAdmin()
                      const { id, ...updateData } = data
                      const item = await updateItem(id, updateData)
                      return formatMenuData(item)
                     } catch (e: any) { console.error("Server Error:", e); return { success: false, error: e.message || "Failed to process request" }; }
  })

export const adminDeleteItem = createServerFn({ method: 'POST' })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
      try { 
                      requireAdmin()
                      await deleteItem(data.id)
                      return { success: true }
                     } catch (e: any) { console.error("Server Error:", e); return { success: false, error: e.message || "Failed to process request" }; }
  })

export const adminToggleItem = createServerFn({ method: 'POST' })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
      try { 
                      requireAdmin()
                      const item = await toggleItemAvailability(data.id)
                      return formatMenuData(item)
                     } catch (e: any) { console.error("Server Error:", e); return { success: false, error: e.message || "Failed to process request" }; }
  })
