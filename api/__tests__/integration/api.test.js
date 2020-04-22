const userMoxios = require('moxios');
const storeMoxios = require('moxios');
const productMoxios = require('moxios');
const launcher = require('../../engine/launcher');
const userService = require('../../app/services/user');
const storeService = require('../../app/services/store');
const productService = require('../../app/services/product');
const helper = require('../helper');
const mock = require('../mock');

describe('Api', () => {
    let server;

    beforeAll(async () => {
        server = await launcher.init();
    });

    beforeEach(() => {
        userMoxios.install(userService.api);
        storeMoxios.install(storeService.api);
        productMoxios.install(productService.api);
    });

    afterEach(() => {
        storeMoxios.uninstall(storeService.api);
        userMoxios.uninstall(userService.api);
        productMoxios.uninstall(productService.api);
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

        userMoxios.stubRequest('/users', {
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

        userMoxios.stubRequest('/users', {
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

        userMoxios.stubRequest('/users', {
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

    it('It should signin with success', async () => {
        const user = { 'username': 'matheus', 'password': 'qwer1234' };

        userMoxios.stubRequest('/authenticate', {
            'status': 200,
            'responseText': {
                'status': 'success',
                'message': 'User authenticate with success',
                'payload': {
                    '_id': '5e9fb24a95dd02001da4dc73',
                    'username': 'matheus'
                }
            }
        });

        const response = await server.inject({
            'url': '/signin',
            'method': 'POST',
            'payload': user
        });

        expect(response.statusCode).toBe(200);
        expect(response.result).toHaveProperty('token');
    });

    it('It should report error if user not exists on login', async () => {
        const user = { 'username': 'matheus', 'password': 'qwer1234' };

        userMoxios.stubRequest('/authenticate', {
            'status': 200,
            'responseText': {
                'status': 'error',
                'message': 'Credentials invalids'
            }
        });

        const response = await server.inject({
            'url': '/signin',
            'method': 'POST',
            'payload': user
        });

        expect(response.statusCode).toBe(401);
        expect(response.result).toHaveProperty('error', 'Unauthorized');
        expect(response.result).toHaveProperty('message', 'Credentials invalids');
    });

    it('It should user create a store with success', async () => {
        const user = { '_id': '5e9fb24a95dd02001da4dc73', 'username': 'matheus' };
        const store = {
            '_id': '5e9fe6dfabf982001dbfd947',
            'companyName': 'Teste Stores',
            'owner': '5e9fb24a95dd02001da4dc73'
        };

        const token = await helper.getToken(server, userMoxios, user);

        storeMoxios.stubRequest('/stores', {
            'status': 200,
            'responseText': { ...store, 'owner': user._id }
        });

        userMoxios.stubRequest(`/users/${user._id}/stores/${store._id}`, {
            'status': 200,
            'responseText': {
                'status': 'success',
                'message': 'Associate owner with success'
            }
        });

        const response = await server.inject({
            'url': '/stores',
            'method': 'POST',
            'headers': {
                'authorization': token
            },
            'payload': {
                'companyName': store.companyName,
                'owner': store.owner
            }
        });

        expect(response.statusCode).toBe(200);
        expect(response.result).toHaveProperty('message', 'Created store with success');
    });

    it('It should add a product to catalog', async () => {
        const user = mock.user();
        const store = mock.store();
        const token = await helper.getToken(server, userMoxios, user);

        storeMoxios.stubRequest(`/stores/${store._id}/products`, {
            'status': 200,
            'responseText': {
                'message': 'Add products with success'
            }
        });

        const response = await server.inject({
            'url': '/stores/products',
            'method': 'POST',
            'headers': {
                'authorization': token
            },
            'payload': {
                'store': store._id,
                'products': mock.products(5)
            }
        });

        expect(response.statusCode).toBe(200);
        expect(response.result).toHaveProperty('message', 'Add products with success');
    });

    it('It should update a product with success', async () => {
        const user = mock.user();
        const product = mock.product();
        const token = await helper.getToken(server, userMoxios, user);

        productMoxios.stubRequest(`/products/${product._id}`, {
            'status': 200,
            'responseText': product
        });

        const response = await server.inject({
            'url': `/products/${product._id}`,
            'method': 'PUT',
            'headers': {
                'authorization': token
            },
            'payload': {
                'title': 'UPDATED'
            }
        });

        expect(response.statusCode).toBe(200);
        expect(response.result).toHaveProperty('message', 'Updated with success');
    });

    it('It should delete a product with success', async () => {
        const user = mock.user();
        const product = mock.product();
        const token = await helper.getToken(server, userMoxios, user);

        productMoxios.stubRequest(`/products/${product._id}`, {
            'status': 200,
            'responseText': {
                'message': 'Removed with success'
            }
        });

        const response = await server.inject({
            'url': `/products/${product._id}`,
            'method': 'DELETE',
            'headers': {
                'authorization': token
            }
        });

        expect(response.statusCode).toBe(200);
        expect(response.result).toHaveProperty('message', 'Removed with success');

    });

    it('It should report error on delete a product', async () => {
        const user = mock.user();
        const product = mock.product();
        const token = await helper.getToken(server, userMoxios, user);

        productMoxios.stubRequest(`/products/${product._id}`, {
            'status': 200,
            'responseText': {
                'message': 'Error to delete product'
            }
        });

        const response = await server.inject({
            'url': `/products/${product._id}`,
            'method': 'DELETE',
            'headers': {
                'authorization': token
            }
        });

        expect(response.statusCode).toBe(200);
        expect(response.result).toHaveProperty('message', 'Error to delete product');
    });

    it('It should return all products available', async () => {
        const user = mock.user();
        const store = mock.store();
        const products = mock.products(5, { store });
        const token = await helper.getToken(server, userMoxios, user);
        const responseMock = {
            'count': 20,
            'rows': products.slice(0, 5)
        };

        productMoxios.stubRequest(`/products/stores/${store._id}?page=1&limit=5&filter=available`, {
            'status': 200,
            'responseText': responseMock
        });

        const response = await server.inject({
            'url': `/products/stores/${store._id}?page=1&limit=5&filter=available`,
            'method': 'GET',
            'headers': {
                'authorization': token
            }
        });

        expect(response.statusCode).toBe(200);
        expect(response.result).toHaveProperty('count', 20);
        expect(response.result).toHaveProperty('rows');
        expect(response.result.rows.length).toBe(5);
    });

    it('It should return list of products', async () => {
        const user = mock.user();
        const store = mock.store();
        const products = mock.products(5, { store });
        const token = await helper.getToken(server, userMoxios, user);
        const responseMock = {
            'count': 20,
            'rows': products.slice(0, 5)
        };

        productMoxios.stubRequest(`/products/stores/${store._id}?page=1&limit=5`, {
            'status': 200,
            'responseText': responseMock
        });

        const response = await server.inject({
            'url': `/products/stores/${store._id}?page=1&limit=5`,
            'method': 'GET',
            'headers': {
                'authorization': token
            }
        });

        expect(response.statusCode).toBe(200);
        expect(response.result).toHaveProperty('count', 20);
        expect(response.result).toHaveProperty('rows');
        expect(response.result.rows.length).toBe(5);
    });
});
