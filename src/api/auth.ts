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
  })

export const adminLogout = createServerFn({ method: 'POST' })
  .handler(async () => {
    deleteCookie('access_token')
    deleteCookie('refresh_token')
    return { success: true }
  })

export const getAdminSession = createServerFn({ method: 'GET' })
  .handler(async () => {
    try {
      const auth = requireAdmin()
      return auth
    } catch {
      return null
    }
  })

export const adminForgotPassword = createServerFn({ method: 'POST' })
  .validator(forgotPasswordSchema)
  .handler(async ({ data }) => {
    await createPasswordResetToken(data.email)
    return { success: true } // Always return true for security
  })

export const adminResetPassword = createServerFn({ method: 'POST' })
  .validator(resetPasswordSchema.extend({ uid: z.string() }))
  .handler(async ({ data }) => {
    await resetPassword(data.token, data.password, data.uid)
    return { success: true }
  })

export const adminGetUsers = createServerFn({ method: 'GET' })
  .handler(async () => {
    requireAdmin()
    return getUsers()
  })

export const adminCreateUser = createServerFn({ method: 'POST' })
  .validator(z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    role: z.enum(['SUPER_ADMIN', 'ADMIN', 'STAFF']).optional()
  }))
  .handler(async ({ data }) => {
    requireAdmin()
    const user = await createAdmin({ ...data, role: data.role as AdminRole })
    return { success: true, id: user.id }
  })

export const adminToggleUserStatus = createServerFn({ method: 'POST' })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    requireAdmin()
    await toggleUserStatus(data.id)
    return { success: true }
  })
