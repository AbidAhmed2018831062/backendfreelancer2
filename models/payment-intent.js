const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const intentSchema = new Schema({
    planName: String,
    userId: String,
    price: Number,
    chatApi:Number,
    intent:String,

});

const Intent = mongoose.model('intent', intentSchema);

module.exports = Intent;