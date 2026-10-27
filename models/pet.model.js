const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specie: { type: String, required: true },
  birthDate: Date,
  adopted: { type: Boolean, default: false },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  image: String,
}, { collection: 'Pets' });

module.exports = mongoose.models.Pet || mongoose.model('Pet', petSchema);
