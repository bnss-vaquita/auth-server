# auth-server
A simple authentication server

## Testing
Start the server. The following will elicit a correct authentication: 

``` bash
curl -d '{"user":"kristian", "pass":"password"}' -H "Content-Type: application/json" -X POST http://localhost:3000/
```






