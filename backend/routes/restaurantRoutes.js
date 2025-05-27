const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');

// Restaurant routes
router.get('/', restaurantController.getAllRestaurants);
router.get('/:id', restaurantController.getRestaurantById);

module.exports = router; 