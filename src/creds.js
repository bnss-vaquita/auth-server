const crypto = require('crypto');

const gen_salt = () => {
    return crypto.randomBytes(16).toString('hex');
}

const sha256 = (password, salt) => {
    let hash = crypto.createHmac('sha256', salt);
    hash.update(password);
    let value = hash.digest('hex');
    return {
        salt:salt,
        passwordHash:value
    };
}

const verify = (username, password, db) => {
    console.log(username);
    if (db.has(username)) {
        const userCreds = db.get(username);
        console.log(userCreds);
        const creds = sha256(password, userCreds.salt);
        console.log(creds.passwordHash);
        console.log(userCreds.passwordHash);
        if (creds.passwordHash === userCreds.passwordHash) {
            return true;
        }
    }
    return false;
}

exports.sha256 = sha256;
exports.verify = verify;
exports.gen_salt = gen_salt;
