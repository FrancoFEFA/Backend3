const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { generateUsers, generatePets } = require('../services/mocking');

describe('generateUsers', () => {
  test('genera la cantidad de usuarios solicitada', () => {
    expect(generateUsers(0)).toHaveLength(0);
    expect(generateUsers(1)).toHaveLength(1);
    expect(generateUsers(50)).toHaveLength(50);
    expect(generateUsers(100)).toHaveLength(100);
  });

  test('genera documentos con el formato esperado por Mongo', () => {
    const [user] = generateUsers(1);

    expect(user).toEqual(expect.objectContaining({
      first_name: expect.any(String),
      last_name: expect.any(String),
      email: expect.stringMatching(/^mock\..+@example\.com$/),
      password: expect.any(String),
      pets: [],
    }));
    expect(mongoose.isValidObjectId(user._id)).toBe(true);
    expect(user.__v).toBe(0);
  });

  test('guarda la contraseña coder123 encriptada', () => {
    const users = generateUsers(5);

    users.forEach((user) => {
      expect(user.password).not.toBe('coder123');
      expect(bcrypt.compareSync('coder123', user.password)).toBe(true);
    });
  });

  test('genera roles user y admin', () => {
    const roles = generateUsers(100).map((user) => user.role);

    expect(new Set(roles)).toEqual(new Set(['user', 'admin']));
  });

  test('genera emails únicos', () => {
    const emails = generateUsers(50).map((user) => user.email);

    expect(new Set(emails).size).toBe(emails.length);
  });
});

describe('generatePets', () => {
  test('genera la cantidad de mascotas solicitada', () => {
    expect(generatePets(0)).toHaveLength(0);
    expect(generatePets(7)).toHaveLength(7);
  });

  test('genera documentos con el formato esperado por Mongo', () => {
    const [pet] = generatePets(1);

    expect(pet).toEqual(expect.objectContaining({
      name: expect.any(String),
      specie: expect.any(String),
      birthDate: expect.any(Date),
      adopted: false,
    }));
    expect(mongoose.isValidObjectId(pet._id)).toBe(true);
    expect(pet.__v).toBe(0);
  });
});
