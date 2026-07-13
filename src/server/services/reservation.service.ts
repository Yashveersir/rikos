import { db } from '@/lib/db'
import { CreateReservationInput, UpdateReservationInput } from '@/lib/validators/reservation'
import { sendReservationConfirmation, sendReservationAdminNotification, sendReservationStatusUpdate } from '@/lib/email'

export async function createReservation(data: CreateReservationInput) {
  const reservation = await db.reservation.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      date: new Date(data.date),
      time: data.time,
      guests: data.guests,
      occasion: data.occasion,
      specialRequests: data.specialRequests,
      status: 'PENDING'
    }
  })

  // Send confirmation email
  sendReservationConfirmation(data.email, {
    id: reservation.id,
    name: data.name,
    date: data.date,
    time: data.time,
    guests: data.guests,
    occasion: data.occasion
  }).catch(console.error)

  // Send admin notification
  sendReservationAdminNotification({
    id: reservation.id,
    name: data.name,
    email: data.email,
    phone: data.phone,
    date: data.date,
    time: data.time,
    guests: data.guests,
    occasion: data.occasion,
    specialRequests: data.specialRequests
  }).catch(console.error)

  return reservation
}

export async function getReservations(options?: { page?: number; limit?: number; status?: string; date?: string }) {
  const page = options?.page || 1
  const limit = options?.limit || 20
  const skip = (page - 1) * limit
  
  const where: any = {}
  if (options?.status) where.status = options.status
  if (options?.date) where.date = new Date(options.date)

  const [reservations, total] = await Promise.all([
    db.reservation.findMany({
      where,
      skip,
      take: limit,
      orderBy: [{ date: 'asc' }, { time: 'asc' }],
      include: { table: true }
    }),
    db.reservation.count({ where })
  ])

  return { reservations, total, pages: Math.ceil(total / limit) }
}

export async function getReservationById(id: string) {
  return db.reservation.findUnique({
    where: { id },
    include: { table: true }
  })
}

export async function updateReservation(data: UpdateReservationInput) {
  const current = await db.reservation.findUnique({ where: { id: data.id } })
  if (!current) throw new Error('Reservation not found')

  const updateData: any = {}
  if (data.status) updateData.status = data.status
  if (data.tableId) updateData.tableId = data.tableId
  if (data.internalNotes) updateData.internalNotes = data.internalNotes
  if (data.date) updateData.date = new Date(data.date)
  if (data.time) updateData.time = data.time
  
  if (data.status === 'CONFIRMED' && current.status !== 'CONFIRMED') {
    updateData.confirmedAt = new Date()
  }
  if (data.status === 'CANCELLED' && current.status !== 'CANCELLED') {
    updateData.cancelledAt = new Date()
  }

  const reservation = await db.reservation.update({
    where: { id: data.id },
    data: updateData
  })

  if (data.status && data.status !== current.status && ['CONFIRMED', 'REJECTED', 'CANCELLED'].includes(data.status)) {
    sendReservationStatusUpdate(
      reservation.email, 
      reservation.name, 
      data.status as any,
      data.internalNotes
    ).catch(console.error)
  }

  return reservation
}

export async function getReservationStats() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

  const [todayCount, pendingCount, confirmedCount, thisMonthCount] = await Promise.all([
    db.reservation.count({ where: { date: { gte: today, lt: tomorrow } } }),
    db.reservation.count({ where: { status: 'PENDING' } }),
    db.reservation.count({ where: { status: 'CONFIRMED', date: { gte: today, lt: tomorrow } } }),
    db.reservation.count({ where: { date: { gte: firstDayOfMonth } } })
  ])

  return { today: todayCount, pending: pendingCount, confirmed: confirmedCount, thisMonth: thisMonthCount }
}

export async function getAvailableTables(date: string, time: string, guests: number) {
  // Simple check: Find all active tables that can fit the guests
  // In a real system, you'd check overlapping reservations
  const targetDate = new Date(date)
  
  // Find reservations on this date and time
  const existingReservations = await db.reservation.findMany({
    where: {
      date: targetDate,
      time: time,
      status: { in: ['CONFIRMED', 'PENDING'] },
      tableId: { not: null }
    },
    select: { tableId: true }
  })
  
  const bookedTableIds = existingReservations.map(r => r.tableId).filter(Boolean) as string[]

  return db.restaurantTable.findMany({
    where: {
      isActive: true,
      capacity: { gte: guests },
      id: { notIn: bookedTableIds }
    },
    orderBy: { capacity: 'asc' }
  })
}
