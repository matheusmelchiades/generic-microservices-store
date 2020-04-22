const boom = require('boom');
const crypto = require('../../helper/crypto');

function isAuth(request, h) {

    const token = request.headers.authorization;

    if (token) {
        const user = crypto.decrypt(token);

        if (user && user.includes('_id')) {

            request.user = JSON.parse(user);

            return h.continue;
        }
    }

    return boom.unauthorized();
}

isAuth.applyPoint = 'onPreHandler';

module.exports = isAuth;
