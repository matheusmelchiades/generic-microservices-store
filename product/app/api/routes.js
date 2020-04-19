const handler = require('./controller');
const joi = require('@hapi/joi');

module.exports = [
    {
        'path': '/',
        'method': 'GET',
        'handler': () => ({
            'service': 'product',
            'status': 'running'
        }),
        'config': {
            'description': 'Get Default'
        }
    },
    {
        'path': '/products',
        'method': 'POST',
        'handler': handler.createProduct,
        'config': {
            'description': 'Get Default',
            'validate': {
                'payload': joi.object({
                    'store': joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
                    'title': joi.string().required(),
                    'description': joi.string().required(),
                    'price': joi.number().required(),
                    'quantity': joi.number().integer().min(1).required(),
                    'pictures': joi.array().items(joi.object({
                        'source': joi.string().uri().required(),
                        'order': joi.number().integer().required()
                    })).min(1).required()
                }),
                'failAction': (_, __, err) => err
            }
        }
    }
];
