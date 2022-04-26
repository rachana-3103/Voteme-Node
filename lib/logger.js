const queryString = require('querystring');
const url = require('url');
const UrlPattern = require('url-pattern');
const Log = require('../api/models/log');

class Logger {
    /**
     * @param request
     * @param payload
     * @param responseTime
     * @param isTimeoutNotificationEnabled
     * @param isTimedOut
     */
    static logAPI(request) {
        setImmediate(
            async (request) => {
                const payload = request.response.source;
                const responseTime = request.info.responded;
                let api = '';
                let apiId = '';
                let matchParameters = {};
                let category = null;
                const apiList = Object.keys(global.APIS[request.method.toUpperCase()]);
                for (let i = 0, n = apiList.length; i < n; i++) {
                    const match = new UrlPattern(apiList[i], {
                        'segmentValueCharset': '.@a-zA-Z0-9_-'
                    }).match(url.parse(request.url)['pathname'].replace(/\/$/, ''));
                    if (match) {
                        api = apiList[i];
                        apiId = global.APIS[request.method.toUpperCase()][apiList[i]]['id'];
                        category = global.APIS[request.method.toUpperCase()][apiList[i]]['category'];
                        matchParameters = match;
                        break;
                    }
                }
                // if (!api && request.url.indexOf('/admin') < 0) {
                //     Sendmail.send('htapisupport@rapidops.com', null, null, 'Logger Failed', `${request.url}:${request.method}`);
                // }
console.log(request.body);
                console.log(request.headers);
                console.log(payload);
                const queryParams = queryString.parse(url.parse(request.url)['query']);
                const user = matchParameters['email'] || queryParams['email'] || queryParams['Email'] || (request.method === 'POST' && request.body ? request.body['email'] : '');
                const logObj = {
                    Api: api,
                    Method: request.method.toUpperCase(),
                    InputParameters: Object.assign(request.body || {}, request.headers),
                    ApplicationUser: request.headers.user || "Developer",
                    User: user || '',
                    Type: payload['Status'],
                    OutPut: payload,
                    LogDt: request.info.received.toString(),
                    StartTime: request.info.received,
                    ResponseTime: responseTime,
                    ApiHash: apiId,
                    uuid: request.uuid,
                    ResponseSize: payload ? Buffer.byteLength(JSON.stringify(payload)) : 0
                };

                try {
                    const log = new Log(logObj);
                    await log.save(function(err){});
                    // if (isTimedOut && isTimeoutNotificationEnabled) {
                    //     Sendmail.send(global.CONFIG['error-email']['to'], null, null, `Time Out Occurred : ${category}`,
                    //         `<html><body><pre>${beautify(options, null, 2, 100)}</pre></body></html>`, undefined, null, true);
                    // }
                } catch (error) {
                    console.error(`API Logger ${error}`);
                }
            },
            request
        );
    }
}

module.exports = Logger;