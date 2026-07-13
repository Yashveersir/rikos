import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { parseCookie } from 'cookie'

export enum AdminRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  STAFF = 'STAFF'
}

export interface TokenPayload {
  id: string
  email: string
  role: AdminRole
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function generateAccessToken(payload: TokenPayload): string {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET is not set')
  return jwt.sign(payload, secret, { expiresIn: '15m' })
}

export function generateRefreshToken(payload: { id: string }): string {
  const secret = process.env.JWT_REFRESH_SECRET
  if (!secret) throw new Error('JWT_REFRESH_SECRET is not set')
  return jwt.sign(payload, secret, { expiresIn: '7d' })
}

export function verifyAccessToken(token: string): TokenPayload | null {
  try {
    const secret = process.env.JWT_SECRET
    if (!secret) throw new Error('JWT_SECRET is not set')
    return jwt.verify(token, secret) as TokenPayload
  } catch {
    return null
  }
}

export function verifyRefreshToken(token: string): { id: string } | null {
  try {
    const secret = process.env.JWT_REFRESH_SECRET
    if (!secret) throw new Error('JWT_REFRESH_SECRET is not set')
    return jwt.verify(token, secret) as { id: string }
  } catch {
    return null
  }
}

export function getAuthFromCookie(cookieHeader: string | null): TokenPayload | null {
  if (!cookieHeader) return null
  const cookies = parseCookie(cookieHeader)
  const token = cookies['access_token']
  if (!token) return null
  return verifyAccessToken(token)
}
