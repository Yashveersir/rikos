import { db } from '@/lib/db'
import { 
  hashPassword, 
  verifyPassword, 
  generateAccessToken, 
  generateRefreshToken, 
  AdminRole 
} from '@/lib/auth'
import { sendPasswordReset } from '@/lib/email'
import { randomBytes } from 'crypto'

export async function loginAdmin(email: string, password: string) {
  const admin = await db.adminUser.findUnique({ where: { email } })
  if (!admin || !admin.isActive) {
    throw new Error('Invalid credentials or inactive account')
  }

  const isValid = await verifyPassword(password, admin.password)
  if (!isValid) {
    throw new Error('Invalid credentials')
  }

  await db.adminUser.update({
    where: { id: admin.id },
    data: { lastLoginAt: new Date() }
  })

  // Log activity
  await db.activityLog.create({
    data: {
      adminUserId: admin.id,
      action: 'LOGIN',
      entity: 'AUTH'
    }
  })

  const payload = { id: admin.id, email: admin.email, role: admin.role as AdminRole }
  const accessToken = generateAccessToken(payload)
  const refreshToken = generateRefreshToken({ id: admin.id })

  return { accessToken, refreshToken, admin: { id: admin.id, email: admin.email, name: admin.name, role: admin.role } }
}

export async function refreshAdminToken(refreshToken: string) {
  // Will be handled by the route or middleware later, keeping minimal here
  return { accessToken: 'temp' }
}

export async function getAdminById(id: string) {
  return db.adminUser.findUnique({ where: { id } })
}

export async function createAdmin(data: { email: string; password: string; name: string; role?: AdminRole }) {
  const existing = await db.adminUser.findUnique({ where: { email: data.email } })
  if (existing) throw new Error('Email already registered')

  const hashedPassword = await hashPassword(data.password)
  
  return db.adminUser.create({
    data: {
      email: data.email,
      name: data.name,
      password: hashedPassword,
      role: data.role || AdminRole.STAFF
    }
  })
}

export async function updateUser(id: string, data: { name?: string; role?: AdminRole; email?: string; password?: string }) {
  const user = await db.adminUser.findUnique({ where: { id } })
  if (!user) throw new Error("User not found")
  if (user.role === AdminRole.SUPER_ADMIN && data.role && data.role !== AdminRole.SUPER_ADMIN) {
    throw new Error("Cannot change role of Super Admin")
  }

  const updateData: any = {}
  if (data.name) updateData.name = data.name
  if (data.email) updateData.email = data.email
  if (data.role) updateData.role = data.role
  if (data.password) {
    updateData.password = await hashPassword(data.password)
  }

  return db.adminUser.update({
    where: { id },
    data: updateData
  })
}

export async function getUsers() {
  return db.adminUser.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      lastLoginAt: true,
      createdAt: true
    },
    orderBy: { createdAt: 'desc' }
  })
}

export async function toggleUserStatus(id: string) {
  const user = await db.adminUser.findUnique({ where: { id } })
  if (!user) throw new Error("User not found")
  if (user.role === AdminRole.SUPER_ADMIN) throw new Error("Cannot toggle Super Admin status")
  
  return db.adminUser.update({
    where: { id },
    data: { isActive: !user.isActive }
  })
}

export async function updateAdminPassword(id: string, currentPassword: string, newPassword: string) {
  const admin = await db.adminUser.findUnique({ where: { id } })
  if (!admin) throw new Error('Admin not found')

  const isValid = await verifyPassword(currentPassword, admin.password)
  if (!isValid) throw new Error('Current password is incorrect')

  const hashedPassword = await hashPassword(newPassword)
  
  await db.adminUser.update({
    where: { id },
    data: { password: hashedPassword }
  })
}

export async function createPasswordResetToken(email: string) {
  const admin = await db.adminUser.findUnique({ where: { email } })
  if (!admin) return '' // Silently return to prevent email enumeration

  const token = randomBytes(32).toString('hex')
  const hashedToken = await hashPassword(token)
  
  // Store in settings table temporarily with a TTL format key
  const resetKey = `reset_token_${admin.id}`
  await db.websiteSetting.upsert({
    where: { key: resetKey },
    update: { value: hashedToken, description: Date.now().toString() }, // use description for timestamp
    create: { key: resetKey, value: hashedToken, description: Date.now().toString() }
  })

  const resetUrl = `${process.env.APP_URL}/admin/reset-password?token=${token}&uid=${admin.id}`
  await sendPasswordReset(email, admin.name, resetUrl).catch(console.error)

  return token
}

export async function resetPassword(token: string, newPassword: string, uid: string) {
  const resetKey = `reset_token_${uid}`
  const tokenSetting = await db.websiteSetting.findUnique({ where: { key: resetKey } })
  
  if (!tokenSetting) throw new Error('Invalid or expired reset token')
  
  // Check expiration (1 hour)
  const timestamp = parseInt(tokenSetting.description || '0')
  if (Date.now() - timestamp > 3600000) {
    await db.websiteSetting.delete({ where: { key: resetKey } })
    throw new Error('Reset token has expired')
  }

  const isValid = await verifyPassword(token, tokenSetting.value)
  if (!isValid) throw new Error('Invalid reset token')

  const hashedPassword = await hashPassword(newPassword)
  
  await db.adminUser.update({
    where: { id: uid },
    data: { password: hashedPassword }
  })

  // Cleanup
  await db.websiteSetting.delete({ where: { key: resetKey } })
}

export async function initializeSuperAdmin() {
  const email = process.env.ADMIN_INITIAL_EMAIL
  const password = process.env.ADMIN_INITIAL_PASSWORD
  
  if (!email || !password) return

  const existing = await db.adminUser.count()
  if (existing > 0) return // Only run if no admins exist

  const hashedPassword = await hashPassword(password)
  
  await db.adminUser.create({
    data: {
      email,
      name: 'Super Admin',
      password: hashedPassword,
      role: AdminRole.SUPER_ADMIN
    }
  })
}
