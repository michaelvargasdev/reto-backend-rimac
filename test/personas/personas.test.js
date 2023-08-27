const axios = require('axios');
const AWS = require('aws-sdk');
const { Items, Item } = require('./mockResponse');
const { idPeople, idPersona, creaPersona, modificaPersona } = require('./mockRequest');
const { personasFindSWAPI, personasList, personasFind, personasCreate, personasUpdate, personasDelete } = require('./../../src/handlers/personasHandler');

describe('personas', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('personasFindSWAPI success', async () => {
    {
      jest.spyOn(axios, 'get').mockImplementationOnce(() => Promise.resolve({ data: Item }));
    }
    const response = await personasFindSWAPI({ pathParameters: { idPeople } });
    const body = JSON.parse(response.body);
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(body.data.name).toEqual(Item.name);
  });

  it('personasList success', async () => {
    {
      jest.spyOn(new AWS.DynamoDB.DocumentClient().__proto__, 'scan')
        .mockImplementationOnce(() => {
          return {
            promise() {
              return Promise.resolve({
                $response: {
                  requestId: 'Mock ok.'
                },
                Items,
              });
            }
          };
        });
    }
    const response = await personasList();
    const body = JSON.parse(response.body);
    expect(new AWS.DynamoDB.DocumentClient().__proto__.scan).toHaveBeenCalledTimes(1);
    expect(body.data.length).toEqual(Items.length);
  });

  it('personasFind success', async () => {
    {
      jest.spyOn(new AWS.DynamoDB.DocumentClient().__proto__, 'get')
        .mockImplementationOnce(() => {
          return {
            promise() {
              return Promise.resolve({
                $response: {
                  requestId: 'Mock ok.'
                },
                Item,
              });
            }
          };
        });
    }
    const response = await personasFind({ pathParameters: { idPersona } });
    const body = JSON.parse(response.body);
    expect(new AWS.DynamoDB.DocumentClient().__proto__.get).toHaveBeenCalledTimes(1);
    expect(body.data.name).toEqual(Item.name);
  });

  it('personasCreate success', async () => {
    {
      jest.spyOn(new AWS.DynamoDB.DocumentClient().__proto__, 'put')
        .mockImplementationOnce(() => {
          return {
            promise() {
              return Promise.resolve({
                $response: {
                  requestId: 'Mock ok.'
                },
              });
            }
          };
        });
    }
    const response = await personasCreate({ body: JSON.stringify(creaPersona) });
    const body = JSON.parse(response.body);
    expect(new AWS.DynamoDB.DocumentClient().__proto__.put).toHaveBeenCalledTimes(1);
    expect(body.message).toEqual('El registro se creó con éxito.');
  });

  it('personasUpdate success', async () => {
    {
      jest.spyOn(new AWS.DynamoDB.DocumentClient().__proto__, 'update')
        .mockImplementationOnce(() => {
          return {
            promise() {
              return Promise.resolve({
                $response: {
                  requestId: 'Mock ok.'
                },
              });
            }
          };
        });
    }
    const response = await personasUpdate({ pathParameters: { idPersona }, body: JSON.stringify(modificaPersona) });
    const body = JSON.parse(response.body);
    expect(new AWS.DynamoDB.DocumentClient().__proto__.update).toHaveBeenCalledTimes(1);
    expect(body.message).toEqual('El registro se modificó con éxito.');
  });

  it('personasDelete success', async () => {
    {
      jest.spyOn(new AWS.DynamoDB.DocumentClient().__proto__, 'delete')
        .mockImplementationOnce(() => {
          return {
            promise() {
              return Promise.resolve({
                $response: {
                  requestId: 'Mock ok.'
                },
              });
            }
          };
        });
    }
    const response = await personasDelete({ pathParameters: { idPersona } });
    const body = JSON.parse(response.body);
    expect(new AWS.DynamoDB.DocumentClient().__proto__.delete).toHaveBeenCalledTimes(1);
    expect(body.message).toEqual('El registro se eliminó con éxito.');
  });
});
