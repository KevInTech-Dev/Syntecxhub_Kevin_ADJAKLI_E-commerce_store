// Load environment variables as early as possible so imported modules see them
import 'dotenv/config';
import mongoose from 'mongoose';
import app from './app.js';

// Connexion MongoDB and start server
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected');
  app.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT || 5000}`);
  });
})
.catch((err) => console.error('MongoDB connection error:', err));
