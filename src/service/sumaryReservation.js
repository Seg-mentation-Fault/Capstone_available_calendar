//  controllers for models
const { getParkCapacityDay } = require('../controllers/parkCapacityController');
const { capacityConfirm } = require('../controllers/reservationController');
/**
 * summary - get the capacity of a park and the confirm guests
 * @async
 * @param {} storage - Constructor of the data base strorage.
 * @param {Object} reservationAttr - Object with data to find parks
 * @param {String} reservationAttr.date - String with the date format "yyyy-mm-dd"
 * @param {Number} reservationAttr.ParkId - Id Number of the park
 * @return {Object}
 */
const summary = async (storage, reservationAttr) => {
  try {
    const ConfirmGuest = await capacityConfirm(storage, reservationAttr);
    const capacityDay = await getParkCapacityDay(storage, reservationAttr);
    const result = {
      capacityDay,
      ConfirmGuest,
      remainingCapacity: capacityDay - ConfirmGuest,
    };
    return result;
  } catch (error) {
    throw error;
  }
};

exports.summary = summary;
