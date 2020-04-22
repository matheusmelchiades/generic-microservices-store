module.exports.createUserResponse = user => {

    return {
        '_id': user._id,
        'username': user.username
    };
};

module.exports.response = (typeStatus, content, payload = {}) => {

    return {
        'status': typeStatus,
        'message': content,
        'payload': payload
    };
};


module.exports.responseUserAuth = user => {

    return {
        '_id': user._id,
        'username': user.username
    };
};
