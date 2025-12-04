// server/ai/expiryPredictor.js

/**
 * Predict expiry risk level of a product based on expiry date
 * @param {Object} product - Product object with expiryDate property (ISO string or Date)
 * @returns {Object} - Object containing risk level and days to expiry
 */
function predictExpiryRisk(product) {
  const today = new Date();
  const expiry = new Date(product.expiryDate);
  const diffTime = expiry - today;
  const daysToExpiry = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // difference in days

  let risk = 'low'; // default risk

  if (daysToExpiry <= 2) risk = 'high';
  else if (daysToExpiry <= 7) risk = 'medium';

  return { risk, daysToExpiry };
}

module.exports = predictExpiryRisk;
