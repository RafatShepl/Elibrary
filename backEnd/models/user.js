// mongoose 
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "the email is required"],
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "please enter a valid email"
      ]
    },
    username: {
      type: String,
      required: [true, "the username is required"],
      maxlength: 50
    },
    password: {
      type: String,
      required: [true, "the password is required"],
      minlength: 6
    },
    role:{
      type:String,
      enum:["user","admin"],
      default:"user"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", UserSchema);
