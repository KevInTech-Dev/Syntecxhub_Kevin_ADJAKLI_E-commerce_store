import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export const register = async (req, res) => {
  const { firstName, lastName, email, password, phoneNumber, address } = req.body;
  try {
    if (!firstName || !lastName || !email || !password || !phoneNumber) {
      return res.status(400).json({ message: 'Required fields are missing' });
    }
    
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ 
      firstName, 
      lastName, 
      email, 
      password, 
      phoneNumber, 
      address 
    });
    
    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      token: generateToken(user),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log('Tentative de connexion pour:', email);
    
    if (!email || !password) {
      console.log('Email ou mot de passe manquant');
      return res.status(400).json({ message: 'L\'email et le mot de passe sont requis' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    console.log('Utilisateur trouvé:', user ? 'Oui' : 'Non');
    
    if (!user) {
      console.log('Aucun utilisateur trouvé avec cet email');
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    console.log('Vérification du mot de passe pour:', user.email);
    const isPasswordValid = await user.matchPassword(password);
    console.log('Mot de passe valide:', isPasswordValid ? 'Oui' : 'Non');
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      token: generateToken(user),
    });
  } catch (error) {
    console.error('Erreur de connexion:', error);
    res.status(500).json({ message: 'Une erreur est survenue lors de la connexion' });
  }
};
