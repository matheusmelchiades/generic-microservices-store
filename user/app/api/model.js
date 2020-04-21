const dao = require('./dao');
const factory = require('./factories');

module.exports.createUser = async user => {

    const userDb = await dao.createUser(user);

    return factory.createUserResponse(userDb);
};
