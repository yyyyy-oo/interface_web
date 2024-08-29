const crypto = require('crypto');

const iterations = 30513;
const keyLength = 64;

function hashPassword(plainPassword) {
    if (typeof plainPassword !== 'string') { throw new TypeError('Password must be a string') };

    const salt = crypto.randomBytes(16).toString('hex');
    const derivedKey = crypto.pbkdf2Sync(plainPassword, salt, iterations, keyLength, 'sha512');
    const hashedPassword = derivedKey.toString('hex');

    return { salt, hashedPassword };
}

function verifyHash(salt, plainPassword) {
    if (typeof plainPassword !== 'string') { throw new TypeError('Password must be a string') };
    if (typeof salt !== 'string') { throw new TypeError('Salt must be a string') }

    const derivedKey = crypto.pbkdf2Sync(plainPassword, salt, iterations, keyLength, 'sha512');
    const hashedPassword = derivedKey.toString('hex');

    return hashedPassword;
}

module.exports = { hashPassword, verifyHash };
