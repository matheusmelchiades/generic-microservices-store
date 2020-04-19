const good = require('good');
const inert = require('@hapi/inert');
const vision = require('@hapi/vision');

// PLUGINS
const routes = require('./routes');

// OPTIONS
const goodOptions = require('../../config/logger').good;

function getPlugins() {
    const plugins = [];

    // DEPENDENCIES
    plugins.push(inert);
    plugins.push(vision);

    // LOGGER
    plugins.push({
        'plugin': good,
        'options': goodOptions
    });

    // ROUTES
    plugins.push({
        'plugin': routes,
        'options': {
            'routes': [`${process.cwd()}/app/api/**/*routes.js`]
        }
    });

    return plugins;
}

module.exports = server => {
    const AllPlugins = getPlugins();

    const promises = AllPlugins.map(plugin => server.register(plugin));

    return Promise.all(promises);
};
