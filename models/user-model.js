const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    displayName: String,
    googleId: String,
    thumbnail: String,
    chatApi:Number,
    planId:String,

});

const User = mongoose.model('user', userSchema);

module.exports = User;