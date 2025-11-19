// mongoose 
const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "book title is required"],
      maxlength: 50,
    },
    author: {
      type: String,
      required: [true, "book author is required"],
      maxlength: 20,
    },
    description: {
      type: String,
      required: [true, "book description is required"],
    },
    price: {
      type: Number,
      required: [true, "book price is required"],
    },
    stock: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isOnSale: {
      type: Boolean,
      default: true,
    },
    discountPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    coverImage:{
        type:String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", BookSchema);
