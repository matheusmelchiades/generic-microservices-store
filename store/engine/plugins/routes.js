const glob = require('glob');
const Boom = require('boom');
const chalk = require('chalk');
const joi = require('@hapi/joi');

const defaultRoute = {
    'method': 'GET',
    'handler': (_, h) => h.response(Boom.notImplemented()),
    'config': {
        'auth': false,
        'plugins': {
            'policies': []
        },
        'tags': ['api'],
        'validate': {
            'failAction': process.env.NODE_ENV === 'development' ? (_, __, err) => err : null
        }
    }
};

const globOptions = {
    'nodir': true,
    'strict': true
};

const OPTIONS_DEFAULT = {
    'routes': []
};

function register(server, options = OPTIONS_DEFAULT) {

    options.routes
        .map(route => glob.sync(route, globOptions))
        .flat()
        .forEach(filePath => {
            let routes = null;

            try {
                // eslint-disable-next-line global-require
                routes = require(filePath);

                routes.forEach(r => {
                    r = { ...defaultRoute, ...r };

                    const route = {
                        ...defaultRoute,
                        ...r,
                        'config': {
                            ...defaultRoute.config,
                            ...r.config,
                            'plugins': {
                                ...defaultRoute.config.plugins,
                                ...r.config.plugins
                            },
                            'validate': {
                                ...defaultRoute.config.validate,
                                ...r.config.validate
                            }
                        }
                    };

                    if (route.config.auth) {
                        route.config.validate = route.config.validate || {};

                        route.config.validate.headers = joi.object({
                            'authorization': joi.string().description('JWT token')
                        }).unknown();
                    }

                    const isLogRoute = route.config.tags.some(tag => tag === 'log');

                    if (isLogRoute && process.env.LOG_ROUTES !== 'visible') return route;

                    server.route(route);

                    server.log(['startup', 'route-load'], `${chalk.green(route.method)} ${route.path}`);

                    return route;
                });
            } catch (error) {
                let err;

                if (routes && routes.length) {
                    const route = routes.pop();

                    err = `${chalk.red(route.method)} ${route.path} ${error.message}`;
                } else err = chalk.red(error.message);

                server.log(['startup', 'route-load', 'error'], err);
            }
        });
}

module.exports = {
    'name': 'Routes',
    'version': '1.0.0',
    register
};
