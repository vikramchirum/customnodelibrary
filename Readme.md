# gexa.http_client.basic_auth

Client for accessing http resources using basic auth

## Creating

```js
const http_client = require("gexa.http_client.basic_auth").http_client;
const http_status_error = require("gexa.http_client.basic_auth").http_status_error;

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
	try {
		let result = await api_client.search('/api/address_search', {partial: '1029 beach'});
	}
	catch (err) {
        if (err instanceof http_status_error) {
            console.log('Suggested http status code: ' + err.status);
            console.log('Error list: ' + err.errors);
        }
        else {
            console.log(err);
        }
    }
})();
```

or

```js
api_client.search('/api/address_search', { partial: '1029 beachh' })
    .then(function (result) {
        console.log(result);
    })
    .catch(function (err) {
        if (err instanceof http_status_error) {
            console.log('Suggested http status code: ' + err.status);
            console.log('Error list: ' + err.errors);
        }
        else {
            console.log(err);
        }
    });
```