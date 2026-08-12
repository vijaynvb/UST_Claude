import request from 'supertest';
import type { Express } from 'express';
import { createApp } from '../../src/app';
import { createContainer } from '../../src/container';

async function registerAndLogin(app: Express): Promise<string> {
  const credentials = { email: 'jane.doe@example.com', password: 'Str0ng!Passw0rd' };
  await request(app).post('/api/v1/auth/register').send(credentials);
  const loginResponse = await request(app).post('/api/v1/auth/login').send(credentials);
  return loginResponse.body.accessToken as string;
}

describe('Task routes', () => {
  function buildTestApp(): Express {
    return createApp(createContainer());
  }

  it('rejects unauthenticated access', async () => {
    const app = buildTestApp();

    const response = await request(app).get('/api/v1/tasks');

    expect(response.status).toBe(401);
  });

  it('creates and retrieves a task owned by the authenticated user', async () => {
    const app = buildTestApp();
    const accessToken = await registerAndLogin(app);

    const createResponse = await request(app)
      .post('/api/v1/tasks')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title: 'Finish architecture doc', priority: 'High' });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body.status).toBe('Pending');

    const getResponse = await request(app)
      .get(`/api/v1/tasks/${createResponse.body.id}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(getResponse.status).toBe(200);
    expect(getResponse.body.title).toBe('Finish architecture doc');
  });

  it('rejects creating a task without a title as a 400 validation error', async () => {
    const app = buildTestApp();
    const accessToken = await registerAndLogin(app);

    const response = await request(app)
      .post('/api/v1/tasks')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ description: 'Missing title' });

    expect(response.status).toBe(400);
  });

  it("lists only the requesting user's tasks, paginated", async () => {
    const app = buildTestApp();
    const accessToken = await registerAndLogin(app);

    await request(app)
      .post('/api/v1/tasks')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title: 'Task one' });
    await request(app)
      .post('/api/v1/tasks')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title: 'Task two' });

    const response = await request(app)
      .get('/api/v1/tasks?pageSize=1&page=1')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.items).toHaveLength(1);
    expect(response.body.pagination.totalItems).toBe(2);
    expect(response.body.pagination.totalPages).toBe(2);
  });

  it("returns 403 when accessing another user's task", async () => {
    const app = buildTestApp();
    const ownerToken = await registerAndLogin(app);
    const createResponse = await request(app)
      .post('/api/v1/tasks')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ title: 'Owned by Jane' });

    await request(app)
      .post('/api/v1/auth/register')
      .send({ email: 'other.user@example.com', password: 'Str0ng!Passw0rd' });
    const otherLogin = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'other.user@example.com', password: 'Str0ng!Passw0rd' });

    const response = await request(app)
      .get(`/api/v1/tasks/${createResponse.body.id}`)
      .set('Authorization', `Bearer ${otherLogin.body.accessToken}`);

    expect(response.status).toBe(403);
  });

  it('returns 404 for a non-existent task', async () => {
    const app = buildTestApp();
    const accessToken = await registerAndLogin(app);

    const response = await request(app)
      .get('/api/v1/tasks/3f4c9c2e-9b3a-4a3e-8b0a-1d2e3f4a5b6c')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(404);
  });

  it('transitions a task to Completed and then blocks reopening via the status endpoint', async () => {
    const app = buildTestApp();
    const accessToken = await registerAndLogin(app);
    const createResponse = await request(app)
      .post('/api/v1/tasks')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title: 'Finish architecture doc' });

    const completeResponse = await request(app)
      .patch(`/api/v1/tasks/${createResponse.body.id}/status`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ status: 'Completed' });
    expect(completeResponse.status).toBe(200);
    expect(completeResponse.body.status).toBe('Completed');

    const reopenResponse = await request(app)
      .patch(`/api/v1/tasks/${createResponse.body.id}/status`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ status: 'Pending' });
    expect(reopenResponse.status).toBe(422);
  });

  it('soft-deletes a task so it no longer appears in subsequent reads', async () => {
    const app = buildTestApp();
    const accessToken = await registerAndLogin(app);
    const createResponse = await request(app)
      .post('/api/v1/tasks')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title: 'Temporary task' });

    const deleteResponse = await request(app)
      .delete(`/api/v1/tasks/${createResponse.body.id}`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(deleteResponse.status).toBe(204);

    const getResponse = await request(app)
      .get(`/api/v1/tasks/${createResponse.body.id}`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(getResponse.status).toBe(404);
  });

  it('responds to OPTIONS on the task collection without authentication', async () => {
    const app = buildTestApp();

    const response = await request(app).options('/api/v1/tasks');

    expect(response.status).toBe(204);
    expect(response.headers.allow).toBe('GET, POST, OPTIONS');
  });
});
