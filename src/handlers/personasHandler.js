const AWS = require('aws-sdk');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const {
  responseOk,
  responseOkUpdated,
  responseOkDeleted,
  responseCreated,
  responseBadRequest,
  responseNotFound,
  responseServerInternalError
} = require('../commons/response.common');
const { getPayload } = require('./../commons/request.common');

const ddb = new AWS.DynamoDB.DocumentClient({ region: process.env.REGION });

module.exports.personasFindSWAPI = async function (event) {
  let response = {};
  try {
    const payload = getPayload(event);
    const { idPeople } = payload;
    const responseGet = await axios.get(`${process.env.URL_SWAPI}${process.env.MOD_PEOPLE}/${idPeople}`);
    const data = responseGet.data;
    response = responseOk(data);
  } catch (error) {
    console.error('personasFindSWAPI error: ', error.message);
    response = responseServerInternalError();
  }

  return response;
}

module.exports.personasList = async function () {
  let response = {};
  try {
    const params = {
      TableName: process.env.TBL_PERSONAS,
    };
    
    const result = await ddb.scan(params).promise();
    console.log(`personasFind result requestId: ${result.$response.requestId}`);
    response = responseOk(result.Items);
  } catch (error) {
    console.error('personasList: ', error.message);
    response = responseServerInternalError();
  }

  return response;
}

module.exports.personasFind = async function (event) {
  let response = {};
  try {
    const payload = getPayload(event);
    const { idPersona } = payload;

    const params = {
      TableName: process.env.TBL_PERSONAS,
      Key: {
        idPersona,
      },
    };
    
    const result = await ddb.get(params).promise();
    console.log(`personasFind result requestId: ${result.$response.requestId}`);
    if (result.Item) {
      response = responseOk(result.Item);
    } else {
      response = responseNotFound();
    }
  } catch (error) {
    console.error('personasFind: ', error.message);
    response = responseServerInternalError();
  }

  return response;
}

module.exports.personasCreate = async function (event) {
  let response = {};
  try {
    const payload = getPayload(event);
    const idPersona = uuidv4();
    const params = {
      TableName: process.env.TBL_PERSONAS,
      Item: {
        idPersona,
        ...payload,
      }
    };

    const result = await ddb.put(params).promise();
    console.log(`personasCreate result requestId: ${result.$response.requestId}`);
    response = responseCreated({ idPersona });
  } catch (error) {
    console.error('personasCreate: ', error.message);
    response = responseServerInternalError();
  }

  return response;
}

module.exports.personasUpdate = async function (event) {
  let response = {};
  try {
    const payload = getPayload(event);
    const { idPersona } = payload;
    let UpdateExpression = '';
    const ExpressionAttributeNames = {};
    const ExpressionAttributeValues = {};
    for (const key of Object.keys(payload)) {
      if (key !== 'idPersona') {
        UpdateExpression += UpdateExpression === '' ? `set #${key} = :${key}` : `, #${key} = :${key}`;
        ExpressionAttributeNames[`#${key}`] = key;
        ExpressionAttributeValues[`:${key}`] = payload[key];
      }
    }

    const params = {
      TableName: process.env.TBL_PERSONAS,
      Key: {
        idPersona,
      },
      UpdateExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues,
  };

    const result = await ddb.update(params).promise();
    console.log(`personasUpdate result requestId: ${result.$response.requestId}`);
    response = responseOkUpdated();
  } catch (error) {
    console.error('personasUpdate: ', error.message);
    response = responseServerInternalError();
  }

  return response;
}

module.exports.personasDelete = async function (event) {
  let response = {};
  try {
    const payload = getPayload(event);
    const { idPersona } = payload;
    const params = {
      TableName: process.env.TBL_PERSONAS,
      Key: {
        idPersona,
      }
    };

    const result = await ddb.delete(params).promise();
    console.log(`personasDelete result requestId: ${result.$response.requestId}`);
    response = responseOkDeleted();
  } catch (error) {
    console.error('personasDelete: ', error.message);
    response = responseServerInternalError();
  }

  return response;
}
