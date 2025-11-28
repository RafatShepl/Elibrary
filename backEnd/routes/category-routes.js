const express = require("express");
const Router = express.Router();
const Category = require("../models/category");

// ADD new category
Router.post("/", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    // Check if category exists
    const existCategory = await Category.findOne({ name });
    if (existCategory) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    const category = await Category.create({ name });

    res.status(201).json({
      success: true,
      message: "Category added successfully",
      category,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to add category",
      error: err.message,
    });
  }
});

// UPDATE category
Router.put("/:id", async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    if (!updatedCategory)
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to update category",
      error: err.message,
    });
  }
});

// GET all categories
Router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();

    res.status(200).json({
      success: true,
      message: "Fetched categories successfully",
      data: categories,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error: err.message,
    });
  }
});

// GET category by ID
Router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category)
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });

    res.status(200).json({
      success: true,
      message: "Fetched category successfully",
      data: category,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch category",
      error: err.message,
    });
  }
});

module.exports = Router;
