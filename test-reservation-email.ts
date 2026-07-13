import { sendReservationConfirmation, sendReservationAdminNotification } from './src/lib/email';

async function runTest() {
  const clientEmail = "yashveersir01@gmail.com";
  
  const testRes = {
    id: "RES-TEST-1234",
    name: "Yash Singh",
    email: clientEmail,
    phone: "9876543210",
    date: "2026-07-20",
    time: "20:00",
    guests: 4,
    occasion: "BIRTHDAY",
    specialRequests: "Please arrange a corner table if possible."
  };

  console.log("Sending client reservation confirmation to:", clientEmail);
  await sendReservationConfirmation(clientEmail, testRes);

  console.log("Sending admin reservation notification (to EMAIL_ADMIN in .env)");
  await sendReservationAdminNotification(testRes);
  
  console.log("Test complete. Check inboxes!");
}

runTest().catch(console.error);
