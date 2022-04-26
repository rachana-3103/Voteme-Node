const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Category = require('./category');
const QuerySchema = new Schema({
    UserId: {type: String},
    Query : {type: String},
    File : {type: String},
    MimeType :{type:String},
    ChartOption :{type: String},
    ThumbnailURL: {type: String},
    // QueryType : {type: Number}, //(1=Text,2=Image,3=Audio,4=Video)
    IsPublic: {type: Boolean, Default: true},
    CreatedAt: {type: Number},
    EndDate: {type: Number},
    TotalComments: {type:Number,Default:0},
    TotalViews: {type:Number,Default:0},
    TotalLikes: {type:Number,Default: 0},
    TotalDisLikes: {type:Number,Default: 0},
    TotalVotes: {type: Number, Default: 0},
    Category:{type: Array},
    InActive: {type: Boolean, Default: false},

},{
    versionKey: false
});

QuerySchema.statics.categoryArray = async function (category){ 
        const categoryArray = category.split(',');
        const userCategory = [];
        for(let i=0;i<categoryArray.length;i++){
            if(categoryArray[i].length === 24){
                let id = categoryArray[i];
                const categoryArray1 = await Category.findById({"_id":id}).lean();
                if(categoryArray1){
                userCategory.push(categoryArray[i]);
                }
            }
        }
        return userCategory;
}

module.exports = mongoose.model('Query', QuerySchema);
