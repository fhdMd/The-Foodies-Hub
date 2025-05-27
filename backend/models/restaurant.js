const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    img: { type: String, required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    type: { type: String, required: true },
    location: { type: String, required: true },
    time: { type: String },
    id: { type: Number, required: true }
});

// Ensure the model name matches the collection name in MongoDB
module.exports = mongoose.model('restaurants', restaurantSchema);