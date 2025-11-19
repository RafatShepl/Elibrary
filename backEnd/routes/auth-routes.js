//router
const express = require("express");
const Router = express.Router();

//bcrypt
const bcrypt = require("bcrypt");

//jsonwebtoken
const jwt = require("jsonwebtoken");

//user model
const User = require("../models/user");

// REGISTER USER
Router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!(username && email && password)) {
      return res.status(400).json({
        success: false,
        message: "Enter valid criteria",
        error: "Username, email, or password is missing",
      });
    }

    // Check if user exists
    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password
    const hashPass = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      email,
      username,
      password: hashPass,
    });

    // Create token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.SECRTKEY,
      { expiresIn: "1w" }
    );

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: newUser,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to register user",
      error: error.message,
    });
  }
});

// LOGIN USER
Router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      return res.status(400).json({
        success: false,
        message: "Enter valid criteria",
        error: "Email or password is missing",
      });
    }

    const existUser = await User.findOne({ email });
    if (!existUser) {
      return res.status(400).json({
        success: false,
        message: "User does not exist",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, existUser.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Password is incorrect",
      });
    }

    // Create token
    const token = jwt.sign(
      { id: existUser._id, email: existUser.email },
      process.env.SECRTKEY,
      { expiresIn: "1w" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: existUser,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to login user",
      error: error.message,
    });
  }
});

// GET USER BY ID
Router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get user",
      error: error.message,
    });
  }
});

module.exports = Router;
