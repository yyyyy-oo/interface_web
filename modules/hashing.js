const bcrypt = require('bcrypt');
const crypto = require('crypto');

const saltRounds = 10;

function hashPassword(plainPassword) {
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(plainPassword, salt);

    return { salt, hashedPassword };
}

function verifyPassword(salt, plainPassword) {
    const hashedPassword = bcrypt.hashSync(plainPassword, salt);

    return hashedPassword;
}

function generateKeyPair() {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    });
    return { publicKey, privateKey };
}

function encrypt(text, publicKey) {
    const encryptedData = crypto.publicEncrypt(publicKey, Buffer.from(text));
    return encryptedData.toString('base64');
}

function decrypt(encryptedData, privateKey) {
    const decryptedData = crypto.privateDecrypt(privateKey, Buffer.from(encryptedData, 'base64'));
    return decryptedData.toString();
}

module.exports = { hashPassword, verifyPassword, generateKeyPair, encrypt, decrypt };
