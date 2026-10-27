require('dotenv').config();
const express = require('express');
const app = express();

const port = process.env.PORT || 3000;
const mocksRouter = require('./routes/mocks.router');
const usersRouter = require('./routes/users.router');
const petsRouter = require('./routes/pets.router');
const mongoose = require('mongoose');

app.use(express.json());
app.use('/api/mocks', mocksRouter);
app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);

if (process.env.MONGO_URL) {
  mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('Conectado a MongoDB'))
    .catch((error) => console.error('Error al conectar con MongoDB:', error.message));
}

if (require.main === module) {
  app.listen(port, () => console.log(`Server corriendo en el puerto ${port}`));
}

module.exports = app;

