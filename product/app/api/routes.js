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
        'path': '/products/stores/{store}',
        'method': 'GET',
        'handler': handler.getProducts,
        'config': {
            'description': 'Get Default',
            'validate': {
                'query': joi.object({
                    'page': joi.number().integer().optional(),
                    'limit': joi.number().integer().optional()
                }),
                'params': joi.object({
                    'store': joi.string().regex(/^[0-9a-fA-F]{24}$/)
                })
            }
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
    },
    {
        'path': '/products/{product}',
        'method': 'PUT',
        'handler': handler.updateProduct,
        'config': {
            'description': 'Get Default',
            'validate': {
                'params': joi.object({
                    'product': joi.string().regex(/^[0-9a-fA-F]{24}$/)
                }),
                'payload': joi.object({
                    'store': joi.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
                    'title': joi.string().optional(),
                    'description': joi.string().optional(),
                    'price': joi.number().optional(),
                    'quantity': joi.number().integer().min(1).optional(),
                    'pictures': joi.array().items(joi.object({
                        'source': joi.string().uri().optional(),
                        'order': joi.number().integer().optional()
                    })).min(1).optional()
                })
            }
        }
    }
];
