import { createClient } from '@supabase/supabase-js'
import { logger } from './logger'

const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
})

export const BUCKETS = {
  menu: 'menu-images',
  gallery: 'gallery-images',
  logos: 'logos',
} as const

export async function uploadImage(
  bucket: keyof typeof BUCKETS,
  fileBuffer: ArrayBuffer | Buffer,
  filename: string,
  contentType: string
): Promise<string> {
  const { data, error } = await supabaseAdmin.storage
    .from(BUCKETS[bucket])
    .upload(filename, fileBuffer, {
      contentType,
      upsert: true
    })

  if (error) {
    logger.error({ error }, 'Storage upload failed')
    throw new Error(`Failed to upload image: ${error.message}`)
  }

  return getPublicUrl(bucket, data.path)
}

export async function deleteImage(bucket: keyof typeof BUCKETS, path: string): Promise<void> {
  const { error } = await supabaseAdmin.storage
    .from(BUCKETS[bucket])
    .remove([path])
    
  if (error) {
    logger.error({ error }, 'Storage delete failed')
    throw new Error(`Failed to delete image: ${error.message}`)
  }
}

export function getPublicUrl(bucket: keyof typeof BUCKETS, path: string): string {
  const { data } = supabaseAdmin.storage.from(BUCKETS[bucket]).getPublicUrl(path)
  return data.publicUrl
}
