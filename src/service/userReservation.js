//  controllers for models
const { transporter } = require('./email');
const { createUser } = require('../controllers/userController');
const { getParkCapacityDay } = require('../controllers/parkCapacityController');
const { getParkById } = require('../controllers/parkContrlloers');
const {
  createReservation,
  capacityConfirm,
} = require('../controllers/reservationController');

/**
 * newUserReservation - Post a new reservation and new user if needed
 * @async
 * @param {} storage - Constructor of the data base strorage.
 * @param {Object} userAttr - Object with data to find parks
 * @param {String} userAttr.email - String with a valid email
 * @param {String} userAttr.firstName - String with the first name
 * @param {String} userAttr.lastName - String with the last name
 * @param {Object} reservationAttr - Object with data to find parks
 * @param {String} reservationAttr.date - String with the date format "yyyy-mm-dd"
 * @param {Number} reservationAttr.numOfGuests - Number of guests
 * @param {Number} reservationAttr.ParkId - Id Number of a park
 * @return {Object} reservation - record of the new reservation
 */
const newUserReservation = async (storage, userAttr, reservationAttr) => {
  const t = await storage.client.transaction();

  try {
    const ConfirmGuest = await capacityConfirm(storage, reservationAttr);
    const capacityDay = await getParkCapacityDay(storage, reservationAttr);
    if (reservationAttr.numOfGuests > capacityDay - ConfirmGuest) {
      throw new Error('No Capacity');
    }
    const user = await createUser(storage, userAttr, t);
    const reservation = await createReservation(
      storage,
      reservationAttr,
      user.id,
      t
    );
    const park = await getParkById(storage, reservationAttr);
    const message = {
      from: 'reservation.av.calendar@gmail.com',
      to: userAttr.email,
      subject: `Reservation to ${park.name}`,
      text: `Hi ${userAttr.firstName}
      The reservation was made successfully for a party of ${reservationAttr.numOfGuests} on ${reservationAttr.date}.

      Your confirmation code is ${reservation.confirmCode}`,
    };
    transporter.sendMail(message, (err) => {
      if (err) {
        throw err;
      }
    });
    await t.commit();
    return { reservation };
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

exports.newUserReservation = newUserReservation;
