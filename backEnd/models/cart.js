const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true
  },
  quantity: {
    type: Number,
    required: [true, "book quantity is required"]
  },
  price: {
    type: Number,
    required: [true, "book price is required"],
    min: [0, "price can't be less than zero"]
  }
}, { timestamps: true });

const CartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  items: [ItemSchema],
  totalQuantity: {
    type: Number,
  
  },
  totalPrice: {
    type: Number,
    required: [true, "total price is required"],
    min: [0, "price can't be less than zero"]
  }
}, { timestamps: true });

module.exports = mongoose.model("Cart", CartSchema);
