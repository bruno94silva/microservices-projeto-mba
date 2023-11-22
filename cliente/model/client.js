const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    id: {type:mongoose.Types.ObjectId},
    name: {type:String},
    age: {type:String},
    user: {type:mongoose.Schema.Types.ObjectId, ref: 'User'}
});

const Client = mongoose.model('Client', clientSchema);

module.exports = Client