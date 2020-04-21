const Factory = require('../factory/index');
const factories = require('../../app/api/factories');

describe('Factories', () => {
    let factory;

    beforeAll(() => {
        factory = new Factory('user');
    });

    it('It should return only properties implemented on factory create user', () => {
        const user = factory.build();

        const userResponse = factories.createUserResponse(user);

        expect(userResponse).toHaveProperty('_id');
        expect(userResponse).toHaveProperty('username', user.username);
        expect(userResponse).toHaveProperty('password', user.password);
    });

    it('it Should report if fields not return on factory create user', () => {
        const user = { ...factory.build(), 'errorField': '' };

        const userResponse = factories.createUserResponse(user);

        expect(userResponse).not.toHaveProperty('errorField');
    });
});
