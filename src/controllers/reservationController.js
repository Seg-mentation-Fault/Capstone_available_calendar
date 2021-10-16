const randomstring = require('randomstring');

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
exports.createReservation = createReservation;
exports.capacityConfirm = capacityConfirm;
