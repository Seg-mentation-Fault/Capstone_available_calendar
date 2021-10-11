const express = require('express');

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('<h1> Express DEMO SGMF v0.2 </ h1>');
});

app.get('/api/v1', (req, res) => {
  res.send({
    status: true,
  });
});

app.listen(port, () => {
  console.log('is runing in port 3000');
});
