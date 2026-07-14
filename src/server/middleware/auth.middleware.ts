import { getRequest } from '@tanstack/react-start/server'
import { getAuthFromCookie } from '@/lib/auth'

export function requireAdmin() {
  const request = getRequest()
  if (!request) throw new Error('No request context')

  // Basic CSRF Protection for mutating requests
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    const origin = request.headers.get('origin')
    const appUrl = process.env.APP_URL
    const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL
    
    if (origin) {
      const isAllowed = 
        (appUrl && origin.startsWith(appUrl)) || 
        (vercelUrl && origin.includes(vercelUrl)) ||
        origin.includes('vercel.app') || 
        origin.includes('localhost')

      if (!isAllowed) {
        throw new Error(`CSRF Validation Failed: Origin ${origin} not allowed`)
      }
    }
  }

  const auth = getAuthFromCookie(request.headers.get('cookie') ?? null)
  
  if (!auth) {
    throw new Error('Unauthorized')
  }
  
  return auth
}

export function requireSuperAdmin() {
  const auth = requireAdmin()
  if (auth.role !== 'SUPER_ADMIN') {
    throw new Error('Forbidden: Super Admin access required')
  }
  return auth
}
