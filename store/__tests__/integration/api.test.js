const launcher = require('../../engine/launcher');
const Factory = require('../factory/index');

describe('Main', () => {
    let server;
    let factory;
    let factoryProduct;

    beforeAll(async () => {
        server = await launcher.init();

        factory = new Factory('store');
        factoryProduct = new Factory('product');

        await factory.launch();
        await factoryProduct.launch();
    });

    afterAll(async () => {
        await server.stop();
    });

    it('It should return success if found router', async () => {
        const response = await server.inject('/');

        expect(response.statusCode).toBe(200);
        expect(response.result.status).toBe('running');
        expect(response.result.service).toBe('store');
    });

    it('It should return error if not found route', async () => {
        const response = await server.inject('/ERROR_ROUTE');

        expect(response.statusCode).toBe(404);
    });

    it('It should create store with success', async () => {
        const owner = factory.db.ObjectId();
        const response = await server.inject({
            'url': '/stores',
            'method': 'POST',
            'payload': { 'companyName': 'South Sytem', owner }
        });

        expect(response.statusCode).toBe(200);
        expect(response.result).toHaveProperty('_id');
    });

    it('It should report error if param payload is invalid on create store', async () => {
        const store = factory.build({ '_id': undefined, 'catalog': undefined });
        const fields = Object.keys(store);

        const promises = fields.map(field => {
            const payload = { ...store };

            delete payload[field];

            return server.inject({
                'method': 'POST',
                'url': '/stores',
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

    it('It should add products with success to catalog', async () => {
        const products = factoryProduct.buildMany(2);
        const store = await factory.create({
            '_id': factory.db.ObjectId(),
            'catalog': { '_id': factory.db.ObjectId(), 'status': 'pending', 'products': [products[0]] }
        });

        const response = await server.inject({
            'url': `/stores/${store._id}/products`,
            'method': 'POST',
            'payload': { products }
        });

        expect(response.statusCode).toBe(200);
        expect(response.result).toHaveProperty('message', 'Add products with success');
    });

    it('It should return success on remove product of catalog', async () => {
        const product = factoryProduct.build();
        const products = factoryProduct.buildMany(10);
        const store = await factory.create({
            '_id': factory.db.ObjectId(),
            'catalog': {
                '_id': factory.db.ObjectId(),
                'status': 'pending',
                'products': [...products, product]
            }
        });

        const response = await server.inject({
            'url': `/stores/${store._id}/products/${product._id}`,
            'method': 'DELETE'
        });

        expect(response.statusCode).toBe(200);
        expect(response.result).toHaveProperty('status', 'success');
        expect(response.result).toHaveProperty('message', 'Removed with success');
    });

    it('It should report error if not remove product', async () => {
        const product = factoryProduct.build();
        const products = factoryProduct.buildMany(10);
        const store = await factory.create({
            '_id': factory.db.ObjectId(),
            'catalog': {
                '_id': factory.db.ObjectId(),
                'status': 'pending',
                'products': products
            }
        });

        const response = await server.inject({
            'url': `/stores/${store._id}/products/${product._id}`,
            'method': 'DELETE'
        });

        expect(response.statusCode).toBe(200);
        expect(response.result).toHaveProperty('status', 'error');
        expect(response.result).toHaveProperty('message', 'Anyone product removed');
    });

    it('It should return all products in catalog', async () => {
        const pagination = { 'limit': 5 };
        const products = factoryProduct.buildMany(10);
        const store = await factory.create({
            '_id': factory.db.ObjectId(),
            'catalog': {
                '_id': factory.db.ObjectId(),
                'status': 'pending',
                'products': products
            }
        });

        const response = await server.inject({
            'method': 'GET',
            'url': `/stores/${store._id}/products`
        });

        expect(response.statusCode).toBe(200);
        expect(response.result).toHaveProperty('companyName', store.companyName);
        expect(response.result).toHaveProperty('total', products.length);
        expect(response.result).toHaveProperty('products');
        expect(response.result.products.length).toBe(pagination.limit);
    });
});
