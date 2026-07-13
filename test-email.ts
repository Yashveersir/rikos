import { sendContactConfirmation, sendContactAdminNotification } from './src/lib/email';

async function runTest() {
  const clientEmail = "yashveersir01@gmail.com";
  const clientName = "Test Client Yash";
  const testMessage = "This is a test message to verify the email functionality.";
  const testSubject = "Test Email Configuration";
  const testPhone = "1234567890";

  console.log("Sending client confirmation email to:", clientEmail);
  await sendContactConfirmation(clientEmail, clientName, testMessage);
  console.log("Client confirmation email sent (or attempted).");

  console.log("Sending admin notification email (should go to EMAIL_ADMIN in .env)");
  await sendContactAdminNotification({
    name: clientName,
    email: clientEmail,
    phone: testPhone,
    subject: testSubject,
    message: testMessage
  });
  console.log("Admin notification email sent (or attempted).");
  
  console.log("Check your inboxes!");
}

runTest().catch(console.error);
