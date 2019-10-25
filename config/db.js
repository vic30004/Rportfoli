const mongoose = require('mongoose');

const connectDB = async ()=>{
   const conn= await mongoose.connect("mongodb+srv://victor123:password4321@portfolio-1ebcm.mongodb.net/portfolio?retryWrites=true&w=majority",{
       useNewUrlParser: true,
       useCreateIndex: true,
       useFindAndModify:false,
       useUnifiedTopology: true
   });
   console.log(`MongoDB connected: ${conn.connection.host}`.cyan.underline.bold)
}

module.exports= connectDB;