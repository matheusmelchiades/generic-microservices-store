require('dotenv').config({
    'path': process.env.NODE_ENV ? `.${process.env.NODE_ENV}.env` : '.env'
});

module.exports = {
    'host': process.env.HOST || '0.0.0.0',
    'port': process.env.PORT || 5000,
    'routes': {
        'cors': {
            'origin': ['*']
        }
    }
};
