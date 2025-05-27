// the-foodies-hub/controllers/cartController.js
// Removed: const Cart = require('../models/cart'); // If you had a separate Cart model for temporary items, keep it, but this controller won't use it for finished orders.
const Order = require('../models/order'); // IMPORTANT: Now using the Order model

const cartController = {
    // This function handles the "click to pay" action, saving it as a completed order.
    createOrder: async (req, res) => {
        try {
            const { userId, restaurantName, restaurantLocation, deliveryAddress, paymentMethod, items, totalAmount, orderDate, status } = req.body;

            // Basic validation for required fields
            if (!userId || !restaurantName || !deliveryAddress || !items || !totalAmount) {
                return res.status(400).json({ message: "Missing required order details." });
            }

            // Create a new Order instance
            const newOrder = new Order({
                userId,
                restaurantName,
                restaurantLocation,
                deliveryAddress,
                paymentMethod,
                items,
                totalAmount,
                orderDate: orderDate || new Date().toISOString(), // Use provided date or current
                status: status || 'Pending', // Use provided status or default to Pending
            });

            // Save the new order to the 'orders' collection
            const savedOrder = await newOrder.save();

            res.status(201).json({
                message: 'Order placed successfully',
                order: savedOrder // Changed from 'cart' to 'order' for clarity
            });

        } catch (error) {
            console.error('Error creating order:', error);
            if (error.name === 'ValidationError') {
                return res.status(400).json({ message: error.message, details: error.errors });
            }
            res.status(500).json({
                message: 'Failed to place order',
                error: error.message
            });
        }
    },

    // Function to get order history for a specific user
    getOrderHistory: async (req, res) => {
        try {
            const { userId } = req.params; // Get userId from URL parameters

            if (!userId) {
                return res.status(400).json({ message: "User ID is required." });
            }

            // Find all orders for the given userId, sorted by most recent orderDate
            const orders = await Order.find({ userId: userId }).sort({ orderDate: -1 });

            // Return an empty array if no orders are found, or the list of orders
            res.status(200).json(orders);

        } catch (error) {
            console.error('Error fetching order history:', error);
            res.status(500).json({
                message: 'Failed to fetch order history',
                error: error.message
            });
        }
    }
};

module.exports = cartController;