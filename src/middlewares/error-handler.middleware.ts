/* eslint-disable @typescript-eslint/no-unused-vars */
import HttpStatusCodes from 'http-status-codes';
import {
  Middleware,
  ExpressErrorMiddlewareInterface,
  HttpError,
} from 'routing-controllers';
import { Service } from 'typedi';

import config from '../config';

@Middleware({ type: 'after' })
@Service()
export class CustomErrorHandler implements ExpressErrorMiddlewareInterface {
  error(error: any, request: any, response: any, next: (err: any) => any) {
    if (error instanceof HttpError) {
      response.status(error.httpCode).json({
        name: error.name,
        message: error.message || 'Error',
        code: error.httpCode,
        stack: config.app.env !== 'production' ? error.stack : {},
      });
    } else {
      response.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
        name: error.name || 'General Error',
        message: error.message || 'Error',
        code: HttpStatusCodes.INTERNAL_SERVER_ERROR,
        stack: config.app.env === 'production' ? error.stack : {},
      });
    }
  }
}
