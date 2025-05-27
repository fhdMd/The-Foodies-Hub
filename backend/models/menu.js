const { default: mongoose } = require("mongoose");

const menuSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    rating: { type: Number, required: true },
    desc: { type: String, required: true },
    rId: { type: Number, required: true }
});

module.exports=mongoose.model('menu',menuSchema)