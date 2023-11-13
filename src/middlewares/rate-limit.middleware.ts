import { ExpressMiddlewareInterface } from 'routing-controllers';
import { Request, Response } from 'express';
import { Service } from 'typedi';
import Redis from 'ioredis';

import { RateLimitError } from '../errors';
import config from '../config';

@Service()
export class RateLimitMiddleware implements ExpressMiddlewareInterface {
  client: Redis;

  constructor() {
    this.client = new Redis({
      host: config.redis.host,
    });
  }

  async use(
    request: Request,
    response: Response,
    next?: (err?: any) => any,
  ): Promise<any> {
    const { user, type } = request.body;
    const configRate =
      config.notification.rate[type] || config.notification.rate.default;
    const redisKey = `rate-${type}-${user.toLowerCase()}`;
    const count = await this.client.incr(redisKey);
    if (count === 1) {
      this.client.expire(redisKey, configRate.seconds);
    }
    if (count > configRate.limit) {
      throw new RateLimitError('Too many requests');
    } else {
      next();
    }
  }
}
