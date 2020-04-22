const model = require('./model');
const boom = require('boom');
const logger = require('../../engine/logger');

module.exports.createProduct = async (request, h) => {

    try {
        const { payload } = request;

        const response = await model.createProduct(payload);

        return h.response(response);
    } catch (err) {
        logger.error(err.message);

        return boom.internal();
    }
};

module.exports.getProducts = async (request, h) => {

    try {
        const { store } = request.params;
        const { page = 1, limit = 5, filter } = request.query;

        const response = await model.getProducts({
            store,
            filter,
            'pagination': { 'page': page, limit }
        });

        return h.response(response);
    } catch (err) {
        logger.error(err.message);

        return boom.internal();
    }
};

module.exports.updateProduct = async (request, h) => {

    try {
        const { product } = request.params;
        const { payload } = request;

        const response = await model.updateProduct(product, payload);

        return h.response(response);
    } catch (err) {
        logger.error(err.message);

        return boom.internal();
    }
};

module.exports.deleteProduct = async (request, h) => {

    try {
        const { product } = request.params;

        const response = await model.deleteProduct(product);

        return h.response(response);
    } catch (err) {
        logger.error(err.message);

        return boom.internal();
    }
};

module.exports.getProductById = async (request, h) => {

    try {
        const { product } = request.params;

        const response = await model.getProductById(product);

        return h.response(response);
    } catch (err) {
        logger.error(err.message);

        return boom.internal();
    }
};

