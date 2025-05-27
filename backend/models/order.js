// the-foodies-hub/models/Order.js
const mongoose = require('mongoose');

// Schema for individual items within an order
const orderItemSchema = new mongoose.Schema({
    menuItemId: { type: String, required: true }, // Changed to String to match frontend interface
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
});

// Schema for the delivery address within an order
const deliveryAddressSchema = new mongoose.Schema({
    id: { type: String }, // Optional, based on how you manage addresses
    name: { type: String, required: true },
    address: { type: String, required: true },
    deliveryTime: { type: String, required: true },
});

// Main Order Schema
const orderSchema = new mongoose.Schema({
    userId: {
        type: String, // Changed to String to match frontend interface (often passed as string from local storage)
        required: true,
    },
    restaurantName: { type: String, required: true },
    restaurantLocation: { type: String, required: true },
    deliveryAddress: { type: deliveryAddressSchema, required: true },
    paymentMethod: { type: String, required: true },
    items: [orderItemSchema], // Array of order items
    totalAmount: { type: Number, required: true },
    orderDate: { type: Date, default: Date.now },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Delivered', 'Cancelled'],
        default: 'Pending',
    },
}, { timestamps: true }); // Adds createdAt and updatedAt timestamps automatically

module.exports = mongoose.model('Order', orderSchema);