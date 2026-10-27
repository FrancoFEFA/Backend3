const express = require('express');
const User = require('../models/user.model');
const Pet = require('../models/pet.model');
const { generateUsers, generatePets } = require('../services/mocking');

const router = express.Router();

function readCount(value, fallback) {
  if (value === undefined) return fallback;
  const count = Number(value);
  return Number.isSafeInteger(count) && count >= 0 ? count : null;
}

router.get('/mockingpets', (req, res) => {
  const count = readCount(req.query.num ?? req.query.quantity, 100);
  if (count === null) return res.status(400).json({ status: 'error', message: 'num debe ser un entero no negativo' });
  return res.json({ status: 'success', payload: generatePets(count) });
});

router.get('/mockingusers', (req, res) => {
  const count = readCount(req.query.num ?? req.query.quantity, 50);
  if (count === null) return res.status(400).json({ status: 'error', message: 'num debe ser un entero no negativo' });
  return res.json({ status: 'success', payload: generateUsers(count) });
});

router.post('/generateData', async (req, res) => {
  const usersCount = readCount(req.body.users, null);
  const petsCount = readCount(req.body.pets, null);
  if (usersCount === null || petsCount === null) {
    return res.status(400).json({ status: 'error', message: 'users y pets deben ser enteros no negativos' });
  }
  if (usersCount + petsCount > 10000) {
    return res.status(400).json({ status: 'error', message: 'El máximo combinado es 10000 registros' });
  }
  if (User.db.readyState !== 1) {
    return res.status(503).json({ status: 'error', message: 'MongoDB no está conectado; configura MONGO_URL' });
  }

  try {
    const [users, pets] = await Promise.all([
      usersCount ? User.insertMany(generateUsers(usersCount)) : [],
      petsCount ? Pet.insertMany(generatePets(petsCount)) : [],
    ]);
    return res.status(201).json({ status: 'success', inserted: { users: users.length, pets: pets.length } });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'No se pudieron insertar los datos', details: error.message });
  }
});

module.exports = router;
