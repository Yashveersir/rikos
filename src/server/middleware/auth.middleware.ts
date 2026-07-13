import { getRequest } from '@tanstack/react-start/server'
import { getAuthFromCookie } from '@/lib/auth'

export function requireAdmin() {
  const request = getRequest()
  const auth = getAuthFromCookie(request?.headers.get('cookie') ?? null)
  
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
