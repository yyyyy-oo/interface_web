const jwt = require('jsonwebtoken');
require('dotenv').config();

const Refresh_Secret = process.env.JWT_SECRET_REFRESH;
const Access_Secret = process.env.JWT_SECRET_ACCESS;

// authController
function generateRefresh(id) {
    const payload = { type: 'JWT', id: id, iat: Math.floor(Date.now() / 1000) };
    const option = { expiresIn: '7d', issuer: 'InterFace' };
    return jwt.sign(payload, Refresh_Secret, option);
}

// authController
function generateAccess(id) {
    const payload = { type: 'JWT', id: id, iat: Math.floor(Date.now() / 1000) };
    const option = { expiresIn: '5m', issuer: 'InterFace' };
    return jwt.sign(payload, Access_Secret, option);
}

// accContoller, authController
function decode(token) {
    return jwt.verify(token, Access_Secret);
}

// auth, authController
function compare(accessToken, refreshToken) {
    try {
        const decodeRefresh = jwt.verify(refreshToken, Refresh_Secret);
        const decodeAccess = jwt.verify(accessToken, Access_Secret);
        if (decodeAccess.id === decodeRefresh.id) return true;
        else return false;
    } catch (err) {
        return false;
    }
}

module.exports = { generateAccess, generateRefresh, decode, compare };