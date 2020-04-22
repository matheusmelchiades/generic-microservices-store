const handler = require('./controller');
const joi = require('@hapi/joi');

module.exports = [
    {
        'path': '/',
        'method': 'GET',
        'handler': () => ({
            'service': 'user',
            'status': 'running'
        }),
        'config': {
            'description': 'Get Default'
        }
    },
    {
        'path': '/users',
        'method': 'POST',
        'handler': handler.createUser,
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
        'path': '/users/{user}/stores/{store}',
        'method': 'POST',
        'handler': handler.createStore,
        'config': {
            'description': 'Get Default',
            'validate': {
                'params': joi.object({
                    'user': joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
                    'store': joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
                })
            }
        }
    },
    {
        'path': '/authenticate',
        'method': 'POST',
        'handler': handler.authenticate,
        'config': {
            'description': 'Get Default',
            'validate': {
                'payload': joi.object({
                    'username': joi.string().required(),
                    'password': joi.string().required()
                })
            }
        }
    }
];
