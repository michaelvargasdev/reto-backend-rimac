module.exports.getPayload = (event) => {
    const queryStringParameters = event.queryStringParameters || {};
    const pathParameters = event.pathParameters || {};
    const body = event.body || '{}';
    return {
        ...queryStringParameters,
        ...pathParameters,
        ...JSON.parse(body),
    }
}
