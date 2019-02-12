const express = require('express');
const bodyParser = require('body-parser');
const creds = require('./creds');
const Dao = require('./dao');
const app = express();
const port = 3000;

// Init the user db
const user_db = new Dao( new Map() );
const credentials = creds.sha256('password', creds.gen_salt());
user_db.set('test',credentials);
console.log(user_db.has('test'));

app.use(bodyParser.json());
app.post('/auth', (req, res) => {
    const user = req.body.user;
    const pass = req.body.pass;
    const authorized = creds.verify(user, pass, user_db);
    if (authorized === true) {
        // Todo: auth
        res.send('ok');
    } else {
        res.status(403)
            .send('Username or Password invalid');
    }

});
app.listen(port, () => console.log(`Auth app listening on port ${port}`));
