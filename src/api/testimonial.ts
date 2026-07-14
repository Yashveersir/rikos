import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { createTestimonial, getApprovedTestimonials } from '@/server/services/testimonial.service'

const submitReviewSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  rating: z.number().min(1).max(5),
  content: z.string().min(10, "Review must be at least 10 characters"),
})

export const publicSubmitReview = createServerFn({ method: 'POST' })
  .validator(submitReviewSchema)
  .handler(async ({ data }) => {
    try {
      const testimonial = await createTestimonial({
        name: data.name,
        email: data.email || undefined,
        rating: data.rating,
        content: data.content,
      })
      return { success: true, data: testimonial }
    } catch (e: any) {
      console.error("Testimonial creation error:", e)
      return { success: false, error: e.message || "Failed to submit review" }
    }
  })

export const publicGetReviews = createServerFn({ method: 'GET' })
  .handler(async () => {
    try {
      const testimonials = await getApprovedTestimonials()
      return { success: true, data: testimonials }
    } catch (e: any) {
      console.error("Fetch testimonials error:", e)
      return { success: false, error: e.message || "Failed to fetch reviews" }
    }
  })
