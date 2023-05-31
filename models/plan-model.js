const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const planSchema = new Schema({
    name: String,
    description: String,
    price: Number,
    chatApi:Number

});

const Plan = mongoose.model('plan', planSchema);

module.exports = Plan;