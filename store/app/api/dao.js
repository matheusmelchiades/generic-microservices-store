/** @type {import('../../engine/dao/handlers/Mongo')} */
const db = global.databases[process.env.MONGO_GLOBAL_NAME];

const collection = 'stores';

function setObjectId(item) {
    return {
        ...item,
        '_id': db.ObjectId(item._id)
    };
}

module.exports.createStore = payload => {

    return db.insertOne(collection, payload);
};

module.exports.getStoreById = id => {
    const query = { '_id': db.ObjectId(id) };

    return db.findOne(collection, query);
};

module.exports.updateCatalog = (store, catalog) => {
    const query = { '_id': db.ObjectId(store) };
    const update = {
        '$set': {
            'catalog': {
                ...catalog,
                'products': catalog.products.map(setObjectId)
            }
        }
    };

    return db.updateOne(collection, query, update);
};

module.exports.removeProduct = (store, product) => {
    const query = { '_id': db.ObjectId(store) };
    const update = {
        '$pull': {
            'catalog.products': {
                '_id': db.ObjectId(product)
            }
        }
    };

    return db.updateOne(collection, query, update);
};
