const configDb = require('../../config/database');
const handlers = require('./handlers');
const logger = require('../../engine/logger');

async function createConnection(dbconf) {

    try {

        let DatabaseConnection = null;

        logger.info(`${dbconf.logTag} :: CREATING Connection :: ${dbconf.name} :: TYPE :: ${dbconf.type}`);

        DatabaseConnection = handlers[dbconf.type];

        if (DatabaseConnection) {

            DatabaseConnection = new DatabaseConnection(dbconf.credentials);

            logger.info(`${dbconf.logTag} :: CREATED INSTANCE    :: ${dbconf.name} :: TYPE :: ${dbconf.type}`);

            await DatabaseConnection.open();

            logger.info(`${dbconf.logTag} :: CONNECTED SUCCESS   :: ${dbconf.name} :: TYPE :: ${dbconf.type}`);

            return DatabaseConnection;
        }

        throw Error('Database type not found!!!');
    } catch (error) {
        logger.info(`${dbconf.logTag} :: ERROR ON ${dbconf.name}_DB :: ${error.message} :: TYPE :: ${dbconf.type}`);
        process.exit();
    }
}

function loadConnections() {

    return Object.entries(configDb).map(([name, config]) => {

        return new Promise(resolve => {

            if (name && config.credentials.host) {

                createConnection({ ...config, name }).then(connection => {

                    return resolve({ name, connection });
                });

            }

            return resolve({});
        });
    });
}

module.exports.connect = async () => {
    const connectionsPromises = loadConnections();
    const connections = await Promise.all(connectionsPromises);

    if (!global.databases) {
        global.databases = {};
    }

    connections.forEach(({ name, connection }) => {
        global.databases[name] = connection;
    });
};
