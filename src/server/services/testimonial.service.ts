import { db } from '@/lib/db'

export async function createTestimonial(data: {
  name: string
  email?: string
  rating: number
  content: string
}) {
  return db.testimonial.create({
    data: {
      name: data.name,
      email: data.email,
      rating: data.rating,
      content: data.content,
      isApproved: true, // auto-approve so they show up immediately
      isFeatured: true,
    },
  })
}

export async function getApprovedTestimonials() {
  return db.testimonial.findMany({
    where: {
      isApproved: true,
      isHidden: false,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 10,
  })
}
