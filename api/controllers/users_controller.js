const Exception = require('../../lib/exception');
const Response = require('../../lib/response');
const Utils = require('../../lib/utils');
const User = require('../models/user');
const Category = require('../models/category');
const validator = require('validator');
const AWS = require('aws-sdk');
const path = require('path');
const Moment = require('moment');
const lodash = require('lodash');
const Hashes = require('jshashes');
const MD5 = new Hashes.MD5;
const moment = require('moment-timezone');
const { LOGINTYPE } = require('../../lib/constant');
const { ObjectId } = require('mongodb'); // or ObjectID
const EmailTemplates = require('email-templates');
const SMTP = require('../../lib/smtp');
const { jwtSignUser } = require('../../lib/helper');
const fs = require('fs');
const Imagemagick = require('imagemagick');
const Email = require('email-templates');

const convertImage = async (path, key) => {
    return new Promise((resolve, reject) => {
        Imagemagick.resize(
            {
                srcData: fs.readFileSync(path, 'binary'),
                width: 300,
                height: 160
            },
            function (err, stdout) {
                if (err) {
                    reject(err)
                }
                fs.writeFileSync('/tmp/thumbnail_' + key, stdout, 'binary');
                resolve('/tmp/thumbnail_' + key);
            });
    })
}

AWS.config.update({
    accessKeyId: global.CONFIG['aws']['S3_BUCKET_ACCESS_KEY_ID'],
    secretAccessKey: global.CONFIG['aws']['S3_BUCKET_SECRET_ACCESS_KEY'],
    region: global.CONFIG['aws']['REGION'],
});

const s3bucket = new AWS.S3({
    params: { Bucket: global.CONFIG['aws']['S3_BUCKET_IMAGES_PROFILEIMAGE'] },
});

const fileUpload = async (file) => {
    let fileContentType = file.headers['content-type'];
    let contentType = 'application/octet-stream';
    contentType = fileContentType;
    const fileName = file.filename;
    const key = fileName.replace(/ /g, '_');
    let data = fs.readFileSync(file.path);
    let thumbnailData = '';
    let thumbnailKey = 'thumbnail' + key;
    if (global.CONFIG['contentType']['image'].includes(fileContentType) === true) {
        const thumbnailPath = await convertImage(file.path, key);
        thumbnailData = fs.readFileSync(thumbnailPath);

        let bucketName = global.CONFIG['aws']['S3_BUCKET_IMAGES_PROFILEIMAGE'];
        let originalUpload = await uploadImageToS3(`${key}`, data, bucketName, contentType);
        fs.unlinkSync(file.path);
        let originalThumbnailUpload = await uploadImageToS3(`${thumbnailKey}`, thumbnailData, bucketName, contentType);
        fs.unlinkSync(thumbnailPath);
        return [originalUpload, originalThumbnailUpload];
    }
}

const fileSize = async (file) => {
    let size = false;
    let fileSize = file.bytes;
    const fileContentType = file.headers['content-type'];
    if (global.CONFIG['contentType']['image'].includes(fileContentType) === true) {
        if (fileSize > global.CONFIG['fileSize']['image']) {
            size = true;
        }
    }
    return size;
}

const uploadImageToS3 = (key, data, bucketName, contentType) => new Promise((resolve, reject) => {
    const params = {
        Key: key,
        Body: data,
        ContentType: contentType,
        Bucket: bucketName,
        ACL: 'public-read',

    };
    s3bucket.upload(params, async (error, fileInfo) => {

        if (error) {
            return reject(error);
        }
        return resolve(fileInfo.Location);
    });

});

class UserController {
    /*
    * Code Comments
    * URL - /
    * Method - POST
    * Method use to register user
    * */
    static async votemeSignUp(request, handler) {
        try {

            const firstName = request.payload.FirstName;
            const lastName = request.payload.LastName;
            const email = request.payload.Email;
            const mobile = request.payload.Mobile;
            const dob = request.payload.BirthDate;
            const type = request.payload.Type;
            const token = request.payload.Token; // For Google Token
            const image = request.payload.Image;

            // if (!image) {
            //     return new Exception('ValidationError', 'Please Provide Image').sendError();
            // }
            if (!email) {
                return new Exception('ValidationError', 'Please Provide Email Id').sendError();
            }
            if (!validator.isEmail(email)) {
                return new Exception('ValidationError', 'Please Provide Valid Email Id').sendError();
            }
            if (!token) {
                return new Exception('ValidationError', 'Please Provide Token').sendError();
            }
            if (!LOGINTYPE[request.payload.Type]) {
                return new Exception('ValidationError', 'Please Provide Valid LoginType').sendError();
            }

            const userDetail = await User.findOne({ "Email": email, "Token": token }).lean();
            const tokenExpireIn = Moment().add(global.CONFIG['token']['expired'], 'minutes').unix();
            if (userDetail) {
                if (!userDetail.AuthoToken) {
                    const generatedToken = jwtSignUser({ _id: userDetail._id, Email: userDetail.Email });
                    await User.updateOne({
                        _id: userDetail._id,
                    }, {
                        $set: {
                            AuthoToken: generatedToken,
                            TokenExpireIn: tokenExpireIn
                        }
                    });
                }

                const now = Moment().unix();
                const tokenExpired = userDetail.TokenExpireIn;
                const difference = tokenExpired - now;
                if (userDetail.AuthoToken && difference < global.CONFIG['token']['expired']) {
                    const generatedToken = jwtSignUser({ _id: userDetail._id, Email: userDetail.Email });
                    await User.updateOne({
                        _id: userDetail._id,
                    }, {
                        $set: {
                            AuthoToken: generatedToken,
                            TokenExpireIn: tokenExpireIn
                        }
                    });
                }
                const userDetailUpdate = await User.findOne({ "Email": email, "Token": token }).lean();
                const categoryArray = [];
                if (!userDetailUpdate.Category) {
                    await User.updateOne({
                        _id: userDetail._id,
                    }, {
                        $set: {
                            Category: []
                        }
                    });
                } else {
                    for (let i = 0; i < userDetailUpdate.Category.length; i++) {
                        const categoryId = userDetailUpdate.Category[i];
                        const result = await Category.findOne({ "_id": categoryId }).lean();
                        if (result) {
                            delete result.Active;
                            categoryArray.push(result);
                        }
                    }
                }

                userDetailUpdate.Category = categoryArray;

                return new Response({
                    user: userDetailUpdate,
                    AuthoToken: userDetailUpdate.AuthoToken,
                    TokenExpireIn: userDetailUpdate.TokenExpireIn,
                    message: 'User is already exists'
                }).sendResponse();
            } else {
                const postData = {};
                if (image === "") {
                    postData.Image = image;
                } else {
                    postData.Image = image;
                }
                postData.FirstName = firstName;
                postData.LastName = lastName;
                postData.Mobile = mobile;
                postData.Email = email;
                postData.Type = type;
                postData.Token = token;
                postData.Status = true;
                postData.CreatedAt = new Moment();
                postData.UpdatedAt = new Moment();
                console.log(Moment.utc(dob, 'DD/MM/YYYY'), '.....................date');
                postData.BirthDate = Moment.utc(dob, 'DD/MM/YYYY').local();

                const userObj = new User(postData);
                const result = await userObj.save();
                console.log(result, '................result');
                const userDetail = await User.findOne({ "Email": email, "Token": token }).lean();
                const categoryArray = [];
                for (let i = 0; i < userDetail.Category.length; i++) {
                    const categoryId = userDetail.Category[i];
                    const result = await Category.findOne({ "_id": categoryId }).lean();
                    if (result) {
                        delete result.Active;
                        delete result.CreatedAt;
                        categoryArray.push(result);
                    }
                }
                userDetail.Category = categoryArray;

                const generatedToken = jwtSignUser({ _id: result._id, Email: result.Email });
                const templatesDir = path.resolve(global.ROOT_PATH, 'templates');
                const emailContent = new EmailTemplates({ views: { root: templatesDir } });
                const objForEmail = {

                    Name: result.FirstName + ' ' + result.LastName,
                    URL: global.CONFIG['SMTP']['baseURL']

                };
                const mailOptions = {
                    from: global.CONFIG['SMTP']['from'], // sender address
                    to: email, // list of receivers
                    subject: 'Registered successfully', // Subject line
                    html: await emailContent.render('users/welcome-email.ejs', objForEmail)// plaintext body,
                };
                const transporter = new SMTP().transporter;
                await transporter.sendMail(mailOptions);
                //userDetail.BirthDate = Moment(userDetail.BirthDate).format('DD/MM/YYYY');
                await User.updateOne({
                    _id: result._id,
                }, {
                    $set: {
                        AuthoToken: generatedToken,
                        TokenExpireIn: tokenExpireIn
                    }
                })
                return new Response({
                    user: userDetail,
                    AuthoToken: generatedToken,
                    TokenExpireIn: tokenExpireIn,
                    message: 'Awesome! user registered successfully'
                }).sendResponse();

            }

        } catch (error) {
            console.log(error);
            if (error.code == 11000 && error.errmsg.search("Token_1 dup key") !== -1) {
                return new Exception('GeneralError', 'Sorry! Token is already exists, please try again with new Token.').sendError();

            }
            if (error.code == 11000 && error.errmsg.search("Email_1 dup key") !== -1) {
                return new Exception('GeneralError', 'Provided Email Already Exists. Please Register With Other Email.').sendError();

            }
            return new Exception('GeneralError').sendError(error);
        }
    }

    /*
    * Code Comments
    * URL - /
    * Method - PUT
    * Method use update user profile
    * */

    static async updateProfile(request, handler) {
        try {
            const id = request.params.id;
            const firstName = request.payload.FirstName;
            const lastName = request.payload.LastName;
            const mobile = request.payload.Mobile;
            const dob = request.payload.BirthDate;
            const image = request.payload.Image;
            // const category = request.payload.Category;
            // const categoryArray = category.split(',');
            // const finalCategoryArray = [];

            // for(let i=0;i<categoryArray.length;i++){
            //     if(categoryArray[i].length === 24){
            //     const categoryArrayObj = await Category.findById({"_id":categoryArray[i]}).lean();
            //     if(categoryArrayObj){
            //     finalCategoryArray.push(categoryArray[i]);
            //     }
            //     }
            // }
            if (!firstName) {
                return new Exception('ValidationError', 'Please Provide First Name').sendError();
            }
            if (!lastName) {
                return new Exception('ValidationError', 'Please Provide Last Name').sendError();
            }
            if (!dob) {
                return new Exception('ValidationError', 'Please Provide Date of Birth').sendError();
            } else {

                if (!Moment(dob, 'DD/MM/YYYY', true).isValid()) {
                    return new Exception('ValidationError', 'Date of Birth Must Be DD/MM/YYYY').sendError();
                }
            }
            if (image && global.CONFIG['extension'].includes(path.extname(image.filename)) === false) {
                return new Exception('ValidationError', 'Please Provide Valid input type of Image').sendError();
            } else if (image) {
                const size = await fileSize(image);
                if (size == true) {
                    return new Exception('ValidationError', 'Please Provide Valid size of Image').sendError();
                }
            }
            console.log(firstName, '..............', lastName);

            // if (image) {
            // let filepath = await fileUpload(image);
            await User.updateOne({
                _id: id
            }, {
                $set: {
                    "FirstName": firstName,
                    "LastName": lastName,
                    "Mobile": mobile,
                    // "Category":finalCategoryArray,
                    // "Image": filepath[0],
                    // "ThumbnailURL": filepath[1],
                    // "MimeType": image.headers['content-type'],
                    "BirthDate": Moment.utc(dob, 'DD/MM/YYYY').local(),
                    "UpdatedAt": new Moment()
                }
            });
            const user = await User.findOne({ "_id": id }).lean();
            console.log(user, '..............user');
            // }

            return new Response({ message: 'Awesome! user updated successfully' }).sendResponse();
        } catch (error) {
            if (error.code == 11000 && error.errmsg.search("Token_1 dup key") !== -1) {
                return new Exception('GeneralError', 'Sorry! Token is already exists, please try again with new Token.').sendError();

            }
            if (error.code == 11000 && error.errmsg.search("Email_1 dup key") !== -1) {
                return new Exception('GeneralError', 'Provided Email Already Exists. please try again with new Email.').sendError();

            }
            return new Exception('GeneralError').sendError(error);
        }
    }


    static async updateUserCategory(request, handler) {
        try {
            const authToken = request.headers.authorization.split(' ')[1];
            const category = request.payload.Category;

            const user = await User.findOne({ "AuthoToken": authToken }).lean();

            const userCategory = [];
            const finalCategoryArray = [];
            for (let i = 0; i < category.length; i++) {
                if (category[i].length === 24) {
                    const categoryArray = await Category.findOne({ "_id": category[i] }).lean();
                    if (categoryArray) {
                        const categoryObject = {};
                        categoryObject._id = categoryArray._id;
                        categoryObject.CategoryName = categoryArray.CategoryName;
                        categoryObject.Image = categoryArray.Image;
                        categoryObject.ThumbnailURL = categoryArray.ThumbnailURL;
                        categoryObject.MimeType = categoryArray.MimeType;
                        categoryObject.Active = categoryArray.Active;
                        userCategory.push(categoryObject);
                        finalCategoryArray.push(category[i]);
                    }
                }
            }

            await User.findOneAndUpdate({
                "_id": user._id,
            }, {
                $set: {
                    Category: finalCategoryArray
                }
            });

            return new Response(userCategory).sendResponse();

        } catch (error) {

            return new Exception('GeneralError').sendError(error);
        }
    }
    /*
    * Code Comments
    * URL - /
    * Method - GET
    * Method use to get user profile details
    * */

    static async getProfile(request, handler) {
        try {
            const id = request.params.id;

            const userDetail = await User.findOne({ "_id": id }).lean();
            userDetail.BirthDate = Moment(userDetail.BirthDate, 'DD/MM/YYYY');
            delete userDetail.AuthoToken;
            return new Response(userDetail).sendResponse();

        } catch (error) {

            return new Exception('GeneralError').sendError(error);
        }
    }

    static async getUsers(request, handler) {
        try {

            let page = parseInt(request.query.PageNo) || 1;
            let maxRecords = parseInt(request.query.Rows) || 10;

            const pageNumber = ((parseInt(page) - 1) * parseInt(maxRecords));

            let date = request.query.Date;
            if (page === undefined || page === null || page === '') {
                page = 1;
            }
            if (maxRecords === undefined || maxRecords === null || maxRecords === '') {
                maxRecords = 50;
            }
            let sortyQueryObject = {};
            if (!date) {
                sortyQueryObject.CreatedAt = -1;
            }
            const queryObj = {};

            const result = await User.aggregate(
                [{ $match: queryObj },
                {
                    $project: {

                        "FirstName": 1,
                        "LastName": 1,
                        "Email": 1,
                        "Status": 1,
                        "CreatedAt": 1,
                        "UpdatedAt": 1

                    }
                },
                { $sort: { CreatedAt: -1 } },
                {
                    '$facet': {
                        Summary: [{ $count: "TotalRecords" }, { $addFields: { Page: parseInt(page) } }],
                        Records: [{ $skip: pageNumber }, { $limit: parseInt(maxRecords, 10) }] // add projection here wish you re-shape the docs
                    }
                }
                ]
            );
            let responseObject = {};
            responseObject.Summary = result[0].Summary;
            responseObject.Records = [];
            return new Response(result).sendResponse();

        } catch (error) {
            return new Exception('GeneralError').sendError(error);
        }
    }

    static async deleteUserProfile(request, handler) {
        try {
            const id = request.params.id;
            await User.remove({
                _id: id
            });
            return new Response({ message: "User deleted successfully!!" }).sendResponse();
        } catch (e) {
            return new Exception('GeneralError').sendError(e);
        }
    }

    static async logout(request, handler) {
        try {
            const authToken = request.headers.authorization.split(' ')[1];
            const userDetail = await User.findOne({ "AuthoToken": authToken }).lean();
            await User.update(
                { "_id": userDetail._id },
                { $unset: { Token: "Token" } })
            return new Response({ message: "User logout successfully!!" }).sendResponse();
        } catch (e) {
            console.log(e);
            return new Exception('GeneralError').sendError(e);
        }
    }
}
module.exports = UserController;
