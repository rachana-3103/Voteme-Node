const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    FirstName: {type: String},
    LastName : {type: String},
    Mobile : {type: String},
    Image : {type: String},
    ThumbnailURL :{type:String},
    MimeType : {type:String},
    Type: {type:String},
    Email : {type: String,unique:true},
    Token: {type: String,unique:true},
    BirthDate : {type: Date},
    Status: {type: Boolean, Default: false},
    CreatedAt: {type: Number},
    UpdatedAt: {type: Number},
    LastLogin : {type: Number},
    AuthoToken : {type: String},
    TokenExpireIn :{type:Number},
    Category :{type:Array}
},{
    versionKey: false
});
module.exports = mongoose.model('User', UserSchema);
