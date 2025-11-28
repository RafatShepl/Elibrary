//router
const express = require("express");
const Router = express.Router();

//book model
const Book = require("../models/book");




// GET all books with pagination and optional filter
Router.get("/", async (req, res) => {
  try {
    let { page = 1, count = 10, title,author, categoryId = '', isFuture = false, price } = req.query;

    page = parseInt(page);
    count = parseInt(count);

    // Build query object
    const query = {};

    if (title) query["title"] = { $regex: title, $options: "i" };
    if (author) query["author"] = { $regex: author, $options: "i" };
    if (categoryId) query["category"] = categoryId;
    if (isFuture) query["isFeatured"] = isFuture;

    // Price filter
if(price){
  query["price"]={ $gt:price}
}


    const books = await Book.find(query)
      .populate("category", "name")
      .skip((page - 1) * count)
      .limit(count);

    const total = await Book.countDocuments(query);

    return res.status(200).json({
      success: true,
      message: "Fetched books successfully",
      pagination: {
        data: books,
        page: page,
        count: count,
        totalPages: Math.ceil(total / count),
        totalItems: total,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch books",
      error: error.message,
    });
  }
});


// GET book by ID
Router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findById(id).populate("category","name");

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Fetched book successfully",
      data: book,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch book",
      error: error.message,
    });
  }
});

module.exports = Router;
