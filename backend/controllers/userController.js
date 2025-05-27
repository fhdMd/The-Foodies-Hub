const mongoose = require('mongoose');
const User = require('../models/user'); // Assuming your User model is defined here
// const bcrypt = require('bcrypt'); // Uncomment and install if you implement password hashing

const userController = {

    login: async (req, res) => {
        try {
            const user = await User.findOne({ email: req.body.email });
            if (!user) {
                return res.status(400).json({ message: "Email doesn't exist" });
            }
            
            // In a real application, you should hash and compare passwords securely (e.g., bcrypt)
            // const isMatch = await bcrypt.compare(req.body.password, user.password);
            // if (!isMatch) {
            //     return res.status(400).json({ message: "Wrong Password" });
            // }

            // For now, using direct password comparison (NOT secure for production)
            if (user.password === req.body.password) {
                return res.status(200).json({
                    _id: user._id, // ADDED: Include the user's MongoDB _id
                    email: user.email,
                    redirectUrl: '/restaurant'
                });
            } else {
                return res.status(400).json({ message: "Wrong Password" });
            }
        } catch (error) {
            console.error("Error during login:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    },

    signup: async (req, res) => {
        try {
            if (req.body.confirmPassword !== req.body.password) {
                return res.status(400).json({ message: "Passwords don't match" });
            }

            const existingUser = await User.findOne({ email: req.body.email });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }

            // In a real application, hash the password before saving (e.g., bcrypt)
            // const hashedPassword = await bcrypt.hash(req.body.password, 10); // 10 is the salt rounds

            const user = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password, // IMPORTANT: Replace with hashedPassword in production
            });

            await user.save();
            return res.status(200).json({
                _id: user._id, // ADDED: Include the newly created user's _id
                email: user.email,
                redirectUrl: '/restaurant'
            });
        } catch (error) {
            console.error("Error during signup:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    },

    // --- findByEmail function (no changes needed for this specific issue) ---
    findByEmail: async (req, res) => {
        try {
            const userEmail = req.params.email; 
            const user = await User.findOne({ email: userEmail });

            if (!user) {
                return res.status(404).json({ message: "User not found." });
            }

            return res.status(200).json({
                name: user.name,
                email: user.email,
                phone: user.phone || '',
                address: user.address || '',
                bio: user.bio || ''
            });

        } catch (error) {
            console.error("Error fetching user by email:", error);
            return res.status(500).json({ message: "Internal server error." });
        }
    },

    // --- updateProfile function (no changes needed for this specific issue) ---
    updateProfile: async (req, res) => {
        try {
            const { email, name, phone, address, bio } = req.body; 

            const user = await User.findOneAndUpdate(
                { email: email },
                { name, phone, address, bio },
                { new: true, runValidators: true }
            );

            if (!user) {
                return res.status(404).json({ message: "User not found." });
            }

            return res.status(200).json({
                name: user.name,
                email: user.email,
                phone: user.phone || '',
                address: user.address || '',
                bio: user.bio || ''
            });

        } catch (error) {
            console.error("Error updating user profile:", error);
            if (error.name === 'ValidationError') {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: "Internal server error." });
        }
    }
};

module.exports = userController;