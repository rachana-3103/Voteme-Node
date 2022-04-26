const mongoose = require('mongoose');
const Schema = mongoose.Schema;

 var OptionsSchema = new Schema({
    Key:{ type: String },
    Answer:{ type: String },
    OptionOneFile:{ type: String },
    OptionOneThumbnailURL: {type: String},
    OptionOneMimeType :{type:String},
    OptionTwoFile:{ type: String },
    OptionTwoThumbnailURL: {type: String},
    OptionTwoMimeType :{type:String},
    OptionThreeFile:{ type: String },
    OptionThreeThumbnailURL: {type: String},
    OptionThreeMimeType :{type:String},
    OptionFourFile:{ type: String },
    OptionFourThumbnailURL: {type: String},
    OptionFourMimeType :{type:String},
    OptionFiveFile:{ type: String },
    OptionFiveThumbnailURL: {type: String},
    OptionFiveMimeType :{type:String},
    OptionSixFile:{ type: String },
    OptionSixThumbnailURL: {type: String},
    OptionSixMimeType :{type:String},
    NumberOfVotes:{ type: Number , Default: 0 },
    VotedBy:{ type: Array },
    Percentage:{ type: String }
}, {versionKey: false});

var OptionTwoSchema = new Schema({
    Answer:{ type: String },
    NumberOfVotes:{ type: Number , Default: 0},
    VotedBy:{ type: Array },
    Percentage:{ type: String }
}, {versionKey: false});

var OptionThreeSchema = new Schema({
    Answer:{ type: String },
    NumberOfVotes:{ type: Number , Default: 0},
    VotedBy:{ type: Array },
    Percentage:{ type: String }
}, {versionKey: false});

var OptionFourSchema = new Schema({
    Answer:{ type: String },
    NumberOfVotes:{ type: Number , Default: 0 },
    VotedBy:{ type: Array },
    Percentage:{ type: String }
}, {versionKey: false});

var OptionFiveSchema = new Schema({
    Answer:{ type: String },
    NumberOfVotes:{ type: Number , Default: 0},
    VotedBy:{ type: Array },
    Percentage:{ type: String }
}, {versionKey: false});

var OptionSixSchema = new Schema({
    Answer:{ type: String },
    NumberOfVotes:{ type: Number , Default: 0},
    VotedBy:{ type: Array },
    Percentage:{ type: String }
}, {versionKey: false});

const QueryOptionSchema = new Schema({
    QueryId: {type: String},
    OptionType : {type: Number}, //(1=Text,2=Image,3=Audio,4=Video)
    Options : [OptionsSchema],
    // OptionTwo : [OptionTwoSchema],
    // OptionThree : [OptionThreeSchema],
    // OptionFour : [OptionFourSchema],
    // OptionFive : [OptionFiveSchema],
    // OptionSix : [OptionSixSchema],



},{
    versionKey: false
});
module.exports = mongoose.model('QueryOption', QueryOptionSchema);
