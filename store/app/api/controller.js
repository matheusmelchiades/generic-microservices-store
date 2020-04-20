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
