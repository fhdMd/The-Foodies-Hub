// controllers/restaurantController.js
const Restaurant = require('../models/restaurant');

const restaurantController = {
    getAllRestaurants: async (req, res) => {
        try {
            const { cuisineType } = req.query; // Extract cuisineType from query parameters

            let filter = {}; // Initialize an empty filter object

            // If cuisineType is provided, add it to the filter using regex for 'contains'
            if (cuisineType) {
                // Use $regex to match any restaurant whose 'type' field
                // contains the cuisineType string (case-insensitive)
                filter.type = { $regex: new RegExp(cuisineType, 'i') };
            }

            const restaurants = await Restaurant.find(filter); // Apply the filter
            return res.status(200).json(restaurants);
        } catch (error) {
            console.error("Error fetching restaurants:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    },

    getRestaurantById: async (req, res) => {
        // ... (rest of your getRestaurantById function remains unchanged)
        try {
            const restaurantId = req.params.id;

            if (!restaurantId || isNaN(restaurantId)) {
                return res.status(400).json({ message: "Invalid restaurant ID" });
            }

            const restaurant = await Restaurant.findOne({ id: parseInt(restaurantId) });

            if (!restaurant) {
                return res.status(404).json({ message: "Restaurant not found" });
            }

            return res.status(200).json(restaurant);
        } catch (error) {
            console.error("Error fetching restaurant:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
};

module.exports = restaurantController;