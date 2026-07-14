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
  const bucketName = BUCKETS[bucket]
  
  let { data, error } = await supabaseAdmin.storage
    .from(bucketName)
    .upload(filename, fileBuffer, {
      contentType,
      upsert: true
    })

  if (error && (error.message.toLowerCase().includes('not found') || error.message.toLowerCase().includes('does not exist'))) {
    // Attempt to create the bucket
    logger.info({ bucketName }, 'Bucket not found. Attempting to create bucket...')
    const { error: createError } = await supabaseAdmin.storage.createBucket(bucketName, {
      public: true
    })
    
    if (!createError) {
      // Retry upload
      const retry = await supabaseAdmin.storage
        .from(bucketName)
        .upload(filename, fileBuffer, {
          contentType,
          upsert: true
        })
      data = retry.data
      error = retry.error
    } else {
      logger.error({ error: createError }, 'Failed to automatically create bucket')
    }
  }

  if (error) {
    logger.error({ error }, 'Storage upload failed')
    throw new Error(`Failed to upload image: ${error.message}`)
  }

  return getPublicUrl(bucket, data!.path)
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
