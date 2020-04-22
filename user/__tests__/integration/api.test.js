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
        expect(response.result).toHaveProperty('status', 'success');
        expect(response.result).toHaveProperty('message', 'User created with success');
        expect(response.result.payload).toHaveProperty('_id');
        expect(response.result.payload).toHaveProperty('username', user.username);
        expect(response.result.payload).not.toHaveProperty('stores');
    });

    it('It should report error if username already in use', async () => {
        const user = {
            'username': 'usertest',
            'password': 'qwer1234'
        };

        await factory.create(user);

        const response = await server.inject({
            'url': '/users',
            'method': 'POST',
            'payload': user
        });

        expect(response.statusCode).toBe(200);
        expect(response.result).toHaveProperty('status', 'error');
        expect(response.result).toHaveProperty('message', 'Username already in use');
    });

    it('It should create store as owner with success', async () => {
        const user = await factory.create({ 'stores': [] });
        const storeId = factory.db.ObjectId();

        const response = await server.inject({
            'url': `/users/${user._id}/stores/${storeId}`,
            'method': 'POST'
        });

        expect(response.statusCode).toBe(200);
        expect(response.result).toHaveProperty('status', 'success');
        expect(response.result).toHaveProperty('message', 'Associate owner with success');

        const query = { 'stores.store': storeId };
        const project = { 'stores': true };
        const userDb = await db.findOne(collection, query, project);

        expect(userDb).not.toBe(null);
        expect(userDb.stores[0]).toHaveProperty('store', storeId);
        expect(userDb.stores[0]).toHaveProperty('role', 'owner');
    });

    it('It should report error if create store that already created', async () => {
        const storeId = factory.db.ObjectId();
        const user = await factory.create({
            'stores': [{ 'store': storeId, 'role': 'owner' }]
        });

        const response = await server.inject({
            'url': `/users/${user._id}/stores/${storeId}`,
            'method': 'POST'
        });

        expect(response.statusCode).toBe(200);
        expect(response.result).toHaveProperty('status', 'error');
        expect(response.result).toHaveProperty('message', 'You already created this store');
    });

    it('It should authenticate with success user', async () => {
        const user = {
            'username': 'matheus',
            'password': 'qwer1234'
        };

        const userMock = await factory.create(user);

        const response = await server.inject({
            'url': '/authenticate',
            'method': 'POST',
            'payload': user
        });

        expect(response.statusCode).toBe(200);
        expect(response.result).toHaveProperty('status', 'success');
        expect(response.result).toHaveProperty('message', 'User authenticate with success');
        expect(response.result.payload).toHaveProperty('_id', userMock._id);
        expect(response.result.payload).toHaveProperty('username', userMock.username);
        expect(response.result.payload).not.toHaveProperty('password');
        expect(response.result.payload).toHaveProperty('stores');

        response.result.payload.stores.forEach(item => {
            expect(item).toHaveProperty('store');
            expect(item).toHaveProperty('role');
        });
    });

    it('It should return all roles of stores by user', async () => {
        const storeId = factory.db.ObjectId();
        const user = await factory.create({
            'stores': [{ 'store': storeId, 'role': 'owner' }]
        });

        const response = await server.inject({
            'url': `/users/${user._id}/roles`,
            'method': 'GET'
        });

        expect(response.statusCode).toBe(200);
        expect(response.result).toHaveProperty('status', 'success');
        expect(response.result).toHaveProperty('message', 'Get roles with success');
        expect(response.result.payload).toHaveProperty(storeId.toString(), 'owner');
    });
});
