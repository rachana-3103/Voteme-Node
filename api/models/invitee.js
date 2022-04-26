const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InviteeSchema = new Schema({
    QueryId : {type: String},
    Email:{type: String},
    FaceBookId:{type: String},
    GoogleId:{type: String},
    UserId:{type: mongoose.Schema.ObjectId},
    InvitedAt: {type: Number}
},{
    versionKey: false
});
module.exports = mongoose.model('Invitee', InviteeSchema);
