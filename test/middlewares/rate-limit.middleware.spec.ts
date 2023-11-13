import { describe, test, expect } from '@jest/globals';
import { plainToClass } from 'class-transformer';
import client from 'ioredis-mock';

import { RateLimitMiddleware } from '../../src/middlewares';
import { Notification } from '../../src/models';

jest.mock('ioredis', () => jest.requireActual('ioredis-mock'));

const redisClient = new client();

describe('RateLimitMiddleware', () => {
  afterAll((done) => {
    jest.clearAllMocks();
    redisClient.flushall();
    redisClient.quit();
    done();
  });
  test('use function', async () => {
    const controller = new RateLimitMiddleware();
    const notification = plainToClass(Notification, {
      user: 'USER101',
      type: 'status',
      message: 'asdasdasd',
    });
    const request = {
      body: notification,
    } as any;
    const next = jest.fn();
    await controller.use(request, {} as any, next);
    expect(next).toBeCalled();
  });
  test('use function get error', async () => {
    const controller = new RateLimitMiddleware();
    const notification = plainToClass(Notification, {
      user: 'USER101',
      type: 'status',
      message: 'asdasdasd',
    });
    const request = {
      body: notification,
    } as any;
    const next = jest.fn();
    try {
      await controller.use(request, {} as any, next);
      await controller.use(request, {} as any, next);
      await controller.use(request, {} as any, next);
    } catch (error: any) {
      expect(error.message).toBe('Too many requests');
    }
  });
});
