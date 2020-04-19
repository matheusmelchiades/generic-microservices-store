module.exports.buildFilter = filter => {
    const query = {};

    switch (filter) {

        case 'available':
            query.$expr = { '$eq': ['$quantity', '$sold'] };
            break;

        default: break;
    }

    return query;
};
