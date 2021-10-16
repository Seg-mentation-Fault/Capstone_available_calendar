const express = require('express');

const parksRoute = require('./parks');
const reservationRoute = require('./reservation');

const router = express.Router();

module.exports = (storage) => {
  router.get('/', (req, res) => {
    res.sendStatus(200);
  });

  router.use('/retrive-parks-date', parksRoute(storage));
  router.use('/reservation', reservationRoute(storage));
  return router;
};
