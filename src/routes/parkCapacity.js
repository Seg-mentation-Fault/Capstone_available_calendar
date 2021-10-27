const express = require('express');
const { body, validationResult } = require('express-validator');
const { parksByDay } = require('../service/parksByDay');
const { parksById } = require('../service/parksCapacityById');
const { updateCapacity } = require('../service/updateParkCapacity');
const { addParkCapacity } = require('../service/addParkCapacity');

const router = express.Router();

const validation = [
  body('numOfGuests')
    .trim()
    .escape()
    .isInt({ min: 1 })
    .withMessage('guest should be an Integer and above 0'),
  body('date')
    .isDate()
    .withMessage('date should an actual date format yyyy-mm-dd'),
];
const validation2 = [
  body('ParkId')
    .trim()
    .escape()
    .isInt()
    .withMessage('ParkI ID should be an integer'),
];
const validation3 = [
  body('date')
    .isDate()
    .withMessage('date should an actual date format yyyy-mm-dd'),
  body('dayCapacity')
    .trim()
    .escape()
    .isInt()
    .withMessage('park capacity should be an Integer'),
  body('ParkId').isInt().withMessage('ParkI ID should be an integer'),
];

module.exports = (storage) => {
  // get all parks with availability status for n guests
  router.post('/availability', validation, async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { numOfGuests, date } = req.body;
      const parks = await parksByDay(storage, { numOfGuests, date });
      return res.json(parks);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  });

  // get all dates with thei capacity for a given park
  router.post('/byparkid', validation2, async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { ParkId } = req.body;
      const parks = await parksById(storage, { ParkId });
      return res.json(parks);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  });

  // Add a new park capacity for a park on a given day
  router.post('/', validation3, async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { ParkId, date, dayCapacity } = req.body;
      const parks = await addParkCapacity(storage, {
        ParkId,
        date,
        dayCapacity,
      });
      return res.json(parks);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  });

  // update a par capacity for a given day and park ID
  router.put('/', validation3, async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { ParkId, date, dayCapacity } = req.body;
      const parks = await updateCapacity(storage, {
        ParkId,
        date,
        dayCapacity,
      });
      return res.json(parks);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  });
  return router;
};
