const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import routes
const userRoutes = require('./routes/userRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const menuRoutes = require('./routes/menuRoutes');
const cartRoutes = require('./routes/cartRoutes');

// 1. Create the Express App FIRST
const app = express();

// 2. Apply ALL Middleware NEXT
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
}));

// 3. Define Routes
app.get('/', (req, res) => {
    res.send("Hello from API");
});

app.use('/user', userRoutes);
app.use('/restaurant', restaurantRoutes);
app.use('/menu', menuRoutes);
app.use('/cart', cartRoutes);

// 4. Connect to MongoDB and Start the Server LAST
const PORT = process.env.PORT || 8080;
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        // IMPORTANT: Start listening for requests only AFTER the database connection is successful
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        // If the database connection fails, exit the process to prevent the server from running in a broken state.
        process.exit(1);
    });
