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

module.exports.authenticate = payload => {

    return api({
        'url': '/authenticate',
        'method': 'POST',
        'data': payload
    });
};

module.exports.createStore = (userID, storeId) => {

    return api({
        'url': `/users/${userID}/stores/${storeId}`,
        'method': 'POST'
    });
};

