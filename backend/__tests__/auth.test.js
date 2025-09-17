const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongo;
let app;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  process.env.MONGODB_URI = uri;
  // Delay requiring server after setting env
  app = require('../app');
  await mongoose.connect(uri, { dbName: 'testdb' });
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongo) await mongo.stop();
});

describe('Auth flow', () => {
  it('registers and logs in a user', async () => {
    const register = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Alice',
        email: 'alice@example.com',
        password: 'secret123',
        userType: 'user'
      });
    expect(register.status).toBe(201);
    expect(register.body).toHaveProperty('token');

    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: 'alice@example.com', password: 'secret123', userType: 'user' });
    expect(login.status).toBe(200);
    expect(login.body).toHaveProperty('token');
  });
});

