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

    it('It should report message erro if param on payload is invalid', async () => {
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
            expect(result.message).toBe(`"${field}" is required`);
        });
    });
});
