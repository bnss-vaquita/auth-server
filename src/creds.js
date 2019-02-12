const crypto = require('crypto');
const db = new Map(
    [[
        'kristian', {
            salt:           'asdgnasldkgjasldgkj',
            passwordHash:   '5d76ae93d484a5b3e5d2cfa8168887b173e6d1b9584f047c518b644cab5ebb69',
        }
    ]]
);

const sha256 = (password, salt) => {
    let hash = crypto.createHmac('sha256', salt);
    hash.update(password);
    let value = hash.digest('hex');
    return {
        salt:salt,
        passwordHash:value
    };
}

const verify = (username, password) => {
    if (db.has(username)) {
        const userCreds = db.get(username);
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
