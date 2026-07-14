import { z } from 'zod'

export const createMenuCategorySchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  description: z.string().max(500).optional(),
  imageUrl: z.string().url().optional(),
  sortOrder: z.number().int().default(0),
})

export const createMenuItemSchema = z.object({
  categoryId: z.string(),
  name: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  price: z.number().min(0),
  imageUrl: z.string().url().optional(),
  isVeg: z.boolean().default(false),
  spicyLevel: z.number().int().min(0).max(3).default(0),
  prepTimeMinutes: z.number().int().optional(),
  isRecommended: z.boolean().default(false),
  isChefSpecial: z.boolean().default(false),
  isTodaySpecial: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  sortOrder: z.number().int().default(0),
})

export const updateMenuItemSchema = createMenuItemSchema.partial().extend({
  id: z.string(),
})

export type CreateMenuCategoryInput = z.infer<typeof createMenuCategorySchema>
export type CreateMenuItemInput = z.infer<typeof createMenuItemSchema>
export type UpdateMenuItemInput = z.infer<typeof updateMenuItemSchema>
