const launcher = require('../../engine/launcher');
const Factory = require('../factory/index');

describe('Main', () => {
    let server;
    let factory;
    let db;
    const collection = 'users';

    beforeAll(async () => {
        server = await launcher.init();

        factory = new Factory('user');

        await factory.launch();

        db = global.databases[process.env.MONGO_GLOBAL_NAME];
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

    it('It should create store as owner with success', async () => {
        const user = await factory.create();
        const storeId = factory.db.ObjectId();

        const response = await server.inject({
            'url': `/users/${user._id}/stores/${storeId}`,
            'method': 'POST'
        });

        expect(response.statusCode).toBe(200);
        expect(response.result).toHaveProperty('status', 'success');
        expect(response.result).toHaveProperty('message', 'Associate owner with success');

        const query = { 'stores.role': { '$eq': 'owner' } };
        const project = { 'stores': true };
        const userDb = await db.findOne(collection, query, project);

        expect(userDb).not.toBe(null);
        expect(userDb.stores[0]).toHaveProperty('store', storeId);
        expect(userDb.stores[0]).toHaveProperty('role', 'owner');
    });
});
