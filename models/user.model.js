const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  pets: [{ _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Pets' } }],
}, { collection: 'Users' });

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
