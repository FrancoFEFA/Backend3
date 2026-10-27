const express = require('express');
const Pet = require('../models/pet.model');

const router = express.Router();
router.get('/', async (req, res) => {
  try {
    const pets = await Pet.find().lean();
    return res.json({ status: 'success', payload: pets });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

module.exports = router;
