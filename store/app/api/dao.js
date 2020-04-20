/** @type {import('../../engine/dao/handlers/Mongo')} */
const db = global.databases[process.env.MONGO_GLOBAL_NAME];

const collection = 'stores';

module.exports.createStore = payload => {

    return db.insertOne(collection, payload);
};

module.exports.getStoreById = id => {
    const query = { '_id': db.ObjectId(id) };

    return db.findOne(collection, query);
};

module.exports.updateCatalog = (store, catalog) => {
    const query = { '_id': db.ObjectId(store) };
    const update = { '$set': { catalog } };

    return db.updateOne(collection, query, update);
};
