class apiError extends Error{
    constructor(statusCode, stack="", errors=[], message="something went wrong"){
        super(message);
        this.statusCode=statusCode;
        this.success=false;
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
export {apiError}