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
    }
];
