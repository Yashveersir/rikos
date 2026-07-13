import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { loginSchema, forgotPasswordSchema, resetPasswordSchema } from '@/lib/validators/auth'
import { 
  loginAdmin, 
  createPasswordResetToken, 
  resetPassword, 
  getUsers, 
  createAdmin, 
  toggleUserStatus 
} from '@/server/services/auth.service'
import { AdminRole } from '@/lib/auth'
import { setCookie, deleteCookie, getCookie } from '@tanstack/react-start/server'
import { requireAdmin } from '@/server/middleware/auth.middleware'

export const adminLogin = createServerFn({ method: 'POST' })
  .validator(loginSchema)
  .handler(async ({ data }) => {
      try {
                  const { accessToken, refreshToken, admin } = await loginAdmin(data.email, data.password)
                  
                  setCookie('access_token', accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    maxAge: 15 * 60, // 15 mins
                    path: '/'
                  })
                  
                  setCookie('refresh_token', refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    maxAge: 7 * 24 * 60 * 60, // 7 days
                    path: '/'
                  })

                  return { success: true, admin }
                } catch (e: any) { console.error("Server Error:", e); return { success: false, error: e.message || "Failed to process request" }; }
  })

export const adminLogout = createServerFn({ method: 'POST' })
  .handler(async () => {
      try { 
                      deleteCookie('access_token')
                      deleteCookie('refresh_token')
                      return { success: true }
                     } catch (e: any) { console.error("Server Error:", e); return { success: false, error: e.message || "Failed to process request" }; }
  })

export const getAdminSession = createServerFn({ method: 'GET' })
  .handler(async () => {
      try { 
                      try {
                        const auth = requireAdmin()
                        return auth
                      } catch {
                        return null
                      }
                     } catch (e: any) { console.error("Server Error:", e); return { success: false, error: e.message || "Failed to process request" }; }
  })

export const adminForgotPassword = createServerFn({ method: 'POST' })
  .validator(forgotPasswordSchema)
  .handler(async ({ data }) => {
      try {
                  await createPasswordResetToken(data.email)
                  return { success: true } // Always return true for security
                } catch (e: any) { console.error("Server Error:", e); return { success: false, error: e.message || "Failed to process request" }; }
  })

export const adminResetPassword = createServerFn({ method: 'POST' })
  .validator(resetPasswordSchema.extend({ uid: z.string() }))
  .handler(async ({ data }) => {
      try {
                  await resetPassword(data.token, data.password, data.uid)
                  return { success: true }
                } catch (e: any) { console.error("Server Error:", e); return { success: false, error: e.message || "Failed to process request" }; }
  })

export const adminGetUsers = createServerFn({ method: 'GET' })
  .handler(async () => {
      try { 
                      requireAdmin()
                      return getUsers()
                     } catch (e: any) { console.error("Server Error:", e); return { success: false, error: e.message || "Failed to process request" }; }
  })

export const adminCreateUser = createServerFn({ method: 'POST' })
  .validator(z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    role: z.enum(['SUPER_ADMIN', 'ADMIN', 'STAFF']).optional()
  }))
  .handler(async ({ data }) => {
      try {
                  requireAdmin()
                  const user = await createAdmin({ ...data, role: data.role as AdminRole })
                  return { success: true, id: user.id }
                } catch (e: any) { console.error("Server Error:", e); return { success: false, error: e.message || "Failed to process request" }; }
  })

export const adminToggleUserStatus = createServerFn({ method: 'POST' })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
      try {
                  requireAdmin()
                  await toggleUserStatus(data.id)
                  return { success: true }
                } catch (e: any) { console.error("Server Error:", e); return { success: false, error: e.message || "Failed to process request" }; }
  })
