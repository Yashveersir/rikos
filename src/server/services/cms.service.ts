import { db } from '@/lib/db'

export async function getSetting(key: string): Promise<string | null> {
  const setting = await db.websiteSetting.findUnique({ where: { key } })
  return setting?.value ?? null
}

export async function getSettings(keys: string[]): Promise<Record<string, string>> {
  const settings = await db.websiteSetting.findMany({
    where: { key: { in: keys } }
  })
  
  return settings.reduce((acc, curr) => {
    acc[curr.key] = curr.value
    return acc
  }, {} as Record<string, string>)
}

export async function getAllSettings(): Promise<Record<string, string>> {
  const settings = await db.websiteSetting.findMany()
  return settings.reduce((acc, curr) => {
    acc[curr.key] = curr.value
    return acc
  }, {} as Record<string, string>)
}

export async function setSetting(key: string, value: string, description?: string): Promise<void> {
  await db.websiteSetting.upsert({
    where: { key },
    update: { value, description },
    create: { key, value, description }
  })
}

export async function setSettings(settings: Record<string, string>): Promise<void> {
  const ops = Object.entries(settings).map(([key, value]) => 
    db.websiteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value }
    })
  )
  await db.$transaction(ops)
}

export async function initializeDefaultSettings(): Promise<void> {
  const defaults: Record<string, string> = {
    restaurant_name: "Riko's Cafe & Restro-Lounge",
    restaurant_phone: "+91 00000 00000",
    restaurant_email: "hello@rikoscafe.in",
    restaurant_address: "5th Floor, Regent Star Mall, Golapbag More, Grand Trunk Road, Burdwan, West Bengal",
    opening_hours: "Mon – Sun · 12:00 PM – 11:30 PM",
    instagram_url: "#",
    facebook_url: "#",
    hero_title: "Dine. Celebrate. Experience.",
    hero_subtitle: "A cinematic restro-lounge on the 5th floor of Regent Star Mall — where fine Indian, Chinese and tandoor cuisine meet an ambience worth remembering.",
    meta_title: "Riko's Cafe & Restro-Lounge — Luxury Dining in Burdwan",
    meta_description: "Riko's Cafe & Restro-Lounge in Burdwan — a premium destination for Indian, Chinese, Tandoor and signature mocktails.",
    google_analytics_id: ""
  }

  const existing = await getAllSettings()
  
  const toCreate = Object.entries(defaults).filter(([key]) => !(key in existing))
  
  if (toCreate.length > 0) {
    await db.websiteSetting.createMany({
      data: toCreate.map(([key, value]) => ({ key, value }))
    })
  }
}
