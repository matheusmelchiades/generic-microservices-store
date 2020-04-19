/** @type {import('../../engine/dao/handlers/Mongo')} */
const db = global.databases[process.env.MONGO_GLOBAL_NAME];

const queries = require('./queries');
const collection = 'products';

module.exports.insertProduct = payload => {

    return db.insertOne(collection, payload);
};
