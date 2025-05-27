// the-foodies-hub/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import routes
const userRoutes = require('./routes/userRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const menuRoutes = require('./routes/menuRoutes');
const cartRoutes = require('./routes/cartRoutes');

const app = express();

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/TheFoodiesHub')
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// IMPORTANT: Require your Order model here so Mongoose knows about it
require('./models/order');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

// Routes
app.get('/', (req, res) => {
    res.send("Hello from API");
});

app.use('/user', userRoutes);
app.use('/restaurant', restaurantRoutes);
app.use('/menu', menuRoutes);
app.use('/cart', cartRoutes); // All routes defined in cartRoutes will be prefixed with /cart

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});