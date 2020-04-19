const dao = require('./dao');

module.exports.createProduct = async product => {

    product.sold = 0;

    const productDb = await dao.insertProduct(product);

    return productDb;
};

module.exports.getProducts = async ({ store, pagination }) => {

    const products = await dao.getProductsByStore({ store, pagination });

    if (products.count && products.rows) return products;

    return {};
};

module.exports.updateProduct = async (product, payload) => {

    const productDb = await dao.updateProduct({ 'id': product, payload });

    if (productDb) return productDb;

    return {};
};

module.exports.deleteProduct = async product => {

    const productDeleted = await dao.deleteProduct(product);

    if (!productDeleted) return { 'message': 'Error to delete product' };

    return { 'message': 'Removed with success' };
};
