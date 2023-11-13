import { describe, test } from '@jest/globals';
import request from 'supertest';
import client from 'ioredis-mock';

import app from '../src/app';
import config from '../src/config';

jest.mock('ioredis', () => jest.requireActual('ioredis-mock'));

const redisClient = new client();

describe('App', () => {
  afterAll((done) => {
    jest.clearAllMocks();
    redisClient.flushall();
    redisClient.quit();
    done();
  });
  test('GET /docs', async () => {
    const response = await request(app).get('/docs').send();
    expect(response.status).toEqual(301);
  });
  test('GET /docs-json', async () => {
    const response = await request(app).get('/docs-json').send();
    expect(response.status).toEqual(200);
  });
  test('POST /api/v1/notifications/', async () => {
    const body = {
      user: 'USER101',
      type: 'status',
      message: 'asdasdasd',
    };
    const response = await request(app)
      .post('/api/v1/notifications/')
      .send(body);
    expect(response.body).toEqual(body);
  });
  test('POST /api/v1/notifications/ get error of validation', async () => {
    const body = {
      user: 'USER101',
      type: 'status',
    };
    const response = await request(app)
      .post('/api/v1/notifications/')
      .send(body);
    expect(response.body.message).toEqual('message must be a string');
  });
  test('POST /api/v1/notifications/ get error of rate limit', async () => {
    const body = {
      user: 'USER101',
      type: 'status',
      message: 'asdasdasd',
    };
    for (
      let index = 0;
      index < config.notification.rate.status.limit;
      index++
    ) {
      await request(app).post('/api/v1/notifications/').send(body);
    }
    const response = await request(app)
      .post('/api/v1/notifications/')
      .send(body);
    expect(response.status).toEqual(429);
    expect(response.body.code).toEqual(429);
    expect(response.body.message).toEqual('Too many requests');
    expect(response.body.name).toEqual('RateLimitError');
  });
});
