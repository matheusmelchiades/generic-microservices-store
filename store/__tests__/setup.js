const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();

module.exports = async () => {
    process.env.MONGO_PORT = await mongod.getPort();
    process.env.MONGO_DATABASE = await mongod.getDbName();
};
