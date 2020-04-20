const handler = require('./controller');
const joi = require('@hapi/joi');

module.exports = [
    {
        'path': '/',
        'method': 'GET',
        'handler': () => ({
            'service': 'store',
            'status': 'running'
        }),
        'config': {
            'description': 'Get Default'
        }
    },
    {
        'path': '/stores',
        'method': 'POST',
        'handler': handler.createStore,
        'config': {
            'description': 'Get Default',
            'validate': {
                'payload': joi.object({
                    'companyName': joi.string().required(),
                    'owner': joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
                }),
                'failAction': (_, __, err) => err
            }
        }
    },
    {
        'path': '/stores/{store}/products',
        'method': 'POST',
        'handler': handler.addProducts,
        'config': {
            'description': 'Get Default',
            'validate': {
                'payload': joi.object({
                    'products': joi.array().items(joi.object({
                        '_id': joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
                        'store': joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
                        'title': joi.string().required(),
                        'description': joi.string().required(),
                        'price': joi.number().required(),
                        'quantity': joi.number().required(),
                        'sold': joi.number().required(),
                        'pictures': joi.array().items(joi.object().keys({
                            'source': joi.string().uri().required(),
                            'order': joi.number().required()
                        }))
                    })).min(1)
                }),
                'failAction': (_, __, err) => err
            }
        }
    },
    {
        'path': '/stores/{store}/products/{product}',
        'method': 'DELETE',
        'handler': handler.removeProduct,
        'config': {
            'description': 'Get Default',
            'validate': {
                'params': joi.object({
                    'store': joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
                    'product': joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
                })
            }
        }
    }
];
