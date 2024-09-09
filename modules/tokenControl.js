const jwt = require('jsonwebtoken');
require('dotenv').config();

const Refresh_Secret = process.env.JWT_SECRET_REFRESH;
const Access_Secret = process.env.JWT_SECRET_ACCESS;


function generateAccessToken(id) {
    const payload = { type: 'JWT', userid: id };
    const option = { expiresIn: '10m', issuer: 'InterFace' };
    const acctoken = jwt.sign(payload, Access_Secret, option);

    return acctoken;
}

function auth(req, res, next) {
    const token = req.cookies.token;
    req.isAuthenticated = false;

    if (token) {
        try {
            jwt.verify(token, Access_Secret);
            req.isAuthenticated = true;
        } catch (err) {
            req.isAuthenticated = false;
        }
    }
    next();
}


module.exports = { generateAccessToken, auth };