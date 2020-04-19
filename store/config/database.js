module.exports = {
    [process.env.MONGO_GLOBAL_NAME]: {
        'type': 'mongodb',
        'logTag': process.env.MONGO_LOG_TAG,
        'credentials': {
            'uri': process.env.MONGO_URI,
            'host': process.env.MONGO_HOST,
            'port': process.env.MONGO_PORT,
            'user': process.env.MONGO_USERNAME,
            'password': process.env.MONGO_PASSWORD,
            'database': process.env.MONGO_DATABASE
        }
    }
};
