// use dot env
require("dotenv").config()
//express 
const express = require("express")
//cors
const cors = require("cors")
//cookie parser
const cookieParser = require("cookie-parser")
//data base 
const ConnectDb = require("./Data/db.js")

const app = express()


app.use(cors({
    origin: "http://localhost:5173",   // your React URL
    credentials: true,                 // REQUIRED for cookies
  }))
 
app.use(express.json())

app.use(cookieParser())

app.use("/public",express.static("public"))
ConnectDb()

//  routers
app.use('/auth',require('./routes/auth-routes.js'))
app.use('/book',require('./routes/book-routes.js'))
app.use('/admin/book',require('./routes/admin/admin-routes.js'))
app.use('/category',require('./routes/category-routes.js'))
app.use('/cart',require('./routes/cart-routes.js'))

const PORT = process.env.PORT || 3000
app.listen(PORT,()=>console.log(`server now running in Port ${PORT}`))