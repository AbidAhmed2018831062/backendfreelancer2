const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    userId: String,
    userMessage: Array,
    characterMessage:Array,
    sessionId:String

});

const Message = mongoose.model('message', messageSchema);

module.exports = Message;