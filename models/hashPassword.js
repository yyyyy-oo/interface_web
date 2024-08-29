const crypto = require('crypto');

async function hashPassword(plainPassword) {
    const salt = crypto.randomBytes(16).toString('hex');
    const iterations = 37518;
    const keyLength = 64;

    try {
        const hashedPassword = await new Promise((resolve, reject) => {
            crypto.pbkdf2(plainPassword, salt, iterations, keyLength, 'sha512', (err, derivedKey) => {
                if (err) reject(err);
                resolve(derivedKey.toString('hex'));
            });
        });

        return { salt, hashedPassword };
    } catch (error) {
        throw new Error('Error hashing password');
    }
}

async function verifyHash(salt, plainPassword) {
    const iterations = 37518;
    const keyLength = 64;

    try {
        const hashedPassword = await new Promise((resolve, reject) => {
            crypto.pbkdf2(plainPassword, salt, iterations, keyLength, 'sha512', (err, derivedKey) => {
                if (err) reject(err);
                resolve(derivedKey.toString('hex'));
            });
        });

        return hashedPassword;
    } catch (error) {
        throw new Error('Error verifying hash');
    }
}

module.exports = { hashPassword, verifyHash };
