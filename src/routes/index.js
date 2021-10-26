const express = require('express');

const parksRoute = require('./parks');
const parkCapacityRoute = require('./parkCapacity');
const reservationRoute = require('./reservation');

const router = express.Router();

module.exports = (storage) => {
  router.get('/', (req, res) => {
    res.sendStatus(200);
  });

  router.use('/parks', parksRoute(storage)); // should be parksRoute
  router.use('/retrive-parks-date', parkCapacityRoute(storage)); // should be parksCapacityRoute
  router.use('/reservation', reservationRoute(storage));
  return router;
};
