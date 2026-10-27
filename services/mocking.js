const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const passwordHash = bcrypt.hashSync('coder123', 10);
const firstNames = ['Alex', 'Sam', 'Taylor', 'Jordan', 'Casey', 'Morgan', 'Riley', 'Avery'];
const lastNames = ['Smith', 'Garcia', 'Lee', 'Brown', 'Wilson', 'Lopez', 'Martin', 'Davis'];
const petNames = ['Luna', 'Milo', 'Coco', 'Simba', 'Nala', 'Rocky', 'Kira', 'Toby'];
const species = ['dog', 'cat', 'rabbit', 'bird', 'hamster'];
const pick = (items) => items[Math.floor(Math.random() * items.length)];

function generateUsers(count) {
  return Array.from({ length: count }, () => ({
    _id: new mongoose.Types.ObjectId(),
    first_name: pick(firstNames),
    last_name: pick(lastNames),
    email: `mock.${new mongoose.Types.ObjectId().toString()}@example.com`,
    password: passwordHash,
    role: Math.random() < 0.5 ? 'user' : 'admin',
    pets: [],
    __v: 0,
  }));
}

function generatePets(count) {
  return Array.from({ length: count }, () => ({
    _id: new mongoose.Types.ObjectId(),
    name: pick(petNames),
    specie: pick(species),
    birthDate: new Date(Date.now() - Math.floor(Math.random() * 10 * 365 * 24 * 60 * 60 * 1000)),
    adopted: false,
    __v: 0,
  }));
}

module.exports = { generateUsers, generatePets };
