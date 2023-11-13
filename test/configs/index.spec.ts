import { describe, test, expect } from '@jest/globals';

describe('Config', () => {
  const OLD_ENV = process.env;
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });
  test('Config instance', () => {
    const config = require('../../src/config').default;
    expect(config).toEqual({
      app: { env: 'test', port: 3000, apiRoot: '/api/v1' },
      notification: {
        rate: {
          status: { seconds: 60, limit: 2 },
          news: { seconds: 86400, limit: 1 },
          marketing: { seconds: 3600, limit: 3 },
          default: { seconds: 5, limit: 1 },
        },
      },
      redis: {
        host: '127.0.0.1',
      },
    });
  });
});
