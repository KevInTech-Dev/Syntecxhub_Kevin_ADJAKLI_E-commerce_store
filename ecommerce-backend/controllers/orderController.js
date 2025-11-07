import Order from '../models/Order.js';
// POST create order
export const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, totalPrice } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const order = new Order({
      user: req.user._id,
      items,
      shippingAddress,
      totalPrice,
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    next(error);
  }
};

// GET user orders
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('items.product');
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// GET order by id (admin or owner)
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email').populate('items.product');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // only admin or owner can access
    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

// GET all orders (admin)
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate('user', 'name email');
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// PUT mark as paid
export const markAsPaid = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.isPaid = true;
    order.paidAt = Date.now();

    // decrement stock
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
      console.error('Error decrementing stock in markAsPaid:', err);
    }

    await order.save();
    res.json(order);
  } catch (error) {
    next(error);
  }
};

// PUT mark as delivered
export const markAsDelivered = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.isDelivered = true;
    order.deliveredAt = Date.now();
    await order.save();
    res.json(order);
  } catch (error) {
    next(error);
  }
};
