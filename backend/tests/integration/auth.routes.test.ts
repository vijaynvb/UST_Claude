import request from 'supertest';
import type { Express } from 'express';
import { createApp } from '../../src/app';
import { createContainer } from '../../src/container';

function buildTestApp(): Express {
  return createApp(createContainer());
}

describe('Auth routes', () => {
  const credentials = { email: 'jane.doe@example.com', password: 'Str0ng!Passw0rd' };

  it('registers a new account and returns the public profile', async () => {
    const app = buildTestApp();

    const response = await request(app).post('/api/v1/auth/register').send(credentials);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({ email: credentials.email });
    expect(response.body.password).toBeUndefined();
  });

  it('rejects duplicate registration with 409', async () => {
    const app = buildTestApp();
    await request(app).post('/api/v1/auth/register').send(credentials);

    const response = await request(app).post('/api/v1/auth/register').send(credentials);

    expect(response.status).toBe(409);
    expect(response.body.error.code).toBe('EMAIL_ALREADY_REGISTERED');
  });

  it('rejects registration with an invalid payload as a 400 validation error', async () => {
    const app = buildTestApp();

    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({ email: 'not-an-email', password: 'short' });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('logs in and returns a bearer token pair', async () => {
    const app = buildTestApp();
    await request(app).post('/api/v1/auth/register').send(credentials);

    const response = await request(app).post('/api/v1/auth/login').send(credentials);

    expect(response.status).toBe(200);
    expect(response.body.tokenType).toBe('Bearer');
    expect(response.body.accessToken).toBeTruthy();
    expect(response.body.refreshToken).toBeTruthy();
  });

  it('returns a generic 401 for an unknown email', async () => {
    const app = buildTestApp();

    const response = await request(app).post('/api/v1/auth/login').send(credentials);

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe('INVALID_CREDENTIALS');
  });

  it('exchanges a refresh token for a new token pair', async () => {
    const app = buildTestApp();
    await request(app).post('/api/v1/auth/register').send(credentials);
    const loginResponse = await request(app).post('/api/v1/auth/login').send(credentials);

    const response = await request(app)
      .post('/api/v1/auth/refresh')
      .send({ refreshToken: loginResponse.body.refreshToken });

    expect(response.status).toBe(200);
    expect(response.body.accessToken).toBeTruthy();
  });

  it('rejects a reused (already rotated) refresh token', async () => {
    const app = buildTestApp();
    await request(app).post('/api/v1/auth/register').send(credentials);
    const loginResponse = await request(app).post('/api/v1/auth/login').send(credentials);

    await request(app)
      .post('/api/v1/auth/refresh')
      .send({ refreshToken: loginResponse.body.refreshToken });
    const secondAttempt = await request(app)
      .post('/api/v1/auth/refresh')
      .send({ refreshToken: loginResponse.body.refreshToken });

    expect(secondAttempt.status).toBe(401);
  });

  it('requires authentication to log out', async () => {
    const app = buildTestApp();

    const response = await request(app).post('/api/v1/auth/logout').send({ refreshToken: 'x' });

    expect(response.status).toBe(401);
  });
});
