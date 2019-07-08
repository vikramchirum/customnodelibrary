const request = require('superagent');
const prefix = require('superagent-prefix');
const http_status_error = require('./http_status_error');
const querystring = require('querystring');
const url = require('url');

class http_client {

    /**
     * Client for accessing http resources using basic auth
     * @param {string} options.base_url - base url for api
     * @param {string} options.passphrase - passphrase to use for basic auth
     * @param {function} options.request_callback - callback function that returns request details
     */
    constructor(options) {
        this.creds = Buffer.from(options.passphrase).toString('base64');
        this.auth_header_value = 'Basic ' + this.creds;
        this.http_prefix = prefix(options.base_url);
        if (options.request_callback) {
            this.request_logger = create_request_logger(options.request_callback);
        }
        else{
            this.request_logger = function(req){
                return req;
            };
        }
    }

    async get(endpoint, binary = false) {
        try {
            let req = request
                .get(endpoint)
                .set('Authorization', this.auth_header_value)
                .use(this.http_prefix)
                .use(this.request_logger);
            if (binary) {
                req
                    .responseType('blob');
            }
            let response = await req;
            return clean_response(response);
        }
        catch (err) {
            throw err;
        }
    }

    async search(endpoint, query) {
        try {
            let response = await request
                .get(endpoint)
                .query(query)
                .set('Authorization', this.auth_header_value)
                .use(this.http_prefix)
                .use(this.request_logger);
            return clean_response(response);
        }
        catch (err) {
            throw err;
        }
    }

    async put(endpoint, body) {
        try {
            let response = await request
                .put(endpoint)
                .send(body)
                .set('Authorization', this.auth_header_value)
                .use(this.http_prefix)
                .use(this.request_logger);
            return clean_response(response);
        }
        catch (err) {
            throw err;
        }
    }

    async post(endpoint, body) {
        try {
            let response = await request
                .post(endpoint)
                .send(body)
                .set('Authorization', this.auth_header_value)
                .use(this.http_prefix)
                .use(this.request_logger);
            return clean_response(response);
        }
        catch (err) {
            throw err;
        }
    }

    async delete(endpoint, query) {
        try {
            let response = await request
                .delete(endpoint)
                .query(query)
                .set('Authorization', this.auth_header_value)
                .use(this.http_prefix)
                .use(this.request_logger);
            return clean_response(response);
        }
        catch (err) {
            throw err;
        }
    }
}

const clean_response = function (result) {
    if (result && result.status && result.status >= 200 && result.status < 300) {
        if (result.body) {
            return result.body;
        }
        else {
            return null;
        }
    }
    else if (result && result.status) {
        throw new http_status_error({message: result.message, status: result.status});
    }
    else {
        return new http_status_error({message: 'No response from server', status: 404});
    }
};

const create_request_logger = function (callback) {
    return function (req) {
        try {
            let uri = url.parse(req.url);
            let info = {
                start: new Date().getTime(),
                timestamp: new Date().toISOString(),
                method: req.method,
                href: uri.href,
                query_string: req.qs ? '?' + querystring.stringify(req.qs) : '',
                protocol: uri.protocol.toUpperCase().replace(/[^\w]/g, '')
            };

            req.on('response', function (res) {
                info.end = new Date().getTime();
                info.elapsed = info.end - info.start;
                info.size = res.headers['content-length'];
                info.status = res.status;

                callback(info);
            });
        }
        catch (err) {
            callback(null, new Error('Error parsing request'));
        }
        finally {
            return req;
        }
    }
};

module.exports = http_client;
