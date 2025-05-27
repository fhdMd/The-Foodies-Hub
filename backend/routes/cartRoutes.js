// the-foodies-hub/routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Route for creating a new order (this is where your "click to pay" should post)
router.post('/', cartController.createOrder); // This route will be /cart

// Route to get order history for a specific user
router.get('/:userId', cartController.getOrderHistory); // This route will be /cart/history/:userId

module.exports = router;