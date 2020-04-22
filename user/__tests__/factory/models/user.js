const faker = require('faker');

module.exports = {
    'collection': 'users',
    'build': ObjectId => ({
        'username': faker.internet.userName(),
        'password': faker.internet.password(),
        'stores': new Array(faker.random.number(5) + 1).fill().map(() => ({
            'store': ObjectId(),
            'role': 'owner'
        }))
    })
};
