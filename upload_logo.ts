import { createClient } from '@supabase/supabase-js'
import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'

const supabaseUrl = process.env.SUPABASE_URL || 'https://wzdifoawilxxoaeskgni.supabase.co'
const supabase = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!)
const prisma = new PrismaClient()

async function run() {
  try {
    const fileContent = fs.readFileSync('public/rikos-logo.webp')
    const fileName = `logo-${Date.now()}.webp`

    const { data, error } = await supabase.storage.from('logos').upload(fileName, fileContent, {
      contentType: 'image/webp',
      upsert: true
    })

    if (error) throw error

    const { data: publicUrlData } = supabase.storage.from('logos').getPublicUrl(fileName)
    const publicUrl = publicUrlData.publicUrl

    console.log("Uploaded Logo to:", publicUrl)

    // Store in Prisma DB
    await prisma.websiteSetting.upsert({
      where: { key: 'restaurant_logo' },
      update: { value: publicUrl },
      create: { key: 'restaurant_logo', value: publicUrl, description: 'Official Restaurant Logo' }
    })

    console.log("Saved to WebsiteSettings DB.")
  } catch(e) {
    console.error(e)
  } finally {
    await prisma.$disconnect()
  }
}
run()
