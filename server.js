'use strict';
const Hapi = require('hapi');
const ENV = process.env.NODE_ENV || 'develop';
const configFile = './config/environments/' + ENV + '.json';
const AuthBearer = require('hapi-auth-bearer-token');
global.CONFIG = require(configFile);
global.ROOT_PATH = __dirname;
var path = require('path');
const Moment = require('moment');
const User = require('./api/models/user');
global.FRONT_ROOT_PATH = path.join(global.ROOT_PATH, '../frontend_app');
global.EXCEPTIONS = require('./config/exceptions');
global.APIS = require('./config/apis');
global.Local = "en";
const Exception = require('./lib/exception');
const server = Hapi.server({
    port: global.CONFIG['server'].port,
    host: '0.0.0.0',
    "routes": {
        "cors": {
            origin: ["*"],
            headers: ["Accept", "Content-Type" , "Authorization"],
            additionalHeaders: ["X-Requested-With"]
        }
    }
});

const Mongo = require('./config/mongodb').Mongo;
const AccessLog = require('./lib/access_log');
//const Logger = require('./lib/logger');
const Routes = require('./api/routes');
new Routes(server);
server.events.on('response', function (request) {
    // Logger.logAPI(request);
});

server.ext('onRequest', function (request, h) {
    if (request.method.toUpperCase() == 'GET') {
        global.Local = request.query.Local || 'en';
    }
    global.WEB_URL = server.info.protocol + '://' + request.info.hostname + ":9000";
    return h.continue;
});
server.ext('onPreResponse', function (request, h) {
    const response = request.response;
    if (!response.isBoom) {
        return h.continue;
    }
    // Replace error with friendly HTML

    const error = response;

    if (error.output.payload.message === 'Missing authentication') {
        return new Exception('Unauthorized', 'Authorization missing').sendError();
    }

    if (error.output.payload.message === 'Bad token') {
        return new Exception('BadToken', 'Authorization token in not valid or Token Expired').sendError();
    }

});
const init = async () => {
    await server.register(AuthBearer);

    // if(ENV!=='develop' && ENV!=='dev'){
    server.auth.strategy('simple', 'bearer-access-token', {
        //allowQueryToken: true,
        validate: async (request, token, h) => {
            let isValid = false;

            const user = await User.findOne({ "AuthoToken": token });
            if (!user) {
                isValid = false;
                const credentials = { token };
                const artifacts = { test: 'info' };
                return { isValid, credentials, artifacts };
            }
            const now = Moment().unix();
            const tokenExpired = user.TokenExpireIn;
            const difference = tokenExpired - now;

            if (difference < global.CONFIG['token']['expired']) {
                //return {message:'Token Expired'};

                isValid = false;
                const credentials = { token };
                const artifacts = { test: 'info' };

                return { isValid, credentials, artifacts };
            } else {
                // here is where you validate your token
                // comparing with token from your database for example

                isValid = token === user.AuthoToken;
                const credentials = { token };
                const artifacts = { test: 'info' };
                return { isValid, credentials, artifacts };
            }
        }
    });
    server.auth.default('simple');
    server.route({
        method: 'GET',
        path: '/',
        config: { auth: false },
        handler: async function (request, h) {
            return { info: 'success!' };
        }
    });

    // }


    await server.start();

    return server;


    //await server.start();
    //console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {

    console.log(err, "888888888888");
    process.exit(1);
});

init().then((server) => console.log(`Server listening on ${server.info.uri}`))
    .catch(err => {

        console.error(err);
        process.exit(1);
    })
