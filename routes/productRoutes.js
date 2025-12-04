const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const predictExpiryRisk = require('../server\ai/expiryPredictor');

router.post('/', async (req, res) => {
  try {
    const aiResult = predictExpiryRisk(req.body);

    const productData = {
      ...req.body,
      aiRisk: aiResult.risk,
      daysToExpiry: aiResult.daysToExpiry
    };

    const newProduct = new Product(productData);
    await newProduct.save();

    res.status(201).json(newProduct);
  } catch (err) {
    console.error('Error saving product:', err);
    res.status(400).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ addedAt: -1 });
    res.json(products);
  } catch (err) {
    console.error('Error retrieving products:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
