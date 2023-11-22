const mongoose = require('mongoose');

const financialSchema = new mongoose.Schema({
    id: {type:mongoose.Types.ObjectId},
    bankName: {type:String},
    typeAccount: {type:String},
    accountPersonName: {type:String},
    cardLimit: {type:String}
});

const Financial = mongoose.model('Financial', financialSchema);

module.exports = Financial