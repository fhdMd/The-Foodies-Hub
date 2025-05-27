const mongoose = require('mongoose'); 

const userSchema = new mongoose.Schema({
    name: { type: String, unique: false, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, unique: false, required: true }
});

module.exports=mongoose.model('users',userSchema)