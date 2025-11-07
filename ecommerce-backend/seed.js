import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

// Safe seed: only create a default admin if it doesn't exist.
const ensureAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const existing = await User.findOne({ email: 'admin@example.com' });
    if (existing) {
      console.log('Admin already exists:', existing.email);
      process.exit(0);
    }
    const admin = await User.create({ firstName: 'Admin', lastName: 'User', email: 'admin@example.com', password: 'password', role: 'admin', phoneNumber: '0000000000' });
    console.log('Created admin:', admin.email);
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

ensureAdmin();
