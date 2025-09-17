const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongo;
let app;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  process.env.MONGODB_URI = uri;
  app = require('../app');
  await mongoose.connect(uri, { dbName: 'testdb2' });
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongo) await mongo.stop();
});

test('refresh flow', async () => {
  const register = await request(app)
    .post('/api/auth/register')
    .send({ name: 'Bob', email: 'bob@example.com', password: 'secret123', userType: 'user' });
  expect(register.status).toBe(201);
  const { refreshToken } = register.body;

  const refresh = await request(app).post('/api/auth/refresh').send({ refreshToken });
  expect(refresh.status).toBe(200);
  expect(refresh.body.token).toBeTruthy();
  expect(refresh.body.refreshToken).toBeTruthy();

  const token2 = refresh.body.token;
  const logout = await request(app).post('/api/auth/logout').set('Authorization', `Bearer ${token2}`);
  expect(logout.status).toBe(200);
});

