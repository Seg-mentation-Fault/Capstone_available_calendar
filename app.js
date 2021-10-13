const express = require('express');

const storage = require('./db_storage/connection');
const routes = require('./routes');

const app = express();
const port = 3000;

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use('/api/v1', routes(storage));

app.listen(port, () => {
  console.log('is runing in port 3000');
});
