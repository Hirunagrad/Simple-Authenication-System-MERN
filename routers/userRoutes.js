const express = require('express');
const router = express.Router();
const User = require('../models/userModels');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post("/" ,async(req,res) => {
  // res.send("test");
  //console.log(req.body);
  //console.log(email);
   
   try{
    const { email,password,passwordVerify } = req.body;
    if(!email || !password || !passwordVerify){
        return res.status(400).json({errorMessage: "please enter all required fields"});
    }

    if(password.length < 6){
        return res.status(400).json({errorMessage: "please enter a password of at least 6 characters"});
    }

    if(password !== passwordVerify){
        return res.status(400).json({errorMessage: "please enter the same password twise"});
    }


    const existingUser = await User.findOne({ email });
    if(existingUser){
        return res.status(400).json({errorMessage: "An account with this already exists"});
    }

    //hash the password
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    //save a new user account to the db
    const newUser = new User({
         
        email, passwordHash

    });

    const savedUser = await newUser.save();

    //sign the token***
    const token = jwt.sign({
        user: savedUser._id
    },process.env.JWT_SECRET);

   // console.log(token);
   //console.log(passwordHash);
    
   //send the token in a HTTP-only cookie
   res.cookie("token", token, {
      httpOnly: true
   }).send();
    
   }
   catch(err){
       console.error(err);
       res.status(500).send();
   }

});

router.post("/login", async(req,res) => {
 
   try{
    
      const {email,password} = req.body;

      //validate
      if(!email || !password){
        return res.status(400).json({errorMessage: "please enter all required fields"});
       }

       const existingUser = await User.findOne({ email });
       if(!existingUser){
        return res.status(401).json({errorMessage: "wrong email and password"});
       } 

       const passwordCorrect = await bcrypt.compare(password, existingUser.passwordHash);
       if(!passwordCorrect){
        return res.status(401).json({errorMessage: "wrong email and password"});
       }
       
       const token = jwt.sign({
        user: existingUser._id
    },process.env.JWT_SECRET);

   // console.log(token);
   //console.log(passwordHash);
    
   //send the token in a HTTP-only cookie
   res.cookie("token", token, {
      httpOnly: true
   }).send();




   }catch(err){
        console.error(err);
        res.status(500).send();
   }

});


module.exports = router;