const moxios = require('moxios');
const launcher = require('../../engine/launcher');
const userService = require('../../app/services/user');

describe('Api', () => {
    let server;

    beforeAll(async () => {
        server = await launcher.init();
    });

    beforeEach(() => {
        moxios.install(userService.api);
    });

    afterEach(() => {
        moxios.uninstall(userService.api);
    });

    afterAll(async () => {
        await server.stop();
    });

    it('It should return success if found router', async () => {
        const response = await server.inject('/');

        expect(response.statusCode).toBe(200);
        expect(response.result.status).toBe('running');
        expect(response.result.service).toBe('api');
    });

    it('It should return error if not found route', async () => {
        const response = await server.inject('/ERROR_ROUTE');

        expect(response.statusCode).toBe(404);
    });

    it('It should signup with success', async () => {
        const user = { 'username': 'matheus', 'password': 'qwer1234' };

        moxios.stubRequest('/users', {
            'status': 200,
            'responseText': {
                'status': 'success',
                'payload': user
            }
        });

        const response = await server.inject({
            'url': '/signup',
            'method': 'POST',
            'payload': user
        });

        expect(response.statusCode).toBe(200);
        expect(response.result).toHaveProperty('token');
    });

    it('It should report error if user already created', async () => {
        const user = { 'username': 'matheus', 'password': 'qwer1234' };
        const messageError = 'Error message';

        moxios.stubRequest('/users', {
            'status': 200,
            'responseText': {
                'status': 'error',
                'message': messageError
            }
        });

        const response = await server.inject({
            'url': '/signup',
            'method': 'POST',
            'payload': user
        });

        expect(response.statusCode).toBe(200);
        expect(response.result).toHaveProperty('message', messageError);
    });

    it('It should report error if user already created', async () => {
        const user = { 'username': 'matheus', 'password': 'qwer1234' };

        moxios.stubRequest('/users', {
            'status': 200,
            'responseText': {
                'status': 'STATUS_FAKE'
            }
        });

        const response = await server.inject({
            'url': '/signup',
            'method': 'POST',
            'payload': user
        });

        expect(response.statusCode).toBe(422);
        expect(response.result).toHaveProperty('error', 'Unprocessable Entity');
        expect(response.result).toHaveProperty('message', 'your data is bad and you should feel bad');
    });
});
