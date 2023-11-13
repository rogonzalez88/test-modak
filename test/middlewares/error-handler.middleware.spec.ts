import { describe, test, expect } from '@jest/globals';

import { CustomErrorHandler } from '../../src/middlewares/custom-error-handler.middleware';
import { BadRequestError } from 'routing-controllers';

describe('CustomErrorHandler', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  test('use function', async () => {
    const controller = new CustomErrorHandler();
    const error = new BadRequestError('error');
    const jsonMock = jest.fn();
    const response = {
      status: () => ({
        json: jsonMock,
      }),
    };
    controller.error(error, {} as any, response, {} as any);
    expect(jsonMock).toBeCalled();
  });
  test('use function without message', async () => {
    const controller = new CustomErrorHandler();
    const error = new BadRequestError();
    const jsonMock = jest.fn();
    const response = {
      status: () => ({
        json: jsonMock,
      }),
    };
    controller.error(error, {} as any, response, {} as any);
    expect(jsonMock).toBeCalled();
  });
  test('use function get error', async () => {
    const controller = new CustomErrorHandler();
    const error = new Error();
    const jsonMock = jest.fn();
    const response = {
      status: () => ({
        json: jsonMock,
      }),
    };
    controller.error(error, {} as any, response, {} as any);
    expect(jsonMock).toBeCalled();
  });
});
