/** @type {import('../../engine/dao/handlers/Mongo')} */
const db = global.databases[process.env.MONGO_GLOBAL_NAME];

const queries = require('./queries');
const collection = 'products';

module.exports.insertProduct = payload => {

    return db.insertOne(collection, payload);
};

module.exports.getProductsByStore = ({ store, filter, pagination }) => {
    const query = {
        'store': store,
        ...queries.buildFilter(filter)
    };

    return db.findPagination(collection, query, {}, pagination);
};

module.exports.updateProduct = ({ id, payload }) => {
    const query = { '_id': db.ObjectId(id) };
    const update = { '$set': payload };

    return db.updateOne(collection, query, update, { 'upsert': true });
};

module.exports.deleteProduct = async id => {
    const query = { '_id': db.ObjectId(id) };

    const { deletedCount } = await db.deleteOne(collection, query);

    return Boolean(deletedCount);
};
