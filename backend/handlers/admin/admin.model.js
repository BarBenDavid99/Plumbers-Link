const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const schema = new Schema({
    name: {
        first: String,
        last: String,
        _id: { type: ObjectId, default: () => new mongoose.Types.ObjectId() },
    },
    email: {
        type: String,
        unique: true,
    },
    password: String,
    phone: String,
    isMaster: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

exports.Admin = mongoose.model("admins", schema);