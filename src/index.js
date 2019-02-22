const express = require('express');
const bodyParser = require('body-parser');
const auth = require('./auth');
const app = express();
const port = 3000;

// Init the app
app.use(bodyParser.json());
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

app.listen(port, () => console.log(`Auth app listening on port ${port}`));
