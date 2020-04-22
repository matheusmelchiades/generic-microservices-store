const model = require('./model');
const boom = require('boom');
const logger = require('../../engine/logger');

module.exports.signup = async (request, h) => {

    try {
        const { payload } = request;

        const response = await model.signup(payload);

        return h.response(response);
    } catch (err) {
        logger.error(err.message);

        if (boom.isBoom(err)) return err;

        return boom.internal();
    }
};

module.exports.signin = async (request, h) => {

    try {
        const { payload } = request;

        const response = await model.signin(payload);

        return h.response(response);
    } catch (err) {
        logger.error(err.message);

        if (boom.isBoom(err)) return err;

        return boom.internal();
    }
};
