module.exports.buildFilter = filter => {
    const query = {};

    switch (filter) {

        case 'available':
            query.$expr = { '$lt': ['$sold', '$quantity'] };
            break;

        default: break;
    }

    return query;
};
