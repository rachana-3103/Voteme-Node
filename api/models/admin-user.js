var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AdminUserSchema = new Schema({
  FirstName: {type: String},
  LastName: {type: String},
  EmailAddress : {type: String},
  Password : {type: String},
  UserName : {type: String},
  Code     :  {type: String},
  Phone    : {type: String},
  Address  : {type: String},
  Role     :   {type: String},
  CreatedAt : {type: Number},
  UpdatedAt : {type: Number},
  LastLogin : {type: Number},
  Status :{type:Boolean, default:true},
  IsMainAdmin:{type:Boolean, default:true}
},{
  //collection:'adminusers',
  versionKey: false
});

module.exports = mongoose.model('AdminUser', AdminUserSchema);
