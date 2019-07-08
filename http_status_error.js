
class http_status_error extends Error {
    /**
     * Creates a custom error
     * @param options.message - custom error message
     * @param options.status - http status code for message
     */
    constructor(options) {
        if (Array.isArray(options.message)) {
            let concatenated = options.message.join(', ');
            super(concatenated);
            this.errors = options.message;
        }
        else {
            super(options.message);
            this.errors = [this.message];
        }
        this.status = options.status;
        this.name = 'custom_error';
    }
};

module.exports = http_status_error;
