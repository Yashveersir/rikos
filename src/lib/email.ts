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
    <p>Thank you for reaching out to Riko's Cafe. We have received your message and our team will get back to you shortly.</p>
    <div style="background: #2A2A2A; padding: 24px; border-radius: 8px; margin: 24px 0;">
      <h3 style="margin-top: 0; color: #C9A227; font-size: 16px; border-bottom: 1px solid #444; padding-bottom: 12px; margin-bottom: 16px;">Your Message Details</h3>
      <p style="margin: 0; color: #E5E5E5; line-height: 1.6;"><em>"${message.replace(/\n/g, '<br/>')}"</em></p>
    </div>
    <p>If you have any urgent inquiries, feel free to call us directly.</p>
    <p>Warm regards,<br/>The Riko's Team</p>
  `)
  await sendBrevoEmail(to, "We've received your message — Riko's Cafe", html)
}

export async function sendContactAdminNotification(data: { name: string; email: string; phone?: string; subject?: string; message: string }): Promise<void> {
  const html = baseHtml(`
    <h2 style="color: #fff; font-size: 20px; margin-bottom: 20px; border-left: 4px solid #C9A227; padding-left: 12px;">New Contact Submission</h2>
    <div style="background: #2A2A2A; padding: 24px; border-radius: 8px;">
      <table style="width: 100%; border-collapse: collapse; text-align: left;">
        <tr><td style="padding: 10px 0; border-bottom: 1px solid #444; color: #aaa; width: 100px;">Name</td><td style="padding: 10px 0; border-bottom: 1px solid #444; color: #fff;"><strong>${data.name}</strong></td></tr>
        <tr><td style="padding: 10px 0; border-bottom: 1px solid #444; color: #aaa;">Email</td><td style="padding: 10px 0; border-bottom: 1px solid #444; color: #fff;"><strong><a href="mailto:${data.email}">${data.email}</a></strong></td></tr>
        <tr><td style="padding: 10px 0; border-bottom: 1px solid #444; color: #aaa;">Phone</td><td style="padding: 10px 0; border-bottom: 1px solid #444; color: #fff;"><strong>${data.phone || 'Not provided'}</strong></td></tr>
        <tr><td style="padding: 10px 0; border-bottom: 1px solid #444; color: #aaa;">Subject</td><td style="padding: 10px 0; border-bottom: 1px solid #444; color: #fff;"><strong>${data.subject || 'General Inquiry'}</strong></td></tr>
      </table>
      <div style="margin-top: 24px;">
        <div style="color: #aaa; margin-bottom: 10px; font-weight: bold;">Message:</div>
        <div style="background: #1B1B1B; padding: 16px; border-radius: 6px; color: #E5E5E5; line-height: 1.6; border-left: 3px solid #C9A227;">
          ${data.message.replace(/\n/g, '<br/>')}
        </div>
      </div>
    </div>
    <p style="margin-top: 24px; color: #888;">You can reply directly to this email to respond to the customer.</p>
  `)
  await sendBrevoEmail(adminEmail, `New Contact Form Submission: ${data.subject || 'General Inquiry'}`, html)
}

export async function sendReservationConfirmation(to: string, res: { name: string; date: string; time: string; guests: number; occasion: string; id: string }): Promise<void> {
  const html = baseHtml(`
    <p>Dear ${res.name},</p>
    <p>Thank you for choosing Riko's Cafe. We have received your reservation request. Please note that this is currently <strong>pending confirmation</strong> from our team.</p>
    
    <div style="background: #2A2A2A; padding: 24px; border-radius: 8px; margin: 24px 0;">
      <h3 style="margin-top: 0; color: #C9A227; font-size: 18px; border-bottom: 1px solid #444; padding-bottom: 12px; margin-bottom: 16px;">Reservation Details</h3>
      <table style="width: 100%; border-collapse: collapse; text-align: left;">
        <tr><td style="padding: 10px 0; border-bottom: 1px solid #444; color: #aaa; width: 120px;">Reference ID</td><td style="padding: 10px 0; border-bottom: 1px solid #444; color: #fff;"><strong>${res.id}</strong></td></tr>
        <tr><td style="padding: 10px 0; border-bottom: 1px solid #444; color: #aaa;">Date</td><td style="padding: 10px 0; border-bottom: 1px solid #444; color: #fff;"><strong>${res.date}</strong></td></tr>
        <tr><td style="padding: 10px 0; border-bottom: 1px solid #444; color: #aaa;">Time</td><td style="padding: 10px 0; border-bottom: 1px solid #444; color: #fff;"><strong>${res.time}</strong></td></tr>
        <tr><td style="padding: 10px 0; border-bottom: 1px solid #444; color: #aaa;">Guests</td><td style="padding: 10px 0; border-bottom: 1px solid #444; color: #fff;"><strong>${res.guests} People</strong></td></tr>
        <tr><td style="padding: 10px 0; color: #aaa;">Occasion</td><td style="padding: 10px 0; color: #fff;"><strong>${res.occasion}</strong></td></tr>
      </table>
    </div>
    <p>We will notify you via email as soon as your table is confirmed.</p>
    <p>Warm regards,<br/>The Riko's Team</p>
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
    CONFIRMED: "Great news! Your reservation has been <strong>confirmed</strong>. We look forward to hosting you.",
    REJECTED: "Unfortunately, we are unable to accommodate your reservation at the requested time. Please contact us to reschedule.",
    CANCELLED: "Your reservation has been <strong>cancelled</strong> successfully as requested."
  }
  
  const html = baseHtml(`
    <p>Dear ${name},</p>
    <div style="background: #2A2A2A; padding: 24px; border-radius: 8px; margin: 24px 0; border-left: 4px solid ${status === 'CONFIRMED' ? '#4CAF50' : status === 'REJECTED' ? '#F44336' : '#FF9800'};">
      <h3 style="margin-top: 0; color: #fff; font-size: 18px;">Reservation Status: <span style="color: ${status === 'CONFIRMED' ? '#4CAF50' : status === 'REJECTED' ? '#F44336' : '#FF9800'}">${status}</span></h3>
      <p style="margin: 0; color: #E5E5E5; line-height: 1.6;">${messageMap[status]}</p>
    </div>
    ${notes ? `
    <div style="background: #1B1B1B; padding: 16px; border-radius: 6px; margin: 20px 0; border: 1px dashed #444;">
      <p style="color: #aaa; margin: 0 0 8px 0; font-size: 14px;">Note from our team:</p>
      <p style="color: #fff; margin: 0; font-style: italic;">"${notes}"</p>
    </div>
    ` : ''}
    <p>Warm regards,<br/>The Riko's Team</p>
  `)
  await sendBrevoEmail(to, subjectMap[status], html)
}

export async function sendNewsletterWelcome(to: string, name?: string): Promise<void> {
  const html = baseHtml(`
    <p>Hello ${name ? name : 'there'},</p>
    <h2 style="color: #fff; font-size: 20px; border-left: 4px solid #C9A227; padding-left: 12px;">Welcome to Riko's Cafe!</h2>
    <p>Thank you for subscribing to our newsletter! You're now on the VIP list.</p>
    <div style="background: #2A2A2A; padding: 24px; border-radius: 8px; margin: 24px 0; text-align: center;">
      <p style="color: #C9A227; font-size: 18px; margin-top: 0;">Be the first to know about:</p>
      <ul style="list-style-type: none; padding: 0; color: #E5E5E5; line-height: 2;">
        <li>✨ Exclusive Special Offers</li>
        <li>🍽️ New Menu Additions</li>
        <li>🎉 Upcoming Events & Nights</li>
      </ul>
    </div>
    <p>We can't wait to see you at the cafe soon!</p>
    <p>Warm regards,<br/>The Riko's Team</p>
  `)
  await sendBrevoEmail(to, "Welcome to Riko's Cafe Newsletter", html)
}

export async function sendPasswordReset(to: string, name: string, resetUrl: string): Promise<void> {
  const html = baseHtml(`
    <p>Hi ${name},</p>
    <p>We received a request to reset your admin password. Click the secure button below to set a new password:</p>
    <div style="text-align: center; margin: 32px 0;">
      <a href="${resetUrl}" style="background-color: #C9A227; color: #000; padding: 14px 28px; border-radius: 8px; font-weight: bold; text-decoration: none; display: inline-block;">Reset Password</a>
    </div>
    <p style="color: #888; font-size: 14px;">If you didn't request this, you can safely ignore this email. Your password will remain unchanged.</p>
  `)
  await sendBrevoEmail(to, "Password Reset Request", html)
}
