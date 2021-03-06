const userService = require('../services/user');
const storeService = require('../services/store');
const productService = require('../services/product');
const crypto = require('../../helper/crypto');
const boom = require('boom');

function handlesRequest(data) {

    if (data.status === 'error') {
        return {
            'message': data.message
        };
    }

    if (data.status === 'success') {
        const { _id, username } = data.payload;

        return {
            'token': crypto.encrypt(JSON.stringify({ _id, username }))
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

module.exports.createStore = async (user, payload) => {
    const storeResponse = await storeService.createStore(payload);

    if (storeResponse && storeResponse.data._id) {

        const userResponse = await userService.createStore(user._id, storeResponse.data._id);

        if (userResponse.data.status === 'success') {

            return { 'message': 'Created store with success' };
        }
    }

    throw boom.badData('Error on create store');
};

module.exports.addProducts = async (store, products) => {
    const response = await storeService.addProducts(store, products);

    return response.data;
};

module.exports.updateProduct = async (productId, payload) => {

    await productService.updateProduct(productId, payload);

    return { 'message': 'Updated with success' };
};

module.exports.deleteProduct = async productId => {

    const response = await productService.deleteProduct(productId);

    return response.data;
};

module.exports.getProducts = async (storeId, query) => {
    const response = await productService.getProducts(storeId, query);

    return response.data;
};

