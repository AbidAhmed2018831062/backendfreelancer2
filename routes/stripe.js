// This is your test secret API key.
const stripe = require('stripe')("sk_test_51N9lmKHIBvxG8JCLXtUfYtTSazYZeYL4zqe9mCjS2CrnDwy6hYfaBRCboF6ytzFjMKU7x3M1E47cnazNrCKFoxa000iSR3RbTI");
const router = require("express").Router();
const SubSchema = require('../models/subscription-model');
const Message = require('../models/message-model');
const User = require('../models/user-model');
const Plan = require('../models/plan-model');
const Intent = require('../models/payment-intent');
const Payment = require('../models/payment-model');


//One time payment
router.post('/pay', async (req, res) => {
  try{
  const {userId,id} = req.body;
  let hasPlan=false;
  let plan={}
  Plan.findOne({_id:id}).then(async(currentSub) => {
    if(currentSub){
hasPlan=true;
    plan =currentSub;
    const paymentIntent =  await stripe.paymentIntents.create({
      amount: plan.price,
      currency: 'usd',
      // Verify your integration in this guide by including this parameter
      metadata: {integration_check: 'accept_a_payment'},
      receipt_email: "ahmedabid3409@gmail.com",
    });
    new Intent({
      userId,
      planName:plan.name,
      price: plan.price,
      chatApi:plan.chatApi,
      intent:paymentIntent['id']
  }).save().then((newUser) => {
    res.json({'client_secret': paymentIntent['client_secret']});
  });
    } 
});

}catch(e)
{
  res.status(400).json({message:"An Error occured",e});
}
})


router.put("/updateuser",async(req,res)=>{
  try{
  const {planId,userId,payment_intent}=req.body;
  const paymentIntent = await stripe.paymentIntents.retrieve(
    payment_intent
  );
  User.find({_id:userId}).then(user=>{
    Payment.create({
      id: paymentIntent.id,
      user_name:user.displayName,
      amount_received: paymentIntent.amount_received,
      date:new Date().getTime().toString(),
      client_secret:paymentIntent.client_secret,
      payment_method:paymentIntent.payment_method
    });
  })
  console.log(planId);
  Plan.findOne({_id:planId}).then(result=>{
    User.updateOne({_id:userId},{
      chatApi:result.chatApi,
      planId
   }).then(result1=>{
    res.send({result1});
   })
  })
}
catch(e){
  res.status(400).json({e});
}
})




//Subscriptions
router.post('/sub', async (req, res) => {
  const {email, payment_method,priceId,planName,planId,userId} = req.body;
 try{
  let hasUser=false;
  let currentSub={};
  SubSchema.findOne({userId}).then((currentSub) => {
    if(currentSub){
     hasUser=true;
     currentSub=currentSub;
    } 
});
if(hasUser)
{
  const deleted = await stripe.subscriptions.del(
    currentSub.subscriptionId
  );
  SubSchema.deleteOne({subscriptionId:currentSub.subscriptionId})
}
  const customer = await stripe.customers.create({
    payment_method: payment_method,
    email: email,
    invoice_settings: {
      default_payment_method: payment_method,
    },
  });

  const subscription = await stripe.subscriptions.create({
    customer: customer.id,
    items: [{ price: "price_1N9mdMHIBvxG8JCLZjmZtWbq" }],
    expand: ['latest_invoice.payment_intent']
  });
  
  const status = subscription['latest_invoice']['payment_intent']['status'] 
  const client_secret = subscription['latest_invoice']['payment_intent']['client_secret']
  new SubSchema({
      email,
      subscriptionId:subscription.id,
       customerId:customer.id,
       planId,
       priceId,
       planName,
       userId,
       chatApis:planName === "Premium"
       ? 600
       : planName === "Basic"
       ? 150
       : 300
       
      
  }).save().then((newSubs) => {
    User.updateOne({_id:userId},{
     chatApi:planName === "Premium"
     ? 600
     : planName === "Basic"
     ? 150
     : 300
  }).then(( result)=> {
    res.json({'client_secret': client_secret, 'status': status,subscription:subscription});
      
    }).catch(err=>{
      if (err) {
          console.log(err);
          res.status(400).send(err);
        }
    });
     
  });
  
}
catch (error) {
  return res.status(400).send({ error: { message: error.message } });
}
})
router.get("/product/",async(req,res)=>{
  const stripe = require('stripe')('sk_test_51N9lmKHIBvxG8JCLXtUfYtTSazYZeYL4zqe9mCjS2CrnDwy6hYfaBRCboF6ytzFjMKU7x3M1E47cnazNrCKFoxa000iSR3RbTI');

  const products = await stripe.products.retrieve(
      req.query.id
    );
res.send(products);
});
router.get("/subcription/",async(req,res)=>{
const subscription = await stripe.subscriptions.retrieve(
 req.query.id
);
res.send(subscription);
});
router.get("/products",async(req,res)=>{
    console.log(req.session);
    const stripe = require('stripe')('sk_test_51N9lmKHIBvxG8JCLXtUfYtTSazYZeYL4zqe9mCjS2CrnDwy6hYfaBRCboF6ytzFjMKU7x3M1E47cnazNrCKFoxa000iSR3RbTI');

const products = await stripe.products.list({
  limit: 3,
});
res.send(products);
})





module.exports=router;