const launcher = require('../../engine/launcher');
const Factory = require('../factory/index');

describe('Main', () => {
    let server;
    let factory;

    beforeAll(async () => {
        server = await launcher.init();

        factory = new Factory('user');

        await factory.launch();
    });

    afterAll(async () => {
        await server.stop();
    });

    it('It should return success if found router', async () => {
        const response = await server.inject('/');

        expect(response.statusCode).toBe(200);
        expect(response.result.status).toBe('running');
        expect(response.result.service).toBe('user');
    });

    it('It should return error if not found route', async () => {
        const response = await server.inject('/ERROR_ROUTE');

        expect(response.statusCode).toBe(404);
    });

    it('It should create an user with success', async () => {
        const user = {
            'username': 'usertest',
            'password': 'qwer1234'
        };

        const response = await server.inject({
            'url': '/users',
            'method': 'POST',
            'payload': user
        });

        expect(response.statusCode).toBe(200);
        expect(response.result).toHaveProperty('_id');
        expect(response.result).toHaveProperty('username', user.username);
        expect(response.result).toHaveProperty('password', user.password);
    });
});
