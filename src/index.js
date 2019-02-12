const express = require('express');
const bodyParser = require('body-parser');
const creds = require('./creds');
const app = express();
const port = 3000;

app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Hello World!'));
app.post('/', (req, res) => {
    const user = req.body.user;
    const pass = req.body.pass;
    const authorized = creds.verify(user, pass);
    if (authorized === true) {
        /*
         * Talk with the oauth server
         */
        res.send('ok');
    } else {
        res.status(403)
            .send('Username or Password invalid');
    }

});
app.listen(port, () => console.log(`Example app listening on port ${port}`));
