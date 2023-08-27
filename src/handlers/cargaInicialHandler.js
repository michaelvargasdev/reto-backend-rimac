const AWS = require('aws-sdk');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const { responseOk, responseServerInternalError } = require('../commons/response.common');

function extractId(url) {
  return Number(url.split('/').reverse()[1]);
}

function createItems(result, modelName) {
  let item = {};
  const id = uuidv4();
  try {
    if (modelName === process.env.MOD_FILMS) {

    } else if (modelName === process.env.MOD_PEOPLE) {
      item = {
        PutRequest: {
          Item: {
            idPersona: id,
            nombre: result.name,
            altura: result.height,
            masa: result.mass,
            colorPelo: result.hair_color,
            colorPiel: result.skin_color,
            colorOjos: result.eye_color,
            anioNacimiento: result.birth_year,
            genero: result.gender,
            mundoNatal: extractId(result.homeworld),
            peluculas: result.films.map((url) => extractId(url)),
            especies: result.species.map((url) => extractId(url)),
            vehiculos: result.vehicles.map((url) => extractId(url)),
            navesEstelares: result.starships.map((url) => extractId(url)),
            creado: result.created,
            editado: result.edited,
          }
        }
      };
    } else if (modelName === process.env.MOD_PLANETS) {

    } else if (modelName === process.env.MOD_SPECIES) {

    } else if (modelName === process.env.MOD_STAR_SHIPS) {

    } else if (modelName === process.env.MOD_VEHICLES) {

    }
  } catch (error) {
    console.error('createItems error: ', error.message);
    throw error;
  }

  return item;
}

module.exports.cargaInicial = async function () {
  let response = {};
  try {
    const ddb = new AWS.DynamoDB.DocumentClient({ region: process.env.REGION });
    let page = 1;
    let next = true;
    const entities = [
      /*{
        modelName: process.env.MOD_FILMS,
        tableName: process.env.TBL_PELICULAS,
      },*/
      {
        modelName: process.env.MOD_PEOPLE,
        tableName: process.env.TBL_PERSONAS,
      },
      /*{
        modelName: process.env.MOD_PLANETS,
        tableName: process.env.TBL_PLANETAS,
      },
      {
        modelName: process.env.MOD_SPECIES,
        tableName: process.env.TBL_ESPECIES,
      },
      {
        modelName: process.env.MOD_STAR_SHIPS,
        tableName: process.env.TBL_NAVES_ESTELARES,
      },
      {
        modelName: process.env.MOD_VEHICLES,
        tableName: process.env.TBL_VEHICULOS,
      },*/
    ];

    for (const entity of entities) {
      const insertItemsList = [];
      const { modelName, tableName } = entity;
      do {
        const response = await axios.get(`${process.env.URL_SWAPI}${modelName}?page=${page}`);
        const data = response.data;
        const results = data.results;
        for (const result of results) {
          insertItemsList.push(createItems(result, modelName));
        }
        next = data.next
        console.log(page);
        page++
      } while (next);

      let groupsCount = Math.ceil(insertItemsList.length / 25);
      let index = 0;
      console.log(insertItemsList[0]);
      console.log(groupsCount);
      while (groupsCount != 0) {
        const params = {
          RequestItems: {
            [tableName]: insertItemsList.slice(index, index + 25),
          }
        }
        const result = await ddb.batchWrite(params).promise();
        console.log('cargaInicial result: ', result.$response.requestId);
        index += 25;
        groupsCount--;
      };

      page = 1;
    }
    response = responseOk();
  } catch (error) {
    console.log(`cargaInicial error: ${error.message}`)
    response = responseServerInternalError();
  }


  return response;
}
