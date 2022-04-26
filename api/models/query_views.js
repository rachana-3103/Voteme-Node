const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QueryViewsSchema = new Schema({
    QueryId: {type:String},
    ViewedBy: {type:String},
    CreatedAt: {type: Number},
},{
    versionKey: false
});


module.exports = mongoose.model('QueryView', QueryViewsSchema);