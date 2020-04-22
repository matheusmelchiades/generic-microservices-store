/** @type {import('../../engine/dao/handlers/Mongo')} */
const db = global.databases[process.env.MONGO_GLOBAL_NAME];

const collection = 'users';

module.exports.createUser = payload => {
    const sample = {
        'stores': [],
        ...payload
    };

    return db.insertOne(collection, sample);
};

module.exports.findUserByUsername = username => {
    const query = { 'username': username };

    return db.findOne(collection, query);
};

module.exports.findUserById = id => {
    const query = {
        '_id': db.ObjectId(id)
    };

    return db.findOne(collection, query);
};

module.exports.addStore = (user, store) => {
    const query = { '_id': db.ObjectId(user) };
    const update = {
        '$push': {
            'stores': {
                'store': db.ObjectId(store.storeId),
                'role': store.role
            }
        }
    };

    return db.updateOne(collection, query, update);
};
