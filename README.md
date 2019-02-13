# auth-server
A simple OAuth2-compliant authentication server, built as part of the Building Networked Systems Security (EP2520) course @ KTH. 

## Testing
Generate a private key, and save it in a folder called `secrets` in the project dir. Using openssl:
```bash
openssl genrsa -out private.pem 2048
openssl rsa -in private.pem -pubout -outform PEM -out public.pem
```

Start the server. The following will elicit a correct authentication: 

``` bash
curl -i -d '{"username": "test", "password": "password", "client_id": "test_client", "client_secret": "secret", "grant_type":"password"}' -H "Content-Type: application/json" http://localhost:3000/auth 
```
You can verify this using the public key. 






