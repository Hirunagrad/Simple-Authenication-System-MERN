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

    //log user in
    const token = jwt.sign({
        user: savedUser._id
    },process.env.JWT_SECRET)

    console.log(token);
   //console.log(passwordHash);
    
   }
   catch(err){
       console.error(err);
       res.status(500).send();
   }
});

module.exports = router;