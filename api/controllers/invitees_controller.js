const Exception = require('../../lib/exception');
const Response = require('../../lib/response');
const Utils = require('../../lib/utils');
const User = require('../models/user');
const Invitee = require('../models/invitee');
const Query = require('../models/query');
const { ObjectId } = require('mongodb'); // or ObjectID
const Moment = require('moment');
const path = require('path');
const EmailTemplates = require('email-templates');
const SMTP = require('../../lib/smtp');
class InviteesController {
    /*
    * Code Comments
    * URL - /
    * Method - POST
    * Method use to send invitation on poll
    * */
    static async votemeInvitee(request, handler){
        try{
            const id = request.params.id;
            const invitee = request.payload.Invitee;
            if(invitee.length == 0){
                return new Exception('ValidationError', 'Please Provide Invitee').sendError();
            }
            const result = await Query.findOne({"_id":ObjectId(id),"IsPublic": true}).lean();
            if(!result){
                return new Exception('ValidationError', 'Provided QueryId is not Private').sendError();
            }
            let registeredUsers=[];
            let nonRegisteredUsers=[];
            for(let i=0; i< invitee.length;i++){
                const userObject= await User.findOne({ "Email": invitee[i].Email }).lean();

                if(userObject){

                    const object= await Invitee.findOne({ "Email": invitee[i].Email ,"QueryId":id}).lean();

                    if(!object){
                        registeredUsers.push(invitee[i].Email);
                        const postData = {};
                        postData.QueryId=id;
                        postData.Email = invitee[i].Email;
                        postData.FaceBookId=invitee[i].FacebookId;
                        postData.GoogleId=invitee[i].GoogleId;
                        postData.UserId=userObject._id;
                        postData.InvitedAt = new Moment();
                        const obj = new Invitee(postData);
                        const result = await obj.save();

                        const templatesDir = path.resolve(global.ROOT_PATH, 'templates');
                        const emailContent = new EmailTemplates({ views: { root: templatesDir } });
                        const objForEmail = {

                            Name: userObject.FirstName +' '+ userObject.LastName,
                            URL:global.CONFIG['SMTP']['baseURL']

                        };
                        const mailOptions = {
                            from: global.CONFIG['SMTP']['from'], // sender address
                            to: invitee[i].Email, // list of receivers
                            subject: 'Give your Vote', // Subject line
                            html: await emailContent.render('users/votenow.ejs', objForEmail)// plaintext body,
                        };
                        const transporter = new SMTP().transporter;
                        await transporter.sendMail(mailOptions);

                    }else{
                        console.log("Already Invited for this query if");
                    }

                }else{
                    console.log("Not Registered");
                    const object= await Invitee.findOne({ "Email": invitee[i].Email, "QueryId":id }).lean();
                    if(!object){
                        nonRegisteredUsers.push(invitee[i].Email);
                        const postData = {};
                        postData.QueryId=id;
                        postData.Email = invitee[i].Email;
                        postData.FaceBookId=invitee[i].FacebookId;
                        postData.GoogleId=invitee[i].GoogleId;
                        postData.InvitedAt = new Moment();
                        const obj = new Invitee(postData);
                        const result = await obj.save();
                        const templatesDir = path.resolve(global.ROOT_PATH, 'templates');
                        const emailContent = new EmailTemplates({ views: { root: templatesDir } });
                        const objForEmail = {

                            Name: '',
                            URL:global.CONFIG['SMTP']['baseURL']

                        };
                        const mailOptions = {
                            from: global.CONFIG['SMTP']['from'], // sender address
                            to: invitee[i].Email, // list of receivers
                            subject: 'Register On VoteMe and Give your Vote', // Subject line
                            html: await emailContent.render('users/registered.ejs', objForEmail)// plaintext body,
                        };
                        const transporter = new SMTP().transporter;
                        await transporter.sendMail(mailOptions);

                    }else{
                        console.log("Already Invited for this query else");
                    }

                }

            } // For Loop Completed
            return new Response({message:"User invited successfully!!"}).sendResponse();
        }catch(error){
            console.log(error,"*****");
            return new Exception('GeneralError').sendError(error);
        }
    }

    /*
    * Code Comments
    * URL - /
    * Method - GET
    * Method use to get invitee list
    * */

    static async getInvitee(request, handler){
        try{

            const searchPattern = new RegExp('^' + this.escapeRegExp(request.query.Email), 'i');

            const userObject= await User.find({ "Email": { $regex: searchPattern }},{"Email":1,"FirstName":1, "LastName":1, "_id":0}).lean();

            if(!userObject){
                return new Response([]).sendResponse();
            }else{
                return new Response(userObject).sendResponse();
            }

        }catch(error){ console.log(error,"****");
            return new Exception('GeneralError').sendError(error);
        }
    }

    static escapeRegExp(str) {
        //escapeRegExp("All of these should be escaped: \ ^ $ * + ? . ( ) | { } [ ]");
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    }
}

module.exports = InviteesController;
