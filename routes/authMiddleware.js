const jwt = require('jsonwebtoken');
require('dotenv').config();

function authenticate(successCallback, failureCallback) {
    return (req, res, next) => {
        const Access_Secret = process.env.JWT_SECRET_ACCESS;

        try {
            jwt.verify(req.cookies.token, Access_Secret);
            successCallback(req, res, next);
        } catch (error) {
            failureCallback(req, res, next);
        }
    };
}

module.exports = authenticate;