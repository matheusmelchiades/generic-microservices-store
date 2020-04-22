const dao = require('./dao');
const factory = require('./factories');
const { ObjectId } = global.databases[process.env.MONGO_GLOBAL_NAME];

module.exports.createUser = async user => {

    const hasUser = await dao.findUserByUsername(user.username);

    if (!hasUser) {
        const userDb = await dao.createUser(user);

        return {
            'status': 'success',
            'message': 'User created with success',
            'payload': factory.createUserResponse(userDb)
        };
    }

    return factory.response('error', 'Username already in use');
};

module.exports.createStore = async (userId, storeId) => {

    const userDb = await dao.findUserById(userId);

    if (userDb) {
        if (userDb.stores) {
            const hasStore = userDb.stores.find(item => {
                return ObjectId(item.store).equals(storeId);
            });

            if (hasStore) {

                return factory.response('error', 'You already created this store');
            }
        }

        await dao.addStore(userId, { storeId, 'role': 'owner' });
    }

    return factory.response('success', 'Associate owner with success');
};

module.exports.authenticate = async ({ username, password }) => {

    const userDb = await dao.findUserByUsername(username);

    if (userDb && userDb.password === password) {
        const userResponse = factory.responseUserAuth(userDb);

        return factory.response('success', 'User authenticate with success', userResponse);
    }

    return factory.response('error', 'Credentials invalids');
};
