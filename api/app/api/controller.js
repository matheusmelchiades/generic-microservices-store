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

module.exports.createStore = async (request, h) => {

    try {
        const { payload, user } = request;

        const response = await model.createStore(user, payload);

        return h.response(response);
    } catch (err) {
        logger.error(err.message);

        if (boom.isBoom(err)) return err;

        return boom.internal();
    }
};

module.exports.addProducts = async (request, h) => {

    try {
        const { store, products } = request.payload;

        const response = await model.addProducts(store, products);

        return h.response(response);
    } catch (err) {
        logger.error(err.message);

        if (boom.isBoom(err)) return err;

        return boom.internal();
    }
};

module.exports.updateProduct = async (request, h) => {

    try {
        const { producId } = request.params;
        const { payload } = request;

        const response = await model.updateProduct(producId, payload);

        return h.response(response);
    } catch (err) {
        logger.error(err.message);

        if (boom.isBoom(err)) return err;

        return boom.internal();
    }
};

module.exports.deleteProduct = async (request, h) => {

    try {
        const { producId } = request.params;

        const response = await model.deleteProduct(producId);

        return h.response(response);
    } catch (err) {
        logger.error(err.message);

        if (boom.isBoom(err)) return err;

        return boom.internal();
    }
};

module.exports.getProducts = async (request, h) => {

    try {
        const { store } = request.params;
        const { page, limit, filter } = request.query;

        const response = await model.getProducts(store, {
            page, limit, filter
        });

        return h.response(response);
    } catch (err) {
        logger.error(err.message);

        if (boom.isBoom(err)) return err;

        return boom.internal();
    }
};
