const crypto = require('crypto-js');
const fs = require('fs');
const authConfig = require('../config/auth');

const privateKey = fs.readFileSync(`${process.cwd()}/config/keys/${authConfig.private_key}`, 'utf-8');

module.exports.encrypt = payload => {

    return crypto.DES.encrypt(payload, privateKey).toString();
};

module.exports.decrypt = payload => {

    const bytes = crypto.DES.decrypt(payload, privateKey);

    return bytes.toString(crypto.enc.Utf8);
};
