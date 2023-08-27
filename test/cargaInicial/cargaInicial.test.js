const axios = require('axios');
const AWS = require('aws-sdk');
const { page1, page2 } = require('./mockResponse');
const { cargaInicial } = require('./../../src/handlers/cargaInicialHandler');

describe('cargaInicial', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('success', async () => {
    {
      jest.spyOn(axios, 'get').mockImplementationOnce(() => Promise.resolve({ data: page1 }));
      jest.spyOn(axios, 'get').mockImplementationOnce(() => Promise.resolve({ data: page2 }));

      jest.spyOn(new AWS.DynamoDB.DocumentClient().__proto__, 'batchWrite')
      .mockImplementationOnce(() => {
        return {
          promise() {
            return Promise.resolve({
              $response: {
                requestId: 'Mock ok.'
              }
            });
          }
        };
      });
    }
    const response = await cargaInicial();
    const body = JSON.parse(response.body)
    expect(axios.get).toHaveBeenCalledTimes(2);
    expect(new AWS.DynamoDB.DocumentClient().__proto__.batchWrite).toHaveBeenCalledTimes(1);
    expect(body.message).toEqual('La solicitud se terminó con éxito.');
  });
});
