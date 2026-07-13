import { db } from '@/lib/db'
import { NewsletterInput } from '@/lib/validators/newsletter'
import { sendNewsletterWelcome } from '@/lib/email'

export async function subscribeToNewsletter(data: NewsletterInput) {
  const existing = await db.newsletterSubscriber.findUnique({
    where: { email: data.email }
  })

  if (existing) {
    if (!existing.isActive) {
      await db.newsletterSubscriber.update({
        where: { id: existing.id },
        data: { isActive: true, unsubscribedAt: null }
      })
      return { success: true, alreadySubscribed: false }
    }
    return { success: true, alreadySubscribed: true }
  }

  await db.newsletterSubscriber.create({
    data: {
      email: data.email,
      name: data.name,
      source: data.source
    }
  })

  // Send welcome email (awaited for serverless compatibility)
  await sendNewsletterWelcome(data.email, data.name).catch(console.error)

  return { success: true, alreadySubscribed: false }
}

export async function unsubscribeFromNewsletter(email: string) {
  await db.newsletterSubscriber.update({
    where: { email },
    data: { 
      isActive: false,
      unsubscribedAt: new Date()
    }
  })
}

export async function getSubscribers(page = 1, limit = 50) {
  const skip = (page - 1) * limit
  const [subscribers, total] = await Promise.all([
    db.newsletterSubscriber.findMany({
      skip,
      take: limit,
      orderBy: { subscribedAt: 'desc' }
    }),
    db.newsletterSubscriber.count()
  ])

  return { subscribers, total, pages: Math.ceil(total / limit) }
}

export async function exportSubscribers(): Promise<string> {
  const subscribers = await db.newsletterSubscriber.findMany({
    where: { isActive: true },
    orderBy: { subscribedAt: 'desc' }
  })

  const header = 'Email,Name,Subscribed At,Source\n'
  const rows = subscribers.map(sub => {
    return `"${sub.email}","${sub.name || ''}","${sub.subscribedAt.toISOString()}","${sub.source || ''}"`
  }).join('\n')

  return header + rows
}
