const router = require("express").Router();
const Message = require('../models/message-model');
const Plan = require("../models/plan-model");
const SubSchema = require('../models/subscription-model');
const User = require('../models/user-model');

router.get("/getprofile",async(req,res)=>{
    try{
        const {id}=req.query;
        let user1={};
      User.findOne({_id:id}).then(user=>{
        
        Message.find({userId:req.query.id}).then((chats)=> {
          Plan.findOne({_id:user.planId}).then(plan=>{
            res.json({user,plan,chats});
          }) 
            
          })
      })
    }
    catch(e){
        res.status(400).json({e});
    }
})


module.exports=router;