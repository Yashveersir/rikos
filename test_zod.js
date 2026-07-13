fetch('http://localhost:8080/_server/?_serverFnId=submitReservation&_serverFnName=submitReservation', {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    data: {
      name: 'yash',
      email: 'invalid_email',
      phone: '8873394750',
      date: '2026-07-20',
      time: '19:00',
      guests: 2,
      occasion: 'CASUAL',
      specialRequests: ''
    }
  })
}).then(async r => {
  console.log(r.status);
  console.log(await r.text());
}).catch(console.error)
