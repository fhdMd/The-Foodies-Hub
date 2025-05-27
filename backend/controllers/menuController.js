const Menu = require('../models/menu');

const menuController = {
    getMenuByRestaurantId: async (req, res) => {
        try {
            const restaurantId = req.params.id;
            
            // Validate if the ID is a valid number
            if (!restaurantId || isNaN(restaurantId)) {
                return res.status(400).json({ message: "Invalid restaurant ID" });
            }

            const items = await Menu.find({ rId: parseInt(restaurantId) });
            
            if (!items || items.length === 0) {
                return res.status(404).json({ message: "No menu items found for this restaurant" });
            }
            return res.status(200).json(items);
        } catch (error) {
            console.error("Error fetching menu items:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
};

module.exports = menuController; 