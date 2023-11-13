import {
  BadRequestError,
  ExpressMiddlewareInterface,
} from 'routing-controllers';
import { validateOrReject } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { Service } from 'typedi';

import { Notification } from '../models';

@Service()
export class BodyValidationMiddleware implements ExpressMiddlewareInterface {
  async use(
    request: Request,
    response: Response,
    next?: (err?: any) => any,
  ): Promise<any> {
    try {
      const objInstance = plainToClass(Notification, request.body);
      await validateOrReject(objInstance);
    } catch (errors: any) {
      throw new BadRequestError(
        errors
          .map(({ constraints }) => Object.values(constraints).join(', '))
          .join(', '),
      );
    }
    next();
  }
}
