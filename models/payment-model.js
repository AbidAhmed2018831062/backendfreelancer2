const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
    id: String,
    user_name:String,
    amount_received: Number,
    date:Number,
    client_secret:String,
    payment_method:String

});

const Payment = mongoose.model('payments', paymentSchema);

module.exports = Payment;