export const SuccessResponse = (extraParameters : Object = {}) => {
    return Object.assign({
        'success': true
    }, extraParameters);
};