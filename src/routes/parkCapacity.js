const express = require('express');
const { body, validationResult } = require('express-validator');
const { parksByDay } = require('../service/parksByDay');

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

module.exports = (storage) => {
  router.post('/', validation, async (req, res) => {
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

  return router;
};
