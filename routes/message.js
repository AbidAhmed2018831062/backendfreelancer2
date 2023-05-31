const router = require("express").Router();
const Message = require('../models/message-model');
const SubSchema = require('../models/subscription-model');
const User = require('../models/user-model');
router.get("/sayhello",async(req,res)=>{
    res.send("hello");
})
router.post("/savechat",async(req,res)=>{
console.log(req.body);
const {userId,userMessage,characterMessage,sessionId}=req.body;
Message.findOne({sessionId: sessionId}).then((currentUser) => {
    if(currentUser){
        Message.updateOne({sessionId:req.body.sessionId},{
            characterMessage:req.body.characterMessage,
            userMessage:req.body.userMessage
        }).then(( result)=> {
          res.send(result);
            
          }).catch(err=>{
            if (err) {
                console.log(err);
                res.status(400).send(err);
              }
          });
    } else {
        // if not, create user in our db
        new Message({
            userId,
            userMessage,
            characterMessage,
            sessionId
        }).save().then((newMessage) => {
            console.log('created new user: ', newMessage);
           res.send(newMessage);
        });
    }
});
});

router.get("/getchats",async(req,res)=>{
    Message.find({userId:req.query.id}).then(( result)=> {
      
        User.findOne({_id:req.query.id}).then((result1)=>{
        res.send({chats:result,user:result1});
    })
        
      }).catch(err=>{
        if (err) {
            console.log(err);
            res.status(400).send(err);
          }
      });
})
router.put("/deleteapi",async(req,res)=>{
    User.find({_id:req.query.id}).then(( result)=> {
        User.updateOne({_id:userId},{
            chatApi:req.body.chatApi
         }).then(( result)=> {
           res.json({result});
             
           }).catch(err=>{
             if (err) {
                 console.log(err);
                 res.status(400).send(err);
               }
           });
}).catch(err=>{
        if (err) {
            console.log(err);
            res.status(400).send(err);
          }
      });
})
router.put("/updatechat",async(req,res)=>{
    Message.updateOne({sessionId:req.body.sessionId},{
        characterMessage:req.body.characterMessage,
        userMessage:req.body.userMessage
    }).then(( result)=> {
      res.send(result);
        
      }).catch(err=>{
        if (err) {
            console.log(err);
            res.status(400).send(err);
          }
      });
})

router.get("/getchat",async(req,res)=>{
    Message.find({sessionId:req.query.id}).then(( result)=> {
     res.send(result);  
    }).catch(err=>{
        if (err) {
            console.log(err);
            res.status(400).send(err);
          }
      });
})
module.exports=router;