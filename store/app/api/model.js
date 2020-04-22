const db = global.databases[process.env.MONGO_GLOBAL_NAME];
const dao = require('./dao');

module.exports.createStore = async store => {
    let storeDb;

    storeDb = await dao.findStore(store, { 'catalog': false });

    if (!storeDb) {
        storeDb = await dao.createStore(store);
    }

    return storeDb;
};

module.exports.addProducts = async (storeId, products) => {

    const storeDb = await dao.getStoreById(storeId);

    if (storeDb && storeDb.catalog && storeDb.catalog.status === 'pending') {
        const { catalog } = storeDb;

        if (catalog.products && catalog.products.length) {

            catalog.products = catalog.products.filter(product => {
                return !products.find(p => db.ObjectId(p._id).equals(product._id));
            });

            catalog.products = [...catalog.products, ...products];

        } else {
            catalog.products = products;
        }

        await dao.updateCatalog(storeId, catalog);

        return { 'message': 'Add products with success' };
    }

    return {};
};

module.exports.removeProduct = async (store, product) => {
    const storeDb = await dao.getStoreById(store);
    const removed = await dao.removeProduct(store, product);

    if (removed.catalog.products.length >= storeDb.catalog.products.length) {

        return {
            'status': 'error',
            'message': 'Anyone product removed'
        };
    }

    return {
        'status': 'success',
        'message': 'Removed with success'
    };
};

module.exports.getProducts = async ({ store, pagination }) => {

    const [catalog] = await dao.getProducts({ store, pagination });

    return catalog || {};
};
