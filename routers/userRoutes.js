const express = require('express');
const router = express.Router();
const User = require('../models/userModels');

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


    
   }
   catch(err){
       console.error(err);
       res.status(500).send();
   }
});

module.exports = router;