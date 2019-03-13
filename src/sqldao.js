const mariadb = require('mariadb');

const getUser = (username) => new Promise((resolve, reject) => {
    mariadb.createConnection({
        host: '127.0.0.1',
        user:'root',
        password: 'changeme',
        database: 'radius',
    }).then( conn => {
            return conn.query("SELECT value FROM radcheck WHERE username=(?)",username)
                .then( row => {
                    conn.end();
                    if (row.length > 0)
                        resolve(row);
                    else
                        reject(`User ${username} not found`);
                })
                .catch( err => {
                    reject(err);
                });
        })
        .catch( err => {
            reject(err);
        });
});

exports.getUser = getUser;


