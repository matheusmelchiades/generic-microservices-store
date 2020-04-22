const boom = require('boom');
const userService = require('../services/user');
const logger = require('../../engine/logger');

function extractStoreId(request) {

    if (request.payload && request.payload.store) {
        return request.payload.store;
    }

    if (request.params && request.params.store) {
        return request.params.store;
    }

    return null;
}

async function hasPermission(request, h) {

    try {
        const { user } = request;
        const storeToAccess = extractStoreId(request);

        if (storeToAccess) {
            const { data } = await userService.getRoles(user._id);

            if (data.payload[storeToAccess] === 'owner') {

                return h.continue;
            }
        }

        return boom.illegal('you are not permitted to view this resource for legal reasons');
    } catch (err) {
        logger.error(err.message);

        return boom.unauthorized();
    }
}

hasPermission.applyPoint = 'onPreHandler';

module.exports = hasPermission;
