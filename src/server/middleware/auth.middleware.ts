import { getRequest } from '@tanstack/react-start/server'
import { getAuthFromCookie } from '@/lib/auth'

export function requireAdmin() {
  const request = getRequest()
  if (!request) throw new Error('No request context')

  // Basic CSRF Protection for mutating requests
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    const origin = request.headers.get('origin')
    const appUrl = process.env.APP_URL
    if (appUrl && origin && !origin.startsWith(appUrl)) {
      throw new Error('CSRF Validation Failed')
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
