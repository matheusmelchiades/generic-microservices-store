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
    }
];
