import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [orderItemSchema],
  shippingAddress: {
    address: String,
    city: String,
    postalCode: String,
    country: String,
  },
  totalPrice: { type: Number, required: true },
  // Optional Stripe session id to link orders to Stripe Checkout
  stripeSessionId: { type: String },
  isPaid: { type: Boolean, default: false },
  paidAt: { type: Date },
  isDelivered: { type: Boolean, default: false },
  deliveredAt: { type: Date },
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
