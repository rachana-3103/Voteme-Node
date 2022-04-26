const Request = require('request-promise');

class GoogleApi {
    constructor(request) {
        this.request = request;

        this.hostname = 'https://maps.googleapis.com';
    }

    async searchAddress(address) {
        const path = '/maps/api/geocode/json?address=' + address + '&key='+global.CONFIG['google']['api-key'];
        const options = {
            url: this.hostname+''+path,
            method:'GET',
            headers: {
                'User-Agent': 'request',
                'Content-Type': 'application/json'
            }
        };
        return JSON.parse(await Request(options));

    }
}

module.exports = GoogleApi;
