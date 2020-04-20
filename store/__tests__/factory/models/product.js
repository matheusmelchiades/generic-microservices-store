const faker = require('faker');

module.exports = {
    'build': ObjectId => ({
        '_id': ObjectId(),
        'title': faker.commerce.productName(),
        'description': faker.lorem.paragraph(),
        'store': ObjectId(),
        'price': parseFloat(faker.commerce.price()),
        'quantity': faker.random.number(6) + 1,
        'sold': faker.random.number(6) + 1,
        'pictures': new Array(faker.random.number(11) + 1).fill().map((_, id) => ({
            'source': faker.image.imageUrl(),
            'order': id + 1
        }))
    })
};
