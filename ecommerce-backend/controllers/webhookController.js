import Stripe from 'stripe';
import Order from '../models/Order.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

const webhookHandler = async (req, res) => {
  const signature = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    if (webhookSecret) {
      // stripe.webhooks.constructEvent requires the raw body (string or Buffer).
      // If a body parser already parsed the JSON into an object, recreate the raw string.
      let rawBody = req.body;
      if (rawBody && typeof rawBody === 'object' && !(rawBody instanceof Buffer)) {
        rawBody = Buffer.from(JSON.stringify(req.body));
      }
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } else {
      // If webhook secret not set (dev), try to parse body
      event = req.body;
    }
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
    const session = event.data.object;
    const metadata = session.metadata || {};
    const orderId = metadata.orderId;

    try {
      let order;
      if (orderId) {
        order = await Order.findById(orderId);
      }

      if (!order) {
        // fallback: try to find by stripeSessionId
        order = await Order.findOne({ stripeSessionId: session.id });
      }

      if (order) {
        order.isPaid = true;
        order.paidAt = new Date();
        // Decrement stock for each item (if possible)
        try {
          for (const it of order.items) {
            const Product = (await import('../models/Product.js')).default;
            const prod = await Product.findById(it.product);
            if (prod) {
              prod.countInStock = Math.max(0, (prod.countInStock || 0) - (it.quantity || 0));
              await prod.save();
            }
          }
        } catch (err) {
          console.error('Error decrementing stock after payment:', err);
        }

        await order.save();
        console.log(`Order ${order._id} marked as paid via webhook.`);
      } else {
        console.warn('Order not found for session:', session.id);
      }
    } catch (err) {
      console.error('Error processing webhook for session:', err);
      return res.status(500).send();
    }
  }

  res.status(200).json({ received: true });
};

export default webhookHandler;
