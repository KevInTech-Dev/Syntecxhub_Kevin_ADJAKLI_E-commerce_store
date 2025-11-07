import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import webhookHandler from './controllers/webhookController.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();

// Configure logging middleware first
app.use(morgan(':method :url :status :response-time ms - :res[content-length]'));

// Error logging
app.use((err, req, res, next) => {
  console.error('Error:', err);
  next(err);
});

// Serve uploaded images
const uploadsDir = path.join(process.cwd(), 'uploads');
app.use('/uploads', express.static(uploadsDir));

// Middleware (note: express.json is registered AFTER the webhook route so Stripe webhook can use raw body)
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Webhook route must be registered before express.json to receive raw body for signature verification
app.post('/api/payment/webhook', express.raw({ type: 'application/json' }), webhookHandler);

// Body parser for all other routes
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);

app.get('/', (req, res) => {
  res.send('E-commerce API is running...');
});

// 404 and error handler
app.use(notFound);
app.use(errorHandler);

export default app;
