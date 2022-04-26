//
// class Mongo {
//     constructor(server) {
//         this.mongoInit(server);
//     };
//
//      async mongoInit (server) {
//         const mongoConfig = global.CONFIG['mongo'];
//         const options = {
//             promises: 'native',
//             uri: `mongodb://${mongoConfig.host}/${mongoConfig.database}`
//         };
//         await server.register({
//             plugin: require('hapi-mongoose'),
//             options: options
//         });
//         const db = server.plugins['hapi-mongoose'].connection;
//
//         const mongoose = server.plugins['hapi-mongoose'].lib;
//         const Schema = mongoose.Schema;
//     };
// }
// module.exports = Mongo;

var Mongoose = require('mongoose');
//load database
const mongoConfig = global.CONFIG['mongo'];
Mongoose.connect(`mongodb://${mongoConfig.hosts}/${mongoConfig.database}`, {useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false});
var Mongo = Mongoose.connection;
Mongo.on('error', console.error.bind(console, 'connection error'));
Mongo.once('open', function callback() {
    console.log('Connection with database succeeded.');
});
exports.Mongo = Mongo;