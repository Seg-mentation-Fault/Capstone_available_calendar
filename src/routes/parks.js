const express = require('express');
const { body, validationResult } = require('express-validator');
const { parks, newPark, putPark } = require('../service/parks');

const router = express.Router();

const validation = [
  body('name')
    .trim()
    .escape()
    .isAlphanumeric('es-ES', { ignore: ' ' })
    .withMessage('Name must be a string'),
  body('capacity')
    .escape()
    .isInt()
    .withMessage('Capacity should be an integer'),
];

const validation2 = [
  body('name')
    .optional()
    .trim()
    .escape()
    .isAlphanumeric('es-ES', { ignore: ' ' })
    .withMessage('Name must be a string'),
  body('capacity')
    .optional()
    .escape()
    .isInt()
    .withMessage('Capacity should be an integer'),
  body('id').escape().isInt().withMessage('Id should be an integer'),
];

module.exports = (storage) => {
  router.get('/', async (req, res) => {
    try {
      const parksList = await parks(storage);
      return res.json(parksList);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  });

  router.post('/', validation, async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { name, capacity } = req.body;
      const park = await newPark(storage, { name, capacity });
      return res.json(park);
    } catch (err) {
      return res.status(400).json({ done: false, error: err.message });
    }
  });

  router.put('/', validation2, async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { id } = req.body;
      const name = req.body.name ? req.body.name : null;
      const capacity = req.body.capacity ? req.body.capacity : null;

      const updated = await putPark(storage, { id, name, capacity });
      return res.json(updated);
    } catch (err) {
      return res.status(400).json({ done: false, error: err.message });
    }
  });

  return router;
};
