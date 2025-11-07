import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// GET user cart
export const getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    res.json(cart || { items: [] });
  } catch (error) {
    next(error);
  }
};

// POST add/update item
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    if (!productId || !quantity || quantity <= 0) return res.status(400).json({ message: 'Invalid product or quantity' });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = new Cart({ user: req.user._id, items: [] });

    const itemIndex = cart.items.findIndex(item => item.product.equals(productId));
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = (cart.items[itemIndex].quantity || 0) + Number(quantity);
    } else {
      cart.items.push({ product: productId, quantity: Number(quantity) });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

// PUT update quantity
export const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    if (!productId || quantity == null || quantity < 0) return res.status(400).json({ message: 'Invalid product or quantity' });

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.items.find(item => item.product.equals(productId));
    if (!item) return res.status(404).json({ message: 'Item not found in cart' });

    item.quantity = Number(quantity);
    await cart.save();
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

// DELETE remove item
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ message: 'Invalid productId' });

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(item => !item.product.equals(productId));
    await cart.save();
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

// DELETE clear cart
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = [];
    await cart.save();
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    next(error);
  }
};
