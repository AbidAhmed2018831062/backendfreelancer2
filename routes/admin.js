const router = require("express").Router();
const Message = require('../models/message-model');
const SubSchema = require('../models/subscription-model');
const User = require('../models/user-model');
const Plan = require('../models/plan-model');
const Payment = require('../models/payment-model');
const Admin = require('../models/admin-model');

const stripe = require('stripe')("sk_test_51N9lmKHIBvxG8JCLXtUfYtTSazYZeYL4zqe9mCjS2CrnDwy6hYfaBRCboF6ytzFjMKU7x3M1E47cnazNrCKFoxa000iSR3RbTI");

router.get('/transac',async(req,res)=>{
      let now = new Date();
      let month = now.getMonth();
    now.setMonth(month-1);
    let thisMonths=[];
    try{
       Payment.find({date:{$gte:now.getTime()}}).then(results=>{
        month++;
        now=new Date();
        let date=now.getDate();
        now.setDate(date-7);
    
        Payment.find({date:{$gte:now.getTime()}}).then(week=>{
          Payment.find({}).then(all=>{
            res.json({results,week,all});
          })
  
        })
       })
    }
    catch(e){
        res.status(400).json({e});
    }
})
router.get("/users",async(req,res)=>{
    try{
    User.find({}).then(users=>{
        res.send(users);
    })
}
catch(e){
    res.status(400).json({e});
}
});
router.get("/getplans",async(req,res)=>{
    Plan.find({}).then(results=>{
        res.send(results);
    }).catch(err=>res.status(400).json({err}));
});
router.get("/getplansubs",async(req,res)=>{
  let planCount=[];
  try{
  Plan.find({}).then(plans=>{
    Array.from(plans).forEach(plan=>{
      User.find({planId:plan._id}).then(count=>{
        planCount.push({name:plan.name,count:count.length})
      })
    });
    User.find({}).then(users=>{
      res.json({planCount,users:users.length});
    })
   
  })
}
catch(e){
  res.status(500).send("Internal Server Error");
}
})
router.post("/createplan",async(req,res)=>{
 const {des,
 title,
 price,
 chat,}=req.body;
  try{
  Plan.create({
    description:des,
 name:title,
 price,
 chatApi:chat,
  }).then(result=>res.send("Plan Created Successfully"));
}
catch(e){
  res.status(500).send("Internal Server Error");
}
});
router.post("/createadmin",async(req,res)=>{
  try{
    Admin.create({
      name: req.body.name,
      id: req.body.id,
      email:req.body.email,
     password:req.body.password
    }).then(result=>res.send(result))
  }catch(e){
    res.status(500).send(e);
  }
});
router.post("/login",async(req,res)=>{
  try{
  Admin.findOne({email:req.body.email,password:req.body.password}).then(result=>{
    if(result.length===0)
    res.status(400).send("No such email or password combination found");
    else res.send(result);
  })}catch(e){
    res.status(400).send("No such email or password combination found")
  }
})
module.exports=router;