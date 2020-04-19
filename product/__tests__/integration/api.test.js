const launcher = require('../../engine/launcher');
const Factory = require('../factory/index');

describe('Api', () => {
    let server;
    let factory;

    beforeAll(async () => {
        server = await launcher.init();

        factory = new Factory('product');

        await factory.launch();
    });

    afterAll(async () => {
        await server.stop();
    });

    it('It should return success if found router', async () => {
        const response = await server.inject('/');

        expect(response.statusCode).toBe(200);
        expect(response.result.status).toBe('running');
        expect(response.result.service).toBe('product');
    });

    it('It should return error if not found route', async () => {
        const response = await server.inject('/ERROR_ROUTE');

        expect(response.statusCode).toBe(404);
    });

    it('It should create one product with success', async () => {
        const product = factory.build({ 'sold': undefined });

        const response = await server.inject({
            'method': 'POST',
            'url': '/products',
            'payload': product
        });

        expect(response.statusCode).toBe(200);
        expect(response.result.length).not.toBe(null);
        expect(response.result).toHaveProperty('_id');
    });

    it('It should report message if param on create product is invalid', async () => {
        const product = factory.build({ 'sold': undefined });
        const fields = Object.keys(product);

        const promises = fields.map(field => {
            const payload = { ...product };

            delete payload[field];

            return server.inject({
                'method': 'POST',
                'url': '/products',
                'payload': payload
            });
        });

        const resolves = await Promise.all(promises);
        const results = resolves.map((res, index) => {
            return [res.result, fields[index]];
        });

        results.forEach(([result, field]) => {
            expect(result.statusCode).toBe(400);
            expect(result.message).toBe(`"${field}" is required`);
        });
    });

    it('It should return all products by store', async () => {
        const pagination = { 'total': 23, 'limitPerPage': 10, 'currentPage': 1 };
        const storeId = factory.db.ObjectId();

        await factory.createMany(pagination.total, { 'store': storeId });

        const response = await server.inject({
            'method': 'GET',
            'url': `/products/stores/${storeId}?` +
                `page=${pagination.currentPage}&limit=${pagination.limitPerPage}`
        });

        expect(response.statusCode).toBe(200);
        expect(response.result).toHaveProperty('count', pagination.total);
        expect(response.result).toHaveProperty('rows');
        expect(response.result.rows.length).toBe(pagination.limitPerPage);
    });

    it('It should update product with success', async () => {
        const product = await factory.create();

        const dataToUpdate = {
            'description': 'Camiseta Top',
            'price': 29.90
        };

        const response = await server.inject({
            'method': 'PUT',
            'url': `/products/${product._id}`,
            'payload': dataToUpdate
        });

        expect(response.statusCode).toBe(200);
        expect(response.result).toHaveProperty('description', dataToUpdate.description);
        expect(response.result).toHaveProperty('price', dataToUpdate.price);
    });

    it('It should remove product with success', async () => {
        const product = await factory.create();

        const response = await server.inject({
            'method': 'DELETE',
            'url': `/products/${product._id}`
        });

        expect(response.statusCode).toBe(200);
        expect(response.result.message).toBe('Removed with success');
    });

    it('It should report error if not exists product on delete product', async () => {
        const idFake = factory.db.ObjectId();

        const response = await server.inject({
            'method': 'DELETE',
            'url': `/products/${idFake}`
        });

        expect(response.statusCode).toBe(200);
        expect(response.result.message).toBe('Error to delete product');
    });
});
