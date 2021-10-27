const express = require('express');

const parksRoute = require('./parks');
const parkCapacityRoute = require('./parkCapacity');
const reservationRoute = require('./reservation');

const router = express.Router();

module.exports = (storage) => {
  router.get('/', (req, res) => {
    res.sendStatus(200);
  });

  router.use('/parks', parksRoute(storage));
  // router.use('/retrive-parks-date', parkCapacityRoute(storage));
  router.use('/parkcapacity', parkCapacityRoute(storage));
  router.use('/reservation', reservationRoute(storage));
  return router;
};
