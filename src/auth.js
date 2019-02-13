const creds = require('./creds');
const Dao = require('./dao');
const fs   = require('fs');
const jwt = require('jsonwebtoken');
const uuidv4 = require('uuid/v4');

// Init values from env or use defaults
const ISSUER = process.env.ISSUER || 'dev-auth-server';
const EXP = process.env.EXP || '1h';
const priv_key = fs.readFileSync(__dirname + '/../secrets/private.pem');

// Init the user db with a default
const user_db = new Dao( new Map() );
const _usr_credentials = {
    uuid: uuidv4(),
    ...creds.sha256('password', creds.gen_salt())
};
user_db.set('test', _usr_credentials);

// Init the client db with a default
const client_db = new Dao( new Map() );
const _clnt_credentials = creds.sha256('secret', creds.gen_salt());
client_db.set('test_client', _clnt_credentials);

const signOptions = (sub, aud) => (
    {
        issuer: ISSUER,
        subject: sub,
        audience: aud,
        expiresIn: EXP,
        algorithm: 'RS256'
    });

const payload = () => (
    {
        jti: uuidv4(),
        token_type: 'bearer',
    });

// Evaluate the password grant
const eval_pass_grant = (request) => {
    const audience = request.audience || 'dev_resource_server',
        client_id = request.client_id,
        client_secret = request.client_secret,
        username = request.username,
        password = request.password;

    return new Promise((resolve, reject) => {
        if (client_id && client_secret && username && password) {
            if (!creds.verify(client_id, client_secret, client_db)) {
                reject('INVALID_CLIENT_CREDS');
            }
            if (!creds.verify(username, password, user_db)) {
                reject('INVAlID_USER_CREDS');
            }
            if (audience != 'dev_resource_server') {
                reject('INVALID_AUDIENCE');
            }
            const user = user_db.get(username);
            const token = jwt.sign(
                payload(), priv_key,
                signOptions(user.uuid, audience)
            );
            resolve(token)

        } else {
            reject('INVALID_REQUEST');
        }
    });
}

exports.auth = (request) =>
    new Promise( (resolve, reject) => {
        switch (request.grant_type){
            case 'password':
                eval_pass_grant(request)
                    .then((token) => resolve(token))
                    .catch((reason) => {
                        reject(reason);
                    });
                break;
            default:
                reject('INVALID_GRANT_TYPE');
        }
    });
