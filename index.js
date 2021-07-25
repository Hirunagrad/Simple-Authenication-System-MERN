const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

//set up server
const app = express();
const PORT = process.env.PORT || 5000;
//const PORT = 5000;
app.listen(PORT , ()=>{
    console.log(`server is up and running PORT ${PORT}`);
});
app.get("/test", (req,res)=>{
    res.send("test is sucsessfull");
});

app.use(express.json());



//mongoDB Connect 

try{
    mongoose.connect(process.env.MDB_CONNECT, {

        useUnifiedTopology: true,
        useNewUrlParser: true,
        //useCreateIndex: true,
      
 });
    console.log("MongoDB Connected");
} catch{
    console.error(`Error: ${error.message}`);
};


//set the routes

app.use("/auth", require("./routers/userRoutes"));
