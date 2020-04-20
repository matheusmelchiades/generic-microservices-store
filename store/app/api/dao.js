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

module.exports.getProducts = ({ store, pagination }) => {
    const currentPage = pagination.page - 1 > 0 ? pagination.page - 1 : 0;
    const limit = parseInt(pagination.limit);
    const skip = parseInt(currentPage) * parseInt(limit);

    const pipeline = [
        { '$match': { '_id': db.ObjectId(store) } },
        {
            '$project': {
                'companyName': '$companyName',
                'total': { '$size': '$catalog.products' },
                'records': '$catalog.products'
            }
        },
        {
            '$addFields': {
                'products': { '$slice': ['$records', skip, limit] }
            }
        },
        { '$project': { '_id': 0, 'records': 0 } }
    ];

    return db.aggregate(collection, pipeline);
};
