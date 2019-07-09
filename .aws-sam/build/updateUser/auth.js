const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var bcrypt = require('bcryptjs'); //encrypt passwords and things
var config = require('./config');

module.exports = async (auth) => {
    try {
        let token = auth
        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length); // Remove Bearer from string

        }
        const decoded = jwt.verify(token, config.SECRET);
        return decoded;
    } catch (err) {
        return null;
    }
}