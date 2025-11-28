//router
const express = require("express");
const Router = express.Router();

//bcrypt
const bcrypt = require("bcrypt");

//jsonwebtoken
const jwt = require("jsonwebtoken");

//user model
const User = require("../models/user");
const user = require("../models/user");

// REGISTER USER
Router.post("/register", async (req, res) => {
  try {
    const { username, email, password, role = "user" } = req.body;

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

    const redirectpath = role == 'admin' ? "/admin" : '/'


    // Create token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role },
      process.env.SECRTKEY,
      { expiresIn: "1w" }
    );
    res.cookie("token", token, {
      httpOnly: true,
    secure: process.env.NODE_ENV === "production",
       sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000 // أسبوع
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: newUser,
      redirectpath: redirectpath,
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
    const redirectpath = existUser.role === 'admin' ? "/admin" : '/'

    // Create token
    const token = jwt.sign(
      { id: existUser._id, email: existUser.email, role: existUser.role },
      process.env.SECRTKEY,
      { expiresIn: "1w" }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
       sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000 // أسبوع
    });
    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: existUser,
      redirectpath: redirectpath,
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
Router.get("/verify", async (req, res) => {
  try {

    const token = req.cookies?.token;

    // No token provided
    if (!token) {
      return res.status(401).json({ message: "No token provided", success: false });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRTKEY);
     
    } catch {

      return res.status(401).json({ message: "Invalid or expired token", success: false });
    }

    const existUser = await User.findById(decoded.id).select("username email role");

    if (!existUser) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    // Success
    return res.status(200).json({
      message: "User is authenticated",
      success: true,
      user: {
        id: existUser._id,
        username: existUser.username,
        email: existUser.email,
        role: existUser.role,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
});
Router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
   secure: process.env.NODE_ENV === "production",
     sameSite: "lax",  // required when using React frontend
    path: "/",         // MUST match cookie path
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully"
  });
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
