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
