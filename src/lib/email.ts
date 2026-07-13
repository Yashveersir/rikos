import { logger } from './logger'

const getApiKey = () => process.env.BREVO_API_KEY
const getFromEmail = () => process.env.EMAIL_FROM || 'admin@rikos.in'
const adminEmail = process.env.EMAIL_ADMIN || 'admin@rikos.in'

const baseHtml = (content: string) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { background-color: #0D0D0D; color: #E5E5E5; font-family: sans-serif; margin: 0; padding: 40px; }
    .container { max-width: 600px; margin: 0 auto; border: 1px solid #C9A227; padding: 40px; border-radius: 16px; background-color: #1B1B1B; }
    h1 { color: #C9A227; font-family: 'Georgia', serif; font-weight: normal; margin-top: 0; }
    a { color: #C9A227; text-decoration: none; }
    .footer { margin-top: 40px; font-size: 12px; color: #888; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <h1>RIKO'S CAFE</h1>
    ${content}
  </div>
  <div class="footer">
    © ${new Date().getFullYear()} Riko's Cafe & Restro-Lounge.<br>
    Regent Star Mall, Golapbag More, Burdwan.
  </div>
</body>
</html>
`

async function sendBrevoEmail(to: string, subject: string, htmlContent: string) {
  const apiKey = getApiKey()
  if (!apiKey) {
    logger.warn('BREVO_API_KEY is not set. Skipping email delivery.')
    return
  }

  try {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        sender: { name: "Riko's Cafe", email: getFromEmail() },
        to: [{ email: to }],
        subject,
        htmlContent
      })
    })

    if (!res.ok) {
      const errorData = await res.text()
      throw new Error(`Brevo API Error (${res.status}): ${errorData}`)
    }
  } catch (error) {
    logger.error({ error }, 'Failed to send email via Brevo')
  }
}

export async function sendContactConfirmation(to: string, name: string, message: string): Promise<void> {
  const html = baseHtml(`
    <p>Dear ${name},</p>
    <p>Thank you for reaching out to us. We have received your message and will get back to you shortly.</p>
    <p><strong>Your message:</strong><br/><em>${message}</em></p>
    <p>Warm regards,<br/>The Riko's Team</p>
  `)
  await sendBrevoEmail(to, "We've received your message — Riko's Cafe", html)
}

export async function sendContactAdminNotification(data: { name: string; email: string; phone?: string; subject?: string; message: string }): Promise<void> {
  const html = baseHtml(`
    <p>New message received from the website contact form.</p>
    <ul>
      <li><strong>Name:</strong> ${data.name}</li>
      <li><strong>Email:</strong> ${data.email}</li>
      <li><strong>Phone:</strong> ${data.phone || 'N/A'}</li>
      <li><strong>Subject:</strong> ${data.subject || 'N/A'}</li>
    </ul>
    <p><strong>Message:</strong><br/>${data.message}</p>
  `)
  await sendBrevoEmail(adminEmail, `New Contact Form Submission: ${data.subject || 'General Inquiry'}`, html)
}

export async function sendReservationConfirmation(to: string, res: { name: string; date: string; time: string; guests: number; occasion: string; id: string }): Promise<void> {
  const html = baseHtml(`
    <p>Dear ${res.name},</p>
    <p>We have received your reservation request for <strong>${res.date} at ${res.time}</strong> for <strong>${res.guests} guests</strong>.</p>
    <p>Your request is currently pending. We will notify you once it is confirmed.</p>
    <p>Reference ID: ${res.id}</p>
  `)
  await sendBrevoEmail(to, "Your Reservation Request — Riko's Cafe", html)
}

export async function sendReservationStatusUpdate(to: string, name: string, status: 'CONFIRMED' | 'REJECTED' | 'CANCELLED', notes?: string): Promise<void> {
  const subjectMap = {
    CONFIRMED: "Reservation Confirmed — Riko's Cafe",
    REJECTED: "Update on your Reservation — Riko's Cafe",
    CANCELLED: "Reservation Cancelled — Riko's Cafe"
  }
  const messageMap = {
    CONFIRMED: "Great news! Your reservation has been confirmed. We look forward to hosting you.",
    REJECTED: "Unfortunately, we are unable to accommodate your reservation at the requested time.",
    CANCELLED: "Your reservation has been cancelled as requested."
  }
  
  const html = baseHtml(`
    <p>Dear ${name},</p>
    <p>${messageMap[status]}</p>
    ${notes ? `<p><strong>Note from our team:</strong> ${notes}</p>` : ''}
  `)
  await sendBrevoEmail(to, subjectMap[status], html)
}

export async function sendNewsletterWelcome(to: string, name?: string): Promise<void> {
  const html = baseHtml(`
    <p>Hello ${name ? name : 'there'},</p>
    <p>Thank you for subscribing to our newsletter! You'll now be the first to know about our special offers, new menu items, and exclusive events.</p>
  `)
  await sendBrevoEmail(to, "Welcome to Riko's Cafe Newsletter", html)
}

export async function sendPasswordReset(to: string, name: string, resetUrl: string): Promise<void> {
  const html = baseHtml(`
    <p>Hi ${name},</p>
    <p>We received a request to reset your admin password. Click the link below to set a new password:</p>
    <p><a href="${resetUrl}">Reset Password</a></p>
    <p>If you didn't request this, you can safely ignore this email.</p>
  `)
  await sendBrevoEmail(to, "Password Reset Request", html)
}
