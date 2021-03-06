const model = require('./model');
const boom = require('boom');
const logger = require('../../engine/logger');

module.exports.createStore = async (request, h) => {

    try {
        const { payload } = request;

        const response = await model.createStore(payload);

        return h.response(response);
    } catch (err) {
        logger.error(err.message);

        return boom.internal();
    }
};

module.exports.addProducts = async (request, h) => {

    try {
        const { store } = request.params;
        const { products } = request.payload;

        const response = await model.addProducts(store, products);

        return h.response(response);
    } catch (err) {
        logger.error(err.message);

        return boom.internal();
    }
};

module.exports.removeProduct = async (request, h) => {

    try {
        const { store, product } = request.params;

        const response = await model.removeProduct(store, product);

        return h.response(response);
    } catch (err) {
        logger.error(err.message);

        return boom.internal();
    }
};

module.exports.getProducts = async (request, h) => {

    try {
        const { store } = request.params;
        const { page = 1, limit = 5 } = request.query;


        const response = await model.getProducts({
            store,
            'pagination': { page, limit }
        });

        return h.response(response);
    } catch (err) {
        logger.error(err.message);

        return boom.internal();
    }
};
