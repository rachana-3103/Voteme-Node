
const usersController = require('./controllers/users_controller');
const pollsController = require('./controllers/polls_controller');
const inviteesController = require('./controllers/invitees_controller');
const categoryController = require('./controllers/categories_controller');

class Routes {
    constructor(server) {
        // Users APIs
        server.route({method: 'POST', path: '/voteme/signup', config: { auth: false },handler: (request, h) =>usersController.votemeSignUp(request, h)});
        server.route({method: 'GET', path: '/voteme/users', handler: (request, h) => usersController.getUsers(request, h)});
        server.route({method: 'POST',path:'/voteme/logout',handler:(request,h) => usersController.logout(request, h)})

        server.route({method: 'GET', path: '/voteme/{id}/profile', handler: (request, h) => usersController.getProfile(request, h)});
        server.route({method: 'PUT', path: '/voteme/{id}/profile',
            config: {
                payload: {
                    allow: 'multipart/form-data',
                    maxBytes: 209715200,
                    output: 'file',
                    parse: true
                }
            }, handler: (request, h) => usersController.updateProfile(request, h)});
        server.route({method: 'DELETE', path: '/voteme/{id}/delete', handler: (request, h) => usersController.deleteUserProfile(request, h)});
        server.route({method: 'PUT', path: '/voteme/updateusercategory',handler: (request, h) => usersController.updateUserCategory(request, h)});

        // Polls APIs
        server.route({method: 'POST', path: '/voteme/createpoll',
            config: {
                payload: {
                    allow: 'multipart/form-data',
                    maxBytes: 250000000,
                    output: 'file',
                    parse: true
                }
        },handler: (request, h) => pollsController.createPoll(request, h)});
        server.route({method: 'PUT', path: '/voteme/editquery/{id}', 
             config: {
                payload: {
                    allow: 'multipart/form-data',
                    maxBytes: 250000000,
                    output: 'file',
                    parse: true
                }
            },handler: (request, h) => pollsController.updatePoll(request, h)});

         
        server.route({method: 'GET', path: '/voteme/query', handler: (request, h) => pollsController.getQuery(request, h)});
        server.route({method: 'GET', path: '/voteme/myquery', handler: (request, h) => pollsController.getMyQuery(request, h)});
        
        server.route({method: 'POST', path: '/voteme/givevote', handler: (request, h) => pollsController.giveVote(request, h)});
        server.route({method: 'GET', path: '/voteme/querydetail/{id}', handler: (request, h) => pollsController.getQueryDetailById(request, h)});
        server.route({method: 'DELETE', path: '/voteme/deletequery/{id}', handler: (request, h) => pollsController.deleteQuery(request, h)});
        server.route({method: 'POST', path: '/voteme/{queryid}/likeordislike',handler: (request, h) => pollsController.querylikeordislike(request, h)});
        server.route({method: 'GET', path: '/voteme/{queryid}/likeordislike', handler: (request, h) => pollsController.getQueryLikeOrDislike(request, h)});
        server.route({method: 'GET', path: '/voteme/{queryid}/queryview/{viewedby}', handler: (request, h) => pollsController.viewQuery(request, h)});
        // Invitees APIs
        server.route({method: 'POST', path: '/voteme/{id}/invitee', handler: (request, h) => inviteesController.votemeInvitee(request, h)});
        server.route({method: 'GET', path: '/voteme/getinvitee', handler: (request, h) => inviteesController.getInvitee(request, h)});

        //category
        server.route({method: 'POST', path: '/voteme/createcategory', 
        config: {
                payload: {
                    allow: 'multipart/form-data',
                    maxBytes: 209715200,
                    output: 'file',
                    parse: true
                }
            }, handler: (request, h) => categoryController.createCategory(request, h)});
        server.route({method: 'PUT', path: '/voteme/updatecategory/{categoryid}', 
        config: {
                payload: {
                    allow: 'multipart/form-data',
                    maxBytes: 209715200,
                    output: 'file',
                    parse: true
                }
            }, handler: (request, h) => categoryController.updateCategory(request, h)});
        server.route({method: 'GET', path: '/voteme/category', handler: (request, h) => categoryController.getCategory(request, h)});
        //comments
        server.route({method: 'POST', path: '/voteme/{id}/createComments',handler: (request, h) => pollsController.createComments(request, h)});
        server.route({method: 'POST', path: '/voteme/{queryid}/comment/{commentid}/likeordislike',handler: (request, h) => pollsController.commentslikeordislike(request, h)});
        server.route({method: 'POST', path: '/voteme/{queryid}/comment/{commentid}/reply',handler: (request, h) => pollsController.commentReply(request, h)});
        server.route({method: 'GET', path: '/voteme/{queryid}/getComments',handler: (request, h) => pollsController.getComments(request, h)});
        server.route({method: 'GET', path: '/voteme/{queryid}/comment/{commentid}/reply',handler:(request,h) => pollsController.getCommentReply(request, h) });
        server.route({method: 'DELETE', path: '/voteme/{queryid}/comment/{commentid}', handler: (request, h) => pollsController.deleteComment(request, h)});

        server.route({method: 'POST', path: '/dropDatabase', handler: (request, h) => pollsController.dropDatabase(request, h)});
    }
}
module.exports = Routes;
