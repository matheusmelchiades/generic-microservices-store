const userService = require('../services/user');
const crypto = require('../../helper/crypto');
const boom = require('boom');

module.exports.signup = async user => {

    const response = await userService.createUser(user);

    if (response.data.status === 'error') {
        return {
            'message': response.data.message
        };
    }

    if (response.data.status === 'success') {
        return {
            'token': crypto.encrypt(JSON.stringify(response.data.payload))
        };
    }

    throw boom.badData('your data is bad and you should feel bad');
};
