const model = require('./model');
const boom = require('boom');
const logger = require('../../engine/logger');

module.exports.createUser = async (request, h) => {

    try {
        const { payload } = request;

        const response = await model.createUser(payload);

        return h.response(response);
    } catch (err) {
        logger.error(err.message);

        return boom.internal();
    }
};

module.exports.createStore = async (request, h) => {

    try {
        const { user, store } = request.params;

        const response = await model.createStore(user, store);

        return h.response(response);
    } catch (err) {
        console.log(err);
        logger.error(err.message);

        return boom.internal();
    }
};

module.exports.authenticate = async (request, h) => {

    try {
        const { payload } = request;

        const response = await model.authenticate(payload);

        return h.response(response);
    } catch (err) {
        console.log(err);
        logger.error(err.message);

        return boom.internal();
    }
};

module.exports.getRoles = async (request, h) => {

    try {
        const { user } = request.params;

        const response = await model.getRoles(user);

        return h.response(response);
    } catch (err) {
        console.log(err);
        logger.error(err.message);

        return boom.internal();
    }
};
