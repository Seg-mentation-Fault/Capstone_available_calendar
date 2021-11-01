//  controllers for models
const { getAllReservation } = require('../controllers/reservationController');

/**
 * getReservations - Get reservation for a given park and date
 * @async
 * @param {} storage - Constructor of the data base strorage.
 * @param {Object} reservationAttr - Object with data to find parks
 * @param {String} reservationAttr.date - String with the date format "yyyy-mm-dd"
 * @param {Number} reservationAttr.ParkId - Id Number of the park
 * @return {Array}
 */
const getReservations = async (storage, reservationAttr) => {
  try {
    const reservationList = await getAllReservation(storage, {
      date: reservationAttr.date,
      ParkId: reservationAttr.ParkId,
    });
    const result = [];
    reservationList.forEach((element) => {
      const reservation = {
        confirmCode: element.confirmCode,
        numOfGuests: element.numOfGuests,
        name: `${element['User.firstName']} ${element['User.lastName']}`,
        email: element['User.email'],
      };
      result.push(reservation);
    });
    return result;
  } catch (error) {
    throw error;
  }
};

exports.getReservations = getReservations;
