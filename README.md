# reto-backend-rimac

Reto de Rimac Seguros para el proceso de selección a la posición de backend developer.

## Requirements

```bash
node >= 14.21.3
npm  >=  9.8.1
```

## End Points

```basch
GET - https://<API-GATEWAY-ID>.execute-api.<REGION>.amazonaws.com/DEV/cargaInicial
GET - https://<API-GATEWAY-ID>.execute-api.<REGION>.amazonaws.com/DEV/personasSWAPI/{idPeople}
GET - https://<API-GATEWAY-ID>.execute-api.<REGION>.amazonaws.com/DEV/personas
GET - https://<API-GATEWAY-ID>.execute-api.<REGION>.amazonaws.com/DEV/personas/{idPersona}
POST - https://<API-GATEWAY-ID>.execute-api.<REGION>.amazonaws.com/DEV/personas
PATCH - https://<API-GATEWAY-ID>.execute-api.<REGION>.amazonaws.com/DEV/personas/{idPersona}
DELETE - https://<API-GATEWAY-ID>.execute-api.<REGION>.amazonaws.com/DEV/personas/{idPersona}
```
