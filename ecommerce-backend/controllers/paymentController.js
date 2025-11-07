import Stripe from 'stripe';
import Order from '../models/Order.js';

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('STRIPE_SECRET_KEY is not set. Payment endpoints will fail until configured.');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

export const createCheckoutSession = async (req, res, next) => {
  try {
    const { cartItems, shippingAddress } = req.body;
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Create a pending order server-side and link it to the Stripe session via metadata
    const itemsForOrder = cartItems.map(i => ({ product: i.productId || i._id || i.id, quantity: i.quantity, price: i.price }));
    const totalPrice = cartItems.reduce((sum, it) => sum + (Number(it.price) || 0) * (Number(it.quantity) || 0), 0);

    const order = new Order({
      user: req.user._id,
      items: itemsForOrder,
      shippingAddress: shippingAddress || {},
      totalPrice,
    });

    await order.save();

    const line_items = cartItems.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name || 'Product',
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round(Number(item.price) * 100) || 0,
      },
      quantity: Number(item.quantity) || 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel',
      metadata: { orderId: order._id.toString() },
    });

    // store session id on order for future reference
    order.stripeSessionId = session.id;
    await order.save();

    res.json({ url: session.url });
  } catch (error) {
    next(error);
  }
};
