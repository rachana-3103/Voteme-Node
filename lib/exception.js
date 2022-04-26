class Exception {
    constructor(errorName = 'GeneralError', params = null, errorStack = null) {
        this.code = global.EXCEPTIONS[errorName]['code'];
        this.message = global.EXCEPTIONS[errorName]['message'];
        this.name = errorName;
        this.httpStatusCode = global.EXCEPTIONS[errorName]['http_code'];
        this.errorStack = errorStack;

        if (params && typeof params === 'string') {
            this.message = params;
        } else if (params && typeof params === 'object') {
            const keys = Object.keys(params);
            for (let i = 0, n = keys.length; i < n; i++) {
                const regExp = new RegExp('{' + keys[i] + '}', 'g');
                this.message = this.message.replace(regExp, params[keys[i]]);
            }
        }
    }

    getExceptionMessage() {
        return {
            'Code': this.code,
            'Name': this.name,
            'Message': this.message,
            'httpStatusCode': this.httpStatusCode
        };
    }

    sendError(){
        const payload = {
            'Status': 'Failure',
            'Error': this.getExceptionMessage()
        };
        return payload;
    }

}

module.exports = Exception;
