const mongoose = require('mongoose');

const opinionSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: String,
    createdAt: { type: Date, default: Date.now },
});

const Opinion = mongoose.model('Opinion', opinionSchema);

module.exports = Opinion;