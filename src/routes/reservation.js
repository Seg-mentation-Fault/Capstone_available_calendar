const express = require('express');
const { body, validationResult } = require('express-validator');

const { newUserReservation } = require('../service/userReservation');
const { getReservations } = require('../service/getReservations');
const { summary } = require('../service/sumaryReservation');

const router = express.Router();

const validation = [
  body('firstName')
    .isAlpha()
    .trim()
    .isLength({ min: 2 })
    .escape()
    .withMessage('First name must be a string'),
  body('lastName')
    .isAlpha()
    .trim()
    .isLength({ min: 2 })
    .escape()
    .withMessage('Last name must be a string'),
  body('email')
    .notEmpty()
    .isEmail()
    .normalizeEmail()
    .withMessage('email should be a valid email'),
  body('numOfGuests')
    .trim()
    .escape()
    .isInt({ min: 1 })
    .withMessage('guest should be an Integer and above 0'),
  body('date')
    .isDate()
    .withMessage('date should an actual date format yyyy-mm-dd'),
  body('ParkId')
    .notEmpty()
    .trim()
    .escape()
    .isInt()
    .withMessage('Id should be an integer'),
];
const validation2 = [
  body('date')
    .isDate()
    .withMessage('date should an actual date format yyyy-mm-dd'),
  body('ParkId')
    .notEmpty()
    .trim()
    .escape()
    .isInt()
    .withMessage('Id should be an integer'),
];

module.exports = (storage) => {
  // Create a new reservation
  router.post('/', validation, async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { firstName, lastName, email, numOfGuests, date, ParkId } =
        req.body;
      const newReservation = await newUserReservation(
        storage,
        { firstName, lastName, email },
        { numOfGuests, date, ParkId }
      );
      return res.json({
        done: true,
        confirmCode: newReservation.reservation.confirmCode,
      });
    } catch (err) {
      return res.status(400).json({ done: false, error: err.message });
    }
  });

  // Retrive a list of reservation for a given park and date
  router.post('/list', validation2, async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { date, ParkId } = req.body;
      const reservations = await getReservations(storage, {
        date,
        ParkId,
      });
      return res.json(reservations);
    } catch (err) {
      return res.status(400).json({ done: false, error: err.message });
    }
  });

  // Retrive a object with a summary for a given park and date
  router.post('/summary', validation2, async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { date, ParkId } = req.body;
      const summaryReservation = await summary(storage, {
        date,
        ParkId,
      });
      return res.json(summaryReservation);
    } catch (err) {
      return res.status(400).json({ done: false, error: err.message });
    }
  });
  return router;
};
