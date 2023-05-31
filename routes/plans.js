// This is your test secret API key.
const stripe = require('stripe')("sk_test_51N9lmKHIBvxG8JCLXtUfYtTSazYZeYL4zqe9mCjS2CrnDwy6hYfaBRCboF6ytzFjMKU7x3M1E47cnazNrCKFoxa000iSR3RbTI");
const router = require("express").Router();
const SubSchema = require('../models/subscription-model');
const Message = require('../models/message-model');
const User = require('../models/user-model');
const Plan = require('../models/plan-model');
const Intent = require('../models/payment-intent');

router.get("/getplans",async(req,res)=>{
    Plan.find({}).then(results=>{
        res.send(results);
    }).catch(err=>res.status(400).json({err}));
});
router.get("/getplan",async(req,res)=>{
    const {id}=req.query;
    Plan.findOne({_id:id}).then(results=>{
        res.send(results);
    }).catch(err=>res.status(400).json({err}));
});
router.post("/createplan",async(req,res)=>{
    try{
    const {name,description,price,chatApi}=req.body;
    new Plan({
        name,description,price,chatApi
    }).save().then((newPlan) => {
        console.log('created new Plan: ', newPlan);
     res.send(newPlan);
    });
}
catch(err){res.status(400).json({err})};
});

module.exports=router;