const jwt = require('jsonwebtoken');
require('dotenv').config();

function auth(successCallback, failureCallback) {
    return (req, res, next) => {
        const Access_Secret = process.env.JWT_SECRET_ACCESS;
        
        try {
            const token = req.cookies.token;
            const decoded = jwt.verify(token, Access_Secret);
            req.user = decoded;
            successCallback(req, res, next);
        } catch (error) {
            failureCallback(req, res, next);
        }
    };
}

module.exports = auth;