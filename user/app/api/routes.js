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
    }
];
