module.exports.user = assign => {
    return {
        '_id': '5e9fb24a95dd02001da4dc73',
        'username': 'matheus',
        ...assign
    };
};

module.exports.users = (length = 0, assign = {}) => {

    return new Array(length).fill({}).map(() => ({
        '_id': '5e9fb24a95dd02001da4dc73',
        'username': 'matheus',
        ...assign
    }));
};

module.exports.product = (assign = {}) => {

    return {
        'store': '5e9fe6dfabf982001dbfd947',
        'title': 'Camiseta Vermelha',
        'description': 'Camiseta vermelha top',
        'price': 69.9,
        'quantity': 9,
        'pictures': [
            {
                'source': 'http://lorempixel.com/640/480',
                'order': 1
            },
            {
                'source': 'http://lorempixel.com/640/480',
                'order': 2
            }
        ],
        'sold': 0,
        '_id': '5e9fe4f05c0562001d83b560',
        ...assign
    };
};

module.exports.products = (length = 0, assign = {}) => {

    return new Array(length).fill({}).map(() => ({
        'store': '5e9fe6dfabf982001dbfd947',
        'title': 'Camiseta Vermelha',
        'description': 'Camiseta vermelha top',
        'price': 69.9,
        'quantity': 9,
        'pictures': [
            {
                'source': 'http://lorempixel.com/640/480',
                'order': 1
            },
            {
                'source': 'http://lorempixel.com/640/480',
                'order': 2
            }
        ],
        'sold': 0,
        '_id': '5e9fe4f05c0562001d83b560',
        ...assign
    }));
};

module.exports.store = (assign = {}) => {

    return {
        '_id': '5e9fe6dfabf982001dbfd947',
        'companyName': 'Teste Stores',
        'owner': '5e9fb24a95dd02001da4dc73',
        ...assign
    };
};
