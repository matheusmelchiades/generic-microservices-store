const config = require('../../config/services').store;
const axios = require('axios');

const api = axios.create({
    'baseURL': config.host
});

module.exports.api = api;

module.exports.createStore = payload => {

    return api({
        'url': '/stores',
        'method': 'POST',
        'data': payload
    });
};

module.exports.addProducts = (store, products) => {

    return api({
        'url': `/stores/${store}/products`,
        'method': 'POST',
        'data': { products }
    });
};
