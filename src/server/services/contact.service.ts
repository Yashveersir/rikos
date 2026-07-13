import { db } from '@/lib/db'
import { ContactInput } from '@/lib/validators/contact'
import { sendContactConfirmation, sendContactAdminNotification } from '@/lib/email'

export async function createContactMessage(data: ContactInput, ipAddress?: string) {
  const message = await db.contactMessage.create({
    data: {
      ...data,
      ipAddress
    }
  })

  // Send emails asynchronously
  Promise.all([
    sendContactConfirmation(data.email, data.name, data.message),
    sendContactAdminNotification(data)
  ]).catch(console.error)

  return message
}

export async function getContactMessages(page = 1, limit = 20) {
  const skip = (page - 1) * limit
  const [messages, total] = await Promise.all([
    db.contactMessage.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }),
    db.contactMessage.count()
  ])

  return { messages, total, pages: Math.ceil(total / limit) }
}

export async function markMessageAsRead(id: string) {
  await db.contactMessage.update({
    where: { id },
    data: { isRead: true }
  })
}

export async function replyToMessage(id: string, content: string) {
  await db.contactMessage.update({
    where: { id },
    data: { 
      isRead: true,
      repliedAt: new Date(),
      replyContent: content
    }
  })
}

export async function getUnreadCount() {
  return db.contactMessage.count({
    where: { isRead: false }
  })
}
