/** @type {import('../../engine/dao/handlers/Mongo')} */
const db = global.databases[process.env.MONGO_GLOBAL_NAME];

const collection = 'products';

module.exports.insertProduct = payload => {

    return db.insertOne(collection, payload);
};

module.exports.getProductsByStore = ({ store, pagination }) => {
    const query = {
        'store': store
    };

    return db.findPagination(collection, query, {}, pagination);
};

module.exports.updateProduct = ({ id, payload }) => {
    const query = { '_id': db.ObjectId(id) };
    const update = { '$set': payload };

    return db.updateOne(collection, query, update, { 'upsert': true });
};
