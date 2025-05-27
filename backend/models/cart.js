// the-foodies-hub/models/cart.js
const mongoose = require("mongoose");
// const restaurant = require("./restaurant"); // Only if used within this file directly
// const { json } = require("express"); // Not needed here

const cartSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    restaurantName: { type: String, required: true },
    restaurantLocation: { type: String, required: true },
    deliveryAddress:{
        id:{type:String,required:true},
        name:{type:String,required:true},
        address:{type:String,required:true},
        deliveryTime:{type:String,required:true}
    },
    items:[
        {
            menuItemId:{type:String,required:true},
            name:{type:String,required:true},
            price:{type:Number,required:true},
            quantity:{type:Number,required:true}
        }
    ],
    totalAmount:{type:Number,required:true},
    orderDate:{type:String,required:true},
    status:{type:String,required:true}
});

module.exports=mongoose.model('cart',cartSchema)