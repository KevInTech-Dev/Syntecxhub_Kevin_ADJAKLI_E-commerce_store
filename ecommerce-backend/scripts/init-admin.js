import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const initializeAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'komlankevina@gmail.com' });
    if (existingAdmin) {
      console.log('Admin account already exists');
      process.exit(0);
    }

    // Create admin user
      const hashedPassword = await bcrypt.hash('Kevin19072@@5', 10);
    const adminUser = new User({
      firstName: 'Komlan Kévin',
      lastName: 'ADJAKLI',
      email: 'komlankevina@gmail.com',
      password: hashedPassword,
      phoneNumber: '+228 96 79 60 72',
      role: 'admin'
    });

    await adminUser.save();
    console.log('Admin account created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin account:', error);
    process.exit(1);
  }
};

initializeAdmin();