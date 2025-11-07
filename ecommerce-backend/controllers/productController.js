import Product from '../models/Product.js';

// GET all products
export const getProducts = async (req, res) => {
  try {
    const { search, category, sort } = req.query;
    const filter = {};
    if (search) {
      const re = new RegExp(search, 'i');
      filter.$or = [{ name: re }, { description: re }];
    }
    if (category) {
      filter.category = category;
    }

    let query = Product.find(filter);
    if (sort) {
      if (sort === 'price_asc') query = query.sort({ price: 1 });
      else if (sort === 'price_desc') query = query.sort({ price: -1 });
      else if (sort === 'newest') query = query.sort({ createdAt: -1 });
      else if (sort === 'oldest') query = query.sort({ createdAt: 1 });
    }

    const products = await query.exec();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET single product
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST create product (admin only)
export const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    const saved = await product.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT update product (admin only)
export const updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE product (admin only)
export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Upload product image (returns accessible URL)
export const uploadProductImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.status(201).json({ imageUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Image upload failed' });
  }
};
