module.exports.createUserResponse = user => {

    return {
        '_id': user._id,
        'username': user.username,
        'password': user.password
    };
};
