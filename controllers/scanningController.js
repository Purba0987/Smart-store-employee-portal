const Product = require('../models/Product.js');

class ScanningController {
  // Store scanned product details
  static addScannedProduct = async (req, res) => {
    try {
      const { name, price, quantity } = req.body;

      if (!name || price == null || quantity == null) {
        return res.status(400).json({ status: 'failed', message: 'All fields are required' });
      }

      const product = new ScannedProduct({ name, price, quantity });
      await product.save();

      res.status(201).json({ status: 'success', data: product, message: 'Product stored successfully' });

    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'failed', message: 'Server error' });
    }
  };

  // Optional: get all scanned products
  static getScannedProducts = async (_req, res) => {
    try {
      const products = await ScannedProduct.find().sort({ scannedAt: -1 });
      res.status(200).json({ status: 'success', data: products });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'failed', message: 'Server error' });
    }
  };
}

module.exports = scanningController;
