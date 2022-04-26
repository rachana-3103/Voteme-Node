const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    CategoryName: {type: String},
    Image: {type:String},
    ThumbnailURL :{type:String},
    MimeType : {type:String},
    Active: {type: Boolean, Default: false},
    CreatedAt: {type: Number},
    UpdatedAt: {type: Number}
},{
    collection:'categories',
    versionKey: false
});
module.exports = mongoose.model('Category', CategorySchema);
