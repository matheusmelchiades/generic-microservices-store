const faker = require('faker');

module.exports = {
    'collection': 'stores',
    'build': ObjectId => ({
        '_id': ObjectId(),
        'companyName': faker.company.companyName(),
        'owner': ObjectId(),
        'catalog': {
            '_id': ObjectId(),
            'status': ['pending', 'approved'][faker.random.number(1)],
            'products': []
        }
    })
};
