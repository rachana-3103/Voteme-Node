const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const LikeSchema = new Schema({
    Like: {type: Boolean},
    LikedBy:{type: String},
    CreatedAt: {type: Number},

}, {versionKey: false});


const QueryCommentsSchema = new Schema({
    QueryId: {type:String},
    Comment: {type:String},
    CommentedBy: {type:String},
    CreatedAt: {type: Number},
    ParentCommentId: {type:String,Default: null},
    TotalLikes: {type:Number,Default: 0},
    Likes: [LikeSchema]
},{
    versionKey: false
});



module.exports = mongoose.model('QueryComments', QueryCommentsSchema);
