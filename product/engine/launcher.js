const Hapi = require('@hapi/hapi');
const config = require('../config/server');
const database = require('./dao/dbFactory');
const logger = require('./logger');
const loadPlugins = require('./plugins/index');

async function launch() {
    try {
        await database.connect();

        const server = Hapi.server(config);

        await loadPlugins(server);

        return server;
    } catch (err) {
        logger.error(`Error in launch server: ${err.message}`);
    }
}

exports.init = async () => {
    try {
        const server = await launch();

        await server.initialize();

        return server;
    } catch (err) {
        logger.error(`Error in start server: ${err.message}`);
    }
};

exports.start = async () => {
    try {
        const server = await launch();

        await server.start();

        logger.info(`Server running at: ${server.info.uri}`);
    } catch (err) {
        logger.error(`Error in start server: ${err.message}`);
    }
};

process.on('unhandledRejection', () => {
    process.exit(1);
});
