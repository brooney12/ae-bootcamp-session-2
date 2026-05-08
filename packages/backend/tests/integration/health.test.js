const request = require('supertest');
const { app, db } = require('../../src/app');

afterAll(() => {
  if (db) {
    db.close();
  }
});

describe('Health Check Integration', () => {
  it('returns a 200 status with an ok status message', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('message');
  });

  it('returns JSON content', async () => {
    const res = await request(app).get('/');
    expect(res.headers['content-type']).toMatch(/application\/json/);
  });
});
