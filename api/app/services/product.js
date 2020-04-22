const config = require('../../config/services').product;
const axios = require('axios');

const api = axios.create({
    'baseURL': config.host
});

module.exports.api = api;

module.exports.updateProduct = (productId, payload) => {

    return api({
        'url': `/products/${productId}`,
        'method': 'PUT',
        'data': payload
    });
};

module.exports.deleteProduct = (productId, payload) => {

    return api({
        'url': `/products/${productId}`,
        'method': 'DELETE',
        'data': payload
    });
};
