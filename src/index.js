const https = require('https');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const auth = require('./auth');
const app = express();
const http_port = 3000;
const https_port = 3443;

const CRT = process.env.CRT_NAME || 'local.auth.crt';
const CA_CRT = process.env.CA_CRT_NAME || 'local.auth.crt';
const HOSTNAME = process.env.HOSTNAME || 'auth.acme';

const options = {
    key: fs.readFileSync(`${__dirname}/../keys/private.pem`),
    cert: fs.readFileSync(`${__dirname}/../keys/${CRT}`),
    requestCert: true,
    rejectUnauthorized: false,
    ca: [ fs.readFileSync(`${__dirname}/../keys/${CA_CRT}`) ]
};

// HTTPS Only
// Will only work if we listen on HTTP
const requireHTTPS = (req, res, next) => {
  if (!req.secure) {
      console.log(`redirect to https://${HOSTNAME}:${https_port}${req.url}`);
      return res.redirect(`https://${HOSTNAME}:${https_port}${req.url}`);
  }
  next();
}

app.use(requireHTTPS);
app.use(bodyParser.json());

app.get('/', (req, res) => {
	const cert = req.connection.getPeerCertificate();
    if(req.client.authorized) {
        res.send(`Hello ${cert.subject.CN}, your certificate was issued by ${cert.issuer.CN}!`)
    }
    else {
        res.send('Access Denied!');
    }
});
app.post('/auth', (req, res) => {
    auth.auth(req.body)
        .then((options) => {
            const file_hash = req.body.file_hash;
            return auth.sign_token({file_hash: file_hash},options);
        })
        .then((token) => {
            const response = {access_token: token};
            res.setHeader('Content-Type', 'application/json');
            res.send(response)
        })
        .catch((reason) => {
            switch (reason) {
                case 'INVAlID_USER_CREDS':
                    res.status(401)
                        .send('Username or Password invalid\n');
                    break;
                default:
                    res.status(400)
                        .send(`${reason}\n`)
            }
        });
});
app.listen(http_port, () => console.log(`Listening on HTTP-port ${http_port}`));
https.createServer(options, app).listen(https_port, () => console.log(`Auth app listening on port ${https_port}`));
