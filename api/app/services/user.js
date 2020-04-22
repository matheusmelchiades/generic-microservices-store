const config = require('../../config/services').user;
const axios = require('axios');

const api = axios.create({
    'baseURL': config.host
});

module.exports.api = api;

module.exports.createUser = payload => {

    return api({
        'url': '/users',
        'method': 'POST',
        'data': payload
    });
};
