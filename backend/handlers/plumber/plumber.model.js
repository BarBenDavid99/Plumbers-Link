const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const OpinionSchema = require('../opinions/opinion.model').schema;


const schema = new Schema({
    name: {
        first: String,
        last: String,
        _id: { type: ObjectId, default: () => new mongoose.Types.ObjectId() },
    },
    bizName: String,
    profession: String,
    description: String,
    phone: String,
    email: String,
    image: { url: String, alt: String, _id: { type: ObjectId, default: () => new mongoose.Types.ObjectId() }, },
    address: { city: String, street: String, houseNumber: Number, zip: Number, _id: { type: ObjectId, default: () => new mongoose.Types.ObjectId() }, },
    serviceArea: [String],
    bizNumber: Number,
    opinions: [OpinionSchema],
    averageRating: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

schema.virtual('opinionsLength').get(function () {
    return this.opinions.length;
});

exports.Plumber = mongoose.model("plumbers", schema);
