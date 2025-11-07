import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const user = await User.findOne({ email: 'admin@example.com' });
    const product = await Product.findOne();
    if (!user || !product) {
      console.error('Missing user or product. Make sure seed ran.');
      process.exit(1);
    }

    const order = new Order({
      user: user._id,
      items: [{ product: product._id, quantity: 1, price: product.price }],
      shippingAddress: { address: 'Test St', city: 'Testville', postalCode: '00000', country: 'Testland' },
      totalPrice: product.price,
    });

    await order.save();
    console.log('Created test order id:', order._id.toString());
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
