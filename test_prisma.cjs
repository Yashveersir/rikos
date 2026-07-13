const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  try {
    const reservation = await prisma.reservation.create({
      data: {
        name: 'test',
        email: 'test@test.com',
        phone: '1234567890',
        date: new Date('2026-07-20'),
        time: '19:00',
        guests: 2,
        occasion: 'CASUAL',
        specialRequests: '',
        status: 'PENDING'
      }
    });
    console.log("Success:", reservation);
  } catch (e) {
    console.error("Prisma Error:", e);
  } finally {
    await prisma.$disconnect();
  }
}
run();
