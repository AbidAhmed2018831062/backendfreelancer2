const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subSchema = new Schema({
    email: String,
   subscriptionId:String,
    customerId:String,
    planId:String,
    userId:String,
    priceId:String,
    planName:String,
    chatApis:Number

});

const SubSchema = mongoose.model('subscription', subSchema);

module.exports = SubSchema;