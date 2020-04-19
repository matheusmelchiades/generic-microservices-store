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
    }
];
