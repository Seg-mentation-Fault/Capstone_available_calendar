const express = require('express');
const cors = require('cors');

const storage = require('./src/connection');
const routes = require('./src/routes');

const app = express();
const port = 3000;

// enable cors
app.use(cors());

//  encode and decode to json url
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// go to the diferents endpoits
app.use('/api/v1', routes(storage));

app.listen(port, () => {
  console.log('is runing in port 3000');
});
