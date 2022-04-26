const Sample = require('../models/sample');
const Exception = require('../../lib/exception');
const Response = require('../../lib/response');
const Restaurant = require('../models/restaurantowner');
class SampleController {
    /*
    * Code Comments
    * URL - /samples
    * Method - GET
    * */
    static async getSampleRecords(request, handler) {
        //console.log(handler.response);

        console.log(request.logs);
        console.log(request.params);
        console.log(request.query);
        const sampleData = await Restaurant.find({});
        console.log(sampleData,"******");
        return new Response(sampleData).sendResponse();
        //return handler.response();
    }

    /*
    * Code Comments
    * URL - /samples
    * Method - POST
    * */

    static async saveSampleRecord(request, handler){
        console.log(request.payload.name);
        const sample = new Sample({name: request.payload.name});
        await sample.save(function(err){});
        return new Exception('ValidationError').sendError();
        //return handler.response(error);
        //return handler.response({}).code(200)
    }

}
module.exports = SampleController;