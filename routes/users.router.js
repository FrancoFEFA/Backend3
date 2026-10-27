const express = require('express');
const User = require('../models/user.model');

const router = express.Router();
router.get('/', async (req, res) => {
  try {
    const users = await User.find().lean();
    return res.json({ status: 'success', payload: users });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

module.exports = router;
