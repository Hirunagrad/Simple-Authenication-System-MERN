const express = require("express");
const router = express.Router();
const Customer = require("../models/costormerModel");


router.post("/", async(req,res) =>{
  
    try{
     
        const {name} = req.body;

        const newCustomer = new Customer({
            name
        });

        const existingCustomer = await Customer.find({name});
        if(existingCustomer){
            return res.status(400).json({errorMessage: "A Customer with this already exists"});
        }

        const savedCustomer = await newCustomer.save();
        res.json(savedCustomer._id);

       


    }catch(err){
       console.error(err);
       res.status(500).send();
   }
 
});

router.get("/", async(req,res) => {

    try{
     
       const customers = await Customer.find();
       res.json(customers);


    }catch(err){
       console.error(err);
       res.status(500).send();
   }

})

module.exports = router;
