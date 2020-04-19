/* eslint-disable array-element-newline*/
/* eslint-disable multiline-ternary */
const bunyan = require('bunyan');

const LOG_FOLDER = './logs';

const noTest = process.env.NODE_ENV !== 'test';
const noDevelopment = process.env.NODE_ENV !== 'development';

const logsArgsConsole = {
    'log': '*',
    'response': '*',
    'request': '*',
    'request-internal': '*'
};

module.exports = {
    // Logging settings
    'core_logging': {
        // Destination folder
        'folder': `${LOG_FOLDER}`,

        // Bunyan options
        'options': {
            // Log reference
            'name': 'core',

            'serializers': bunyan.stdSerializers,

            // Output streams
            'streams': [
                noTest
                    ? {
                        'stream': process.stdout,
                        'level': 'debug'
                    }
                    : false,
                // File output
                noTest && noDevelopment
                    ? {
                        'type': 'rotating-file',
                        'period': '1d',
                        'count': 365,
                        'path': `${LOG_FOLDER}/api.${process.pid}.log`,
                        'level': bunyan.DEBUG
                    }
                    : false
            ].filter(log => Boolean(log)),
            'createFile': noTest && noDevelopment
        }
    },
    'good': {
        'reporters': noTest ? {
            'console': [
                {
                    'module': 'good-squeeze',
                    'name': 'Squeeze',
                    'args': [logsArgsConsole]
                },
                {
                    'module': 'good-console',
                    'args': [
                        {
                            'format': 'HH:mm:ss DD.MM.YYYY'
                        }
                    ]
                },
                noTest && 'stdout'
            ],
            'file': noTest && noDevelopment ? [
                {
                    'module': 'good-squeeze',
                    'name': 'Squeeze',
                    'args': [logsArgsConsole]
                },
                {
                    'module': 'good-squeeze',
                    'name': 'SafeJson'
                },
                {
                    'module': 'rotating-file-stream',
                    'args': [
                        'http-logs', {
                            'interval': '1d',
                            'compress': true,
                            'path': './logs'
                        }
                    ]
                }
            ] : []
        } : {}
    }
};
