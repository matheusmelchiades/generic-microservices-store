const dao = require('./dao');
const factory = require('./factories');

module.exports.createUser = async user => {

    const userDb = await dao.createUser(user);

    return factory.createUserResponse(userDb);
};

module.exports.createStore = async (userId, storeId) => {

    const userDb = await dao.findUserById(userId);

    if (userDb) {

        if (userDb.stores) {
            const hasStore = userDb.find(item => {
                return storeId === item.store;
            });

            if (hasStore) {

                return {
                    'status': 'error',
                    'message': 'You already created this store'
                };
            }
        }

        await dao.addStore(userId, { storeId, 'role': 'owner' });
    }

    return { 'status': 'success', 'message': 'Associate owner with success' };
};
