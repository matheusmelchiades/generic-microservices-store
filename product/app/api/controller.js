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
        const { page = 1, limit = 5 } = request.query;

        const response = await model.getProducts({
            store,
            'pagination': { 'page': page, limit }
        });

        return h.response(response);
    } catch (err) {
        logger.error(err.message);

        return boom.internal();
    }
};
