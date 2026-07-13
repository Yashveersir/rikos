import { submitReservation } from './src/api/reservation.ts'

async function run() {
  try {
    const res = await submitReservation({ data: { name: 'yash', email: 'yashveersir01@gmail.com', phone: '8873394750', date: '2026-07-20', time: '19:00', guests: 2, occasion: 'CASUAL', specialRequests: '' } })
    console.log(res)
  } catch(e) {
    console.error(e)
  }
}
run()
