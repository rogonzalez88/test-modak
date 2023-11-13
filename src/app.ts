import 'reflect-metadata';
import 'module-alias/register';

import express, { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import bodyParser from 'body-parser';
import Container from 'typedi';
import {
  useExpressServer,
  useContainer as routingContainer,
} from 'routing-controllers';

import config from './config';

const baseDir = __dirname;

/* Create App */
const app: Express = express();

/* Global Middlewares */
app.use(bodyParser.json());

/* Swagger */
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Notification Service',
      version: '1.0.0',
    },
    servers: [
      {
        url: `http://localhost:8080${config.app.apiRoot}`,
        description: 'Development server',
      },
    ],
  },
  apis: [baseDir + `/controllers/*.js`, baseDir + `/models/*.js`],
};
const openapiSpecification = swaggerJSDoc(options);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));
app.use('/docs-json', (_req, res) => res.json(openapiSpecification));

/* Routing Controller */
routingContainer(Container);
useExpressServer(app, {
  routePrefix: config.app.apiRoot,
  cors: true,
  controllers: [baseDir + `/controllers/*{.js,.ts}`],
  middlewares: [baseDir + `/middlewares/*{.js,.ts}`],
  defaultErrorHandler: false,
});

export default app;
