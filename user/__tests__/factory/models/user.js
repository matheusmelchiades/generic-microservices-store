const faker = require('faker');

module.exports = {
    'collection': 'users',
    'build': ObjectId => ({
        'username': faker.internet.userName(),
        'password': faker.internet.password()
    })
};
