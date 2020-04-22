module.exports.getToken = async (server, moxios, user = {}) => {
    const userSample = {
        '_id': '5e9fb24a95dd02001da4dc73',
        'username': 'matheus',
        'password': 'qwer1234',
        ...user
    };

    moxios.stubRequest('/authenticate', {
        'status': 200,
        'responseText': {
            'status': 'success',
            'message': 'User authenticate with success',
            'payload': userSample
        }
    });

    const response = await server.inject({
        'url': '/signin',
        'method': 'POST',
        'payload': {
            'username': userSample.username,
            'password': userSample.password
        }
    });

    return response.result.token;
};
