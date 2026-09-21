const express = require('express');
const app = express();

const port = 3000;
console.log(process.argv[3]);

app.listen(port, () => {
  console.log(`Server corriendo en el puerto ${port}`);
});

