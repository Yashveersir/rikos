import { db } from './db'

export async function checkRateLimit(
  key: string,
  limit: number = 10,
  windowMs: number = 60_000
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const now = new Date()
  const windowEnd = new Date(now.getTime() + windowMs)

  try {
    const entry = await db.rateLimitLog.findUnique({ where: { key } })

    if (!entry || now > entry.resetAt) {
      await db.rateLimitLog.upsert({
        where: { key },
        create: { key, count: 1, resetAt: windowEnd },
        update: { count: 1, resetAt: windowEnd },
      })
      return { allowed: true, remaining: limit - 1, resetAt: windowEnd.getTime() }
    }

    if (entry.count >= limit) {
      return { allowed: false, remaining: 0, resetAt: entry.resetAt.getTime() }
    }

    const updated = await db.rateLimitLog.update({
      where: { key },
      data: { count: { increment: 1 } },
    })
    
    return { allowed: true, remaining: limit - updated.count, resetAt: entry.resetAt.getTime() }
  } catch (error) {
    // Fail open if database is down or table doesn't exist yet
    console.error('Rate limit error:', error)
    return { allowed: true, remaining: limit - 1, resetAt: windowEnd.getTime() }
  }
}
