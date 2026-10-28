require('dotenv').config();

const mainUri = process.env.MONGO_URL;
process.env.MONGO_URL = '';

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/user.model');
const Pet = require('../models/pet.model');

const testUri = process.env.MONGO_URL_TEST;
const canRun = Boolean(testUri) && testUri !== mainUri;
const describeE2E = canRun ? describe : describe.skip;

if (!canRun) {
  console.warn('Prueba E2E omitida: definí MONGO_URL_TEST con una base de datos descartable.');
}

describeE2E('persistencia de datos generados (E2E)', () => {
  beforeAll(async () => {
    await mongoose.connect(testUri);
    await User.deleteMany({});
    await Pet.deleteMany({});
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Pet.deleteMany({});
    await mongoose.disconnect();
  });

  test('inserta 50 usuarios y 30 mascotas y los expone en los GET', async () => {
    const insertResponse = await request(app)
      .post('/api/mocks/generateData')
      .send({ users: 50, pets: 30 });

    expect(insertResponse.status).toBe(201);
    expect(insertResponse.body.inserted).toEqual({ users: 50, pets: 30 });

    const usersResponse = await request(app).get('/api/users');
    expect(usersResponse.status).toBe(200);
    expect(usersResponse.body.payload).toHaveLength(50);
    expect(usersResponse.body.payload[0]).toEqual(expect.objectContaining({
      first_name: expect.any(String),
      last_name: expect.any(String),
      email: expect.any(String),
      password: expect.stringMatching(/^\$2[aby]\$/),
      role: expect.stringMatching(/^(user|admin)$/),
      pets: [],
    }));

    const petsResponse = await request(app).get('/api/pets');
    expect(petsResponse.status).toBe(200);
    expect(petsResponse.body.payload).toHaveLength(30);
    expect(petsResponse.body.payload[0]).toEqual(expect.objectContaining({
      name: expect.any(String),
      specie: expect.any(String),
      adopted: false,
    }));
  });
});
