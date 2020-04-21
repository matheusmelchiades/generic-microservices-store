/** @type {import('../../engine/dao/handlers/Mongo')} */
const db = global.databases[process.env.MONGO_GLOBAL_NAME];

const collection = 'users';

module.exports.createUser = payload => {

    return db.insertOne(collection, payload);
};
