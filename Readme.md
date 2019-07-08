# gexa.http_client.basic_auth

Client for accessing http resources using basic auth

## Creating

```js
const http_client = require("gexa.http_client.basic_auth");

const api_client = new http_client({
    base_url: 'https://someapi.com',
    passphrase: 'secretpassword',
    request_callback: function (info, err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(info);
        }
    }
});
```

## Usage

```js
(async function(){
    let result = await api_client.search('/api/address_search', {partial: '1029 beach'});
})();
```

or

```js
api_client.search('/api/address_search', { partial: '1029 beachh' })
    .then(function (result) {
        console.log(result);
    })
    .catch(function (err) {
        console.log(err);
    });
```