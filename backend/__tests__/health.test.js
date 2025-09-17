const request = require('supertest');
const app = require('../app');

describe('Health and 404', () => {
  it('GET /health should return OK', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('OK');
    expect(res.body.timestamp).toBeTruthy();
  });

  it('GET /unknown should return 404 json', async () => {
    const res = await request(app).get('/unknown');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });
});

