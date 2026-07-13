import { createServerFn } from '@tanstack/react-start'
import { requireAdmin } from '@/server/middleware/auth.middleware'
import { uploadImage, BUCKETS } from '@/lib/storage'
import { getRequest } from '@tanstack/react-start/server'
import { z } from 'zod'

export const adminUploadFile = createServerFn({ method: 'POST' })
  .handler(async ({ data }) => {
      try { 
                requireAdmin()
                
                // In TanStack Start, the raw request can contain FormData
                const request = getRequest()
                if (!request) throw new Error("No request found")
                
                const formData = await request.formData()
                const file = formData.get('file') as File | null
                const bucket = formData.get('bucket') as string
                
                if (!file) throw new Error("No file provided")
                if (!Object.keys(BUCKETS).includes(bucket)) {
                  throw new Error("Invalid bucket specified")
                }

                const buffer = await file.arrayBuffer()
                
                // Generate a unique filename to prevent collisions
                const ext = file.name.split('.').pop()
                const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`
                
                const url = await uploadImage(
                  bucket as keyof typeof BUCKETS,
                  Buffer.from(buffer),
                  filename,
                  file.type
                )

                return { success: true, url }
               } catch (e: any) { console.error("Server Error:", e); throw new Error(e.message || "Failed to process request"); }
  })
