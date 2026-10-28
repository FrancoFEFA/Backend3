process.env.MONGO_URL = '';

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');

describe('GET /api/mocks/mockingusers', () => {
  test('devuelve 50 usuarios por defecto', async () => {
    const response = await request(app).get('/api/mocks/mockingusers');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.payload).toHaveLength(50);
    expect(response.body.payload[0]).toEqual(expect.objectContaining({
      first_name: expect.any(String),
      last_name: expect.any(String),
      email: expect.any(String),
      password: expect.any(String),
      role: expect.stringMatching(/^(user|admin)$/),
      pets: [],
    }));
  });

  test('respeta la cantidad indicada con num', async () => {
    const response = await request(app).get('/api/mocks/mockingusers?num=10');

    expect(response.status).toBe(200);
    expect(response.body.payload).toHaveLength(10);
  });

  test('acepta el alias quantity', async () => {
    const response = await request(app).get('/api/mocks/mockingusers?quantity=3');

    expect(response.status).toBe(200);
    expect(response.body.payload).toHaveLength(3);
  });

  test.each(['abc', '-1', '1.5'])('rechaza la cantidad inválida %s', async (value) => {
    const response = await request(app).get(`/api/mocks/mockingusers?num=${value}`);

    expect(response.status).toBe(400);
    expect(response.body.status).toBe('error');
  });
});

describe('GET /api/mocks/mockingpets', () => {
  test('devuelve 100 mascotas por defecto', async () => {
    const response = await request(app).get('/api/mocks/mockingpets');

    expect(response.status).toBe(200);
    expect(response.body.payload).toHaveLength(100);
  });

  test('respeta la cantidad indicada', async () => {
    const response = await request(app).get('/api/mocks/mockingpets?num=4');

    expect(response.status).toBe(200);
    expect(response.body.payload).toHaveLength(4);
    expect(response.body.payload[0]).toEqual(expect.objectContaining({
      name: expect.any(String),
      specie: expect.any(String),
      adopted: false,
    }));
  });
});

describe('POST /api/mocks/generateData', () => {
  beforeAll(async () => {
    await mongoose.disconnect();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  test.each([
    ['sin cuerpo', {}],
    ['sin users', { pets: 2 }],
    ['sin pets', { users: 2 }],
    ['con valores negativos', { users: -1, pets: 2 }],
    ['con valores no numéricos', { users: 'diez', pets: 'veinte' }],
    ['con valores decimales', { users: 1.5, pets: 2 }],
  ])('rechaza la petición %s', async (_caseName, body) => {
    const response = await request(app).post('/api/mocks/generateData').send(body);

    expect(response.status).toBe(400);
    expect(response.body.status).toBe('error');
  });

  test('rechaza un volumen mayor al máximo permitido', async () => {
    const response = await request(app)
      .post('/api/mocks/generateData')
      .send({ users: 6000, pets: 6000 });

    expect(response.status).toBe(400);
  });

  test('responde 503 cuando MongoDB no está conectado', async () => {
    const response = await request(app)
      .post('/api/mocks/generateData')
      .send({ users: 1, pets: 1 });

    expect(response.status).toBe(503);
    expect(response.body.status).toBe('error');
  });
});
