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
