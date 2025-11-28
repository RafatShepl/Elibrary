

// mongoose 
const mongoose = require("mongoose")

const ConnectDb = async()=>{
    try{
        await mongoose.connect(`${process.env.MONGOOSEURI}`)
        console.log("connect to data base successfully")
    }catch(error){
        console.log(error.message)
    }
}

module.exports = ConnectDb;