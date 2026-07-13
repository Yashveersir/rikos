

async function run() {
  const apiKey = process.env.BREVO_API_KEY;
  console.log("Using API key:", apiKey);
  
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      sender: { name: "Riko's Cafe", email: "onboarding@resend.dev" },
      to: [{ email: "test@example.com" }],
      subject: "Test Email",
      htmlContent: "<p>Test</p>"
    })
  });
  
  console.log("Status:", res.status);
  const text = await res.text();
  console.log("Response:", text);
}
run();
