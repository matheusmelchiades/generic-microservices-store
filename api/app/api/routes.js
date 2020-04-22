const handler = require('./controller');
const joi = require('@hapi/joi');

module.exports = [
    {
        'path': '/',
        'method': 'GET',
        'handler': () => ({
            'service': 'api',
            'status': 'running'
        }),
        'config': {
            'description': 'Get Default'
        }
    },
    {
        'path': '/signup',
        'method': 'POST',
        'handler': handler.signup,
        'config': {
            'description': 'Get Default',
            'validate': {
                'payload': joi.object({
                    'username': joi.string().required(),
                    'password': joi.string().required()
                })
            }
        }
    },
    {
        'path': '/signin',
        'method': 'POST',
        'handler': handler.signin,
        'config': {
            'description': 'Get Default',
            'validate': {
                'payload': joi.object({
                    'username': joi.string().required(),
                    'password': joi.string().required()
                })
            }
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
                })
            },
            'plugins': {
                'policies': ['isAuth']
            }
        }
    },
    {
        'path': '/stores/products',
        'method': 'POST',
        'handler': handler.addProducts,
        'config': {
            'description': 'Get Default',
            'validate': {
                'payload': joi.object({
                    'store': joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
                    'products': joi.array().required()
                })
            }
        }
    }
];
