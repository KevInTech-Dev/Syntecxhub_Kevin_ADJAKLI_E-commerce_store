import crypto from 'crypto';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const simulate = async (orderId) => {
  const url = 'http://localhost:5000/api/payment/webhook';
  const event = {
    id: `evt_${Date.now()}`,
    object: 'event',
    type: 'checkout.session.completed',
    data: {
      object: {
        id: `cs_${Date.now()}`,
        metadata: { orderId },
      },
    },
  };

  const payload = JSON.stringify(event);
  const timestamp = Math.floor(Date.now() / 1000);
  const signedPayload = `${timestamp}.${payload}`;
  const secret = process.env.STRIPE_WEBHOOK_SECRET || '';
  const hmac = crypto.createHmac('sha256', secret).update(signedPayload).digest('hex');
  const sigHeader = `t=${timestamp},v1=${hmac}`;

  console.log('Sending webhook to', url);
  console.log('Stripe-Signature:', sigHeader);

  const res = await fetch(url, { method: 'POST', body: payload, headers: { 'Content-Type': 'application/json', 'stripe-signature': sigHeader } });
  console.log('Response status:', res.status);
  const text = await res.text();
  console.log('Response body:', text);
};

const orderId = process.argv[2];
if (!orderId) {
  console.error('Usage: node simulate_webhook.js <orderId>');
  process.exit(1);
}

simulate(orderId).catch(err => { console.error(err); process.exit(1); });
