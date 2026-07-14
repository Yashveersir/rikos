import { createServerFn } from '@tanstack/react-start'
import { requireAdmin } from '@/server/middleware/auth.middleware'
import { uploadImage, BUCKETS } from '@/lib/storage'
import { getRequest } from '@tanstack/react-start/server'
import { z } from 'zod'

export const adminUploadFile = createServerFn({ method: 'POST' })
  .validator((d: any) => d as FormData)
  .handler(async ({ data }) => {
      try { 
                      requireAdmin()
                      
                      let file: File | null = null
                      let bucket: string = ''

                      if (data instanceof FormData) {
                        file = data.get('file') as File | null
                        bucket = data.get('bucket') as string
                      } else if (data && typeof data === 'object') {
                        file = (data as any).file as File | null
                        bucket = (data as any).bucket as string
                      }
                      
                      if (!file) throw new Error("No file provided")
                      if (!bucket || !Object.keys(BUCKETS).includes(bucket)) {
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
                     } catch (e: any) { console.error("Server Error:", e); return { success: false, error: e.message || "Failed to process request" }; }
  })
