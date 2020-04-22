const factories = require('../../app/api/factories');

describe('Factories', () => {

    it('It should return only properties implemented on factory create user', () => {
        const user = {
            'username': 'matheus',
            'password': 'FuckPassword'
        };

        const userResponse = factories.createUserResponse(user);

        expect(userResponse).toHaveProperty('_id');
        expect(userResponse).toHaveProperty('username', user.username);
        expect(userResponse).toHaveProperty('password', user.password);
    });

    it('it Should report if fields not return on factory create user', () => {
        const user = {
            'username': 'matheus',
            'password': 'FuckPassword',
            'errorField': ''
        };

        const userResponse = factories.createUserResponse(user);

        expect(userResponse).not.toHaveProperty('errorField');
    });

    it('it should validate factory response with field and values valid', () => {
        const fakeResponse = {
            'status': 'FAKE',
            'message': 'FAKE'
        };

        const response = factories.response(fakeResponse.status, fakeResponse.message);

        expect(response).toHaveProperty('status', fakeResponse.status);
        expect(response).toHaveProperty('message', fakeResponse.message);
    });
});
