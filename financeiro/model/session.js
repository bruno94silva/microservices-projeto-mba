const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    token: {type:String},
    user: {type:mongoose.Schema.Types.ObjectId, ref: 'User'}
});

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session