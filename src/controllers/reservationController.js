const randomstring = require('randomstring');

/**
 * createReservation - Post a new reservation record.
 * @async
 * @param {} storage - Constructor of the data base strorage.
 * @param {Object} attributes - Object with data to create the new reservation
 * @param {string} attributes.date - String with the date farmat "yyyy-mm-dd"
 * @param {Number} attributes.numOfGuests - Number of guests
 * @param {Number} attributes.ParkId - Id number of a park
 * @param {Number} userId - Id number for a specific user
 * @return {Object} reservation - record of the new reservation
 */
const createReservation = async (storage, attributes, userId, t) => {
  try {
    const reservation = await storage.createRecord(
      'Reservation',
      {
        confirmCode: randomstring.generate({
          length: 6,
          charset: 'alphanumeric',
        }),
        date: attributes.date,
        numOfGuests: attributes.numOfGuests,
        ParkId: attributes.ParkId,
        UserId: userId,
      },
      t
    );

    return reservation;
  } catch (err) {
    throw err;
  }
};

/**
 * capacityConfirm - Get the sum of all guests confirmations for a given park an day
 * @async
 * @param {} storage - Constructor of the data base strorage.
 * @param {Object} attributes - Object with data to create the new reservation
 * @param {string} attributes.date - String with the date farmat "yyyy-mm-dd"
 * @param {Number} attributes.ParkId - Id number of a park
 * @return {Object} reservation - record of the new reservation
 */
const capacityConfirm = async (storage, attributes) => {
  try {
    //  returns the numbers of guests confirms
    let ConfirmGuest = await storage.reservation.sum('numOfGuests', {
      where: { date: attributes.date, ParkId: attributes.ParkId },
    });
    if (Object.is(ConfirmGuest, NaN) === true) {
      ConfirmGuest = 0;
    }
    return ConfirmGuest;
  } catch (err) {
    throw err;
  }
};

/**
 * getReservation - Get all reservation filter by given data
 * @param {*} storage -Constructor of the data base strorage.
 * @param {Object} attributes - Object with data to filter the search
 * @return {Array} reservations - list with all reservations for a park in a specific date
 */
const getAllReservation = async (storage, attributes) => {
  try {
    const query = await storage.reservation.findAll({
      where: attributes,
    });
    const reservations = [];
    query.forEach((element) => {
      reservations.push(element.dataValues);
    });
    return reservations;
  } catch (err) {
    throw err;
  }
};
exports.createReservation = createReservation;
exports.capacityConfirm = capacityConfirm;
exports.getAllReservation = getAllReservation;
