import User from '../models/User.js';

// GET /api/users - admin only
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/users/admin - admin only -> create a new admin user
export const createAdmin = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phoneNumber } = req.body;
    if (!firstName || !lastName || !email || !password || !phoneNumber) {
      return res.status(400).json({ message: 'Required fields are missing' });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ firstName, lastName, email, password, phoneNumber, role: 'admin' });
    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/users/:id/promote - admin only -> promote existing user to admin
export const promoteToAdmin = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role = 'admin';
    await user.save();

    res.json({ message: 'User promoted to admin' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
