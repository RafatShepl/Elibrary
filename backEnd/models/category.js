// mongoose 
const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
           maxlength: 20
    }
},{timestamps:true})

module.exports = mongoose.model("Category",CategorySchema)