const dao = require('./dao');

module.exports.createProduct = async product => {

    product.sold = 0;

    const productDb = await dao.insertProduct(product);

    return productDb;
};
