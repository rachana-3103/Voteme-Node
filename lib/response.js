
class Response {
    constructor(output, message = null){
        this.Message = message;
        this.Data = output;
    }

    getResponse() {
        return {
            'Status': "Success",
            'Data': this.Data,
            'Message': this.Message
        };
    }

    sendResponse() {
        const payload = this.getResponse();
        if(payload.Message === null)
            delete payload.Message;
        return payload;
    }
}

module.exports = Response;