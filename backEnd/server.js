// use dot env
require("dotenv").config()
//express 
const express = require("express")
//cors
const cors = require("cors")
//data base 
const ConnectDb = require("./Data/db.js")

const app = express()


app.use(cors())
app.use(express.json())

ConnectDb()

//  routers
app.use('/auth',require('./routes/auth-routes.js'))
app.use('/book',require('./routes/book-routes.js'))
app.use('/category',require('./routes/category-routes.js'))

const PORT = process.env.PORT || 3000
app.listen(PORT,()=>console.log(`server now running in Port ${PORT}`))