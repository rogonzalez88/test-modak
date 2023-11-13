import { describe, test, expect } from '@jest/globals';
import { plainToClass } from 'class-transformer';

import { BodyValidationMiddleware } from '../../src/middlewares';
import { Notification } from '../../src/models';

describe('BodyValidationMiddleware', () => {
  test('use function', async () => {
    const controller = new BodyValidationMiddleware();
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
    const controller = new BodyValidationMiddleware();
    const notification = plainToClass(Notification, {
      user: 'USER101',
      type: 'status'
    });
    const request = {
      body: notification,
    } as any;
    const next = jest.fn();
    try {
      await controller.use(request, {} as any, next);
    } catch (error: any) {
      expect(error.message).toBe('message must be a string');
    }
  });
});
