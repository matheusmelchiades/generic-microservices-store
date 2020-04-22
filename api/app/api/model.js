const userService = require('../services/user');
const crypto = require('../../helper/crypto');
const boom = require('boom');

function handlesRequest(data) {

    if (data.status === 'error') {
        return {
            'message': data.message
        };
    }

    if (data.status === 'success') {

        return {
            'token': crypto.encrypt(JSON.stringify(data.payload))
        };
    }

    throw boom.badData('your data is bad and you should feel bad');
}

module.exports.signup = async user => {

    const response = await userService.createUser(user);

    return handlesRequest(response.data);
};

module.exports.signin = async user => {

    const response = await userService.authenticate(user);

    if (response.data.status === 'error') {
        throw boom.unauthorized(response.data.message);
    }

    return handlesRequest(response.data);
};
