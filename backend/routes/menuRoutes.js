const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

// Menu routes
router.get('/:id', menuController.getMenuByRestaurantId);

module.exports = router; 