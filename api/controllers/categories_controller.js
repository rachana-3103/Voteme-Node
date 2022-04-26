const Exception = require('../../lib/exception');
const Response = require('../../lib/response');
const Utils = require('../../lib/utils');
const Moment = require('moment');
const Category = require('../models/category');
const { ObjectId } = require('mongodb'); // or ObjectID
const validator = require('validator');
const Imagemagick = require('imagemagick');
const path = require('path');
const fs = require('fs');
const AWS = require('aws-sdk');

const convertImage = async (path, key) => {
    return new Promise((resolve, reject) => {
        Imagemagick.resize(
            {
                srcData: fs.readFileSync(path, 'binary'),
                width: 80,
                height: 80
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
        let bucketName = '';
        let originalUpload = '';
        let originalThumbnailUpload = '';
        bucketName = global.CONFIG['aws']['S3_BUCKET_IMAGES_CATEGORYIMAGE'];

        originalUpload = await uploadImageToS3(`${key}`, data, bucketName, contentType);
        fs.unlinkSync(file.path);
        originalThumbnailUpload = await uploadImageToS3(`${thumbnailKey}`, thumbnailData, bucketName, contentType);
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

AWS.config.update({
    accessKeyId: global.CONFIG['aws']['S3_BUCKET_ACCESS_KEY_ID'],
    secretAccessKey: global.CONFIG['aws']['S3_BUCKET_SECRET_ACCESS_KEY'],
    region: global.CONFIG['aws']['REGION'],
});

const s3bucket = new AWS.S3({
    params: global.CONFIG['aws']['S3_BUCKET_IMAGES_PROFILEIMAGE']
});

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

const fileRemove = async (filepath,mimeType) => {
    let key = filepath;
    if (global.CONFIG['contentType']['image'].includes(mimeType) === true) {
        let bucketName = global.CONFIG['aws']['S3_BUCKET_IMAGES_CATEGORYIMAGE'];
        await removeImageToS3(`${key}`, bucketName);
    }
}

const removeImageToS3 = (key, bucketName) => new Promise((resolve, reject) => {
    const params = {
        Key: key,
        Bucket: bucketName,
    };
    s3bucket.deleteObject(params, function (error, data) {
        if (error) {
            return reject(error);
        }
        return resolve(data);
    });
});


class CategoryController {
    /*
    * Code Comments
    * URL - /
    * Method - POST
    * Method use to create new category
    * */
    static async createCategory(request, handler) {
        try {

            const categoryName = request.payload.CategoryName;
            const image = request.payload.Image;
            const isActive = request.payload.IsActive || false;

            if (!categoryName) {
                return new Exception('ValidationError', 'Please Provide CategoryName').sendError();
            }

            // if(isActive!=true  && isActive!=false){
            //     return new Exception('ValidationError','Please Provide IsActive').sendError();
            // }else{
            //     if(!validator.isBoolean(isActive.toString())){
            //         return new Exception('ValidationError','Please Provide Boolean Value').sendError();
            //     }
            // }
            if (image && global.CONFIG['extension'].includes(path.extname(image.filename)) === false) {
                return new Exception('ValidationError', 'Please Provide Valid input type of Image').sendError();
            } else if (image) {
                const size = await fileSize(image);
                if (size == true) {
                    return new Exception('ValidationError', 'Please Provide Valid size of Image').sendError();
                }
            }
            const postData = {};
            postData.CategoryName = categoryName;
            postData.Active = isActive;
            postData.CreatedAt = new Moment();
            if (image) {
                const filepath = await fileUpload(image);
                postData.Image = filepath[0];
                postData.ThumbnailURL = filepath[1];
                postData.MimeType = image.headers['content-type'];
            }

            const categoryObj = new Category(postData);
            const result = await categoryObj.save();

            return new Response(result).sendResponse();

        } catch (error) {
            console.log(error);
            return new Exception('GeneralError').sendError(error);
        }
    }
    static async updateCategory(request, handler) {
        try {
            const categoryId = request.params.categoryid;
            const categoryName = request.payload.CategoryName;
            const image = request.payload.Image;
            const isActive = request.payload.IsActive || false;

            if (!categoryName) {
                return new Exception('ValidationError', 'Please Provide CategoryName').sendError();
            }

            if (image && global.CONFIG['extension'].includes(path.extname(image.filename)) === false) {
                return new Exception('ValidationError', 'Please Provide Valid input type of Image').sendError();
            } else if (image) {
                const size = await fileSize(image);
                if (size == true) {
                    return new Exception('ValidationError', 'Please Provide Valid size of Image').sendError();
                }
            }
            const category = await Category.findOne({"_id":categoryId});
             await Category.updateOne({
                "_id":categoryId,
            },{
                $set:{
                    "CategoryName":categoryName,
                    "Active":isActive
                }
            });
            if (image) {
                const filepath = await fileUpload(image);
                if(filepath){
                    if(category.Image){
                        let fileToRemove = category.Image.split('/').slice(-1)[0];
                        const mimeType = category.MimeType;
                        await fileRemove(fileToRemove,mimeType);
                    }
                    if(category.ThumbnailURL){
                        let thumbnailRemove = category.ThumbnailURL.split('/').slice(-1)[0];
                        await fileRemove(thumbnailRemove,mimeType);
                    }

                }
                await Category.updateOne({
                "_id":categoryId,
                },{
                    $set:{
                        "Image":filepath[0],
                        "ThumbnailURL":filepath[1],
                        "MimeType":image.headers['content-type']
                    }
                });
            }
            return new Response({message : "Category Updated successfully!!!"}).sendResponse();

        } catch (error) {
            console.log(error);
            return new Exception('GeneralError').sendError(error);
        }
    }
    static async getCategory(request, handler){
        try{

            let queryObject ={};
            queryObject.Active=true;

            if(request.query.CategoryName){
                const searchPattern = new RegExp('^' + this.escapeRegExp(request.query.CategoryName), 'i');
                queryObject.CategoryName=searchPattern;
            }
            const result= await Category.find(queryObject).lean();

            if(!result){
                return new Response([]).sendResponse();
            }else{
                return new Response(result).sendResponse();
            }

        }catch(error){
            return new Exception('GeneralError').sendError(error);
        }
    }

    static escapeRegExp(str) {
        //escapeRegExp("All of these should be escaped: \ ^ $ * + ? . ( ) | { } [ ]");
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    }
}

module.exports = CategoryController;