const { OK, CREATED, BAD_REQUEST, NOT_FOUND, SERVER_INTERNAL_ERROR } = require('../constants/httpStatusCode.constant');

const response = (statusCode, body) => ({
    statusCode,
    body: JSON.stringify(body),
});

module.exports.responseOk = (data = null, message = 'La solicitud se terminó con éxito.') => {
    return response(OK, { data, message });
}

module.exports.responseOkUpdated = (data = {}, message = 'El registro se modificó con éxito.') => {
    return response(OK, { data, message });
}

module.exports.responseOkDeleted = (data = {}, message = 'El registro se eliminó con éxito.') => {
    return response(OK, { data, message });
}

module.exports.responseCreated = (data = {}, message = 'El registro se creó con éxito.') => {
    return response(CREATED, { data, message });
}

module.exports.responseBadRequest = (data) => {
    return response(BAD_REQUEST, { data, message: 'Solicitud incorrecta' });
}

module.exports.responseNotFound = () => {
    return response(NOT_FOUND, { message: 'Registro(s) no encontrado(s)' });
}

module.exports.responseServerInternalError = () => {
    return response(SERVER_INTERNAL_ERROR, { message: 'Ocurrio un error.' });
}
