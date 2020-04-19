const bunyan = require('bunyan');
const config = require('../config/logger');
const fs = require('fs');
const env = process.env.NODE_ENV;

let rotatingLogger = null;

function logger() {

    // Create log folder
    if (!fs.existsSync(config.core_logging.folder)) {

        if (env !== 'test' || env !== 'development') {
            fs.mkdirSync(config.core_logging.folder);
        }
    }

    if (!rotatingLogger) rotatingLogger = bunyan.createLogger(config.core_logging.options);

    if (env === 'test') rotatingLogger.level(bunyan.FATAL + 1);

    return rotatingLogger;
}

module.exports = logger();
