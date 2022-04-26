const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QueryLikeOrDislikeSchema = new Schema({
    QueryId: {type:String},
    Like: {type:Boolean},
    LikedBy: {type:String},
    CreatedAt: {type: Number},
},{
    versionKey: false
});



module.exports = mongoose.model('QueryLikeOrDislike', QueryLikeOrDislikeSchema);
