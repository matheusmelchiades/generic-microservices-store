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
    }
];
