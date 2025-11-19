//router
const express = require("express");
const Router = express.Router();

//book model
const Book = require("../models/book");
const upload = require("../servises/uploude-servise.js")
// CREATE BOOK
Router.post("/", upload.single("coverImage"), async (req, res) => {
  try {
    const {
      title,
      author,
      description,
      price,
      stock,
      isFeatured,
      isOnSale,
      discountPercentage,
      category,
      
    } = req.body;

    // Validate required fields
    if (!(title && author && description && price && category)) {
      return res.status(400).json({
        success: false,
        message: "Enter valid criteria",
        error:
          "title or author or description or price or category is missing",
      });
    }

    // Create book
    const book = await Book.create({
      title,
      author,
      description,
      price,
      stock,
      isFeatured,
      isOnSale,
      discountPercentage,
      category,
       coverImage: req.file.filename
    });

    return res.status(201).json({
      success: true,
      message: "Book added successfully",
      book: book,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to add new book",
      error: error.message,
    });
  }
});

// UPDATE BOOK
Router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Check if book exists
    const existBook = await Book.findById(id);
    if (!existBook) {
      return res.status(404).json({
        success: false,
        message: "Book doesn't exist",
      });
    }

    // Update book
    const updatedBook = await Book.findByIdAndUpdate(id, req.body, {
      new: true, // return updated document
    });

    return res.status(200).json({
      success: true,
      message: "Book updated successfully",
      book: updatedBook,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update book",
      error: error.message,
    });
  }
});

// GET all books with pagination and optional filter
Router.get("/", async (req, res) => {
  try {
    let { page = 1, count = 10, filter } = req.query;

    page = parseInt(page);
    count = parseInt(count);

    // Build query object
    const query = filter ? { title: { $regex: filter, $options: "i" } } : {};

    const books = await Book.find(query)
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

    const book = await Book.findById(id);

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
