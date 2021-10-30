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
 * @param {*} storage - Constructor of the data base strorage.
 * @param {Object} attributes - Object with data to filter the search
 * @return {Array} reservations - list with all reservations for a park in a specific date
 */
const getAllReservation = async (storage, attributes) => {
  try {
    const reservations = await storage.reservation.findAll({
      where: attributes,
      include: {
        model: storage.user,
      },
      raw: true,
    });
    return reservations;
  } catch (err) {
    throw err;
  }
};

/**
 * getReservation - Get a reservation filter by confirm code
 * @param {*} storage - Constructor of the data base strorage.
 * @param {Object} attributes - Object with data to filter the search
 * @param {Object} attributes.confirmCode - Object with data to filter the search
 * @return {Array} reservation - object with a specific reservation
 */
const getReservation = async (storage, attributes) => {
  try {
    const reservation = await storage.reservation.findOne({
      where: { confirmCode: attributes.confirmCode },
      raw: true,
    });
    return reservation;
  } catch (err) {
    throw err;
  }
};

/**
 * deleteReservation - delete one reservation by a given confirm code
 * @param {*} storage - Constructor of the data base strorage.
 * @param {Object} attributes - Object with data to delete a reservation
 * @param {String} attributes.confirmCode - String
 * @param {*} t
 * @returns {object} done:true if deletion was success and error if not
 */
const deleteReservation = async (storage, attributes, t) => {
  try {
    const deleted = await storage.deleteRecord(
      'Reservation',
      { confirmCode: attributes.confirmCode },
      t
    );
    if (deleted >= 1) {
      return { done: true };
    }
    throw new Error('Nothing was deleted');
  } catch (err) {
    throw err;
  }
};

/**
 * updateReservation - update a reservation record
 * @param {*} storage - Constructor of the data base strorage.
 * @param {Object} oldAttr -attributes to find the record to update
 * @param {Object} oldAttr.confirmCode -attributes to find the record to update
 * @param {Object} newAttr - atrributes to update
 * @param {*} t - transaction of the ORM
 * @returns {object} done:true if update was success and error if not
 */
const updateReservation = async (storage, oldAttr, newAttr, t) => {
  try {
    const updated = await storage.updateRecord(
      'Reservation',
      { confirmCode: oldAttr.confirmCode },
      newAttr,
      t
    );
    if (updated[0] >= 1) {
      return { done: true };
    }
    throw new Error('Nothing was updated');
  } catch (err) {
    throw err;
  }
};

exports.createReservation = createReservation;
exports.capacityConfirm = capacityConfirm;
exports.getAllReservation = getAllReservation;
exports.getReservation = getReservation;
exports.deleteReservation = deleteReservation;
exports.updateReservation = updateReservation;
