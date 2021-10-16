//  controllers for models
const { createUser } = require('../controllers/userController');
const { getParkCapacityDay } = require('../controllers/parkCapacityController');
const {
  createReservation,
  capacityConfirm,
} = require('../controllers/reservationController');

const newUserReservation = async (storage, userAttr, reservationAttr) => {
  const t = await storage.client.transaction();

  try {
    const ConfirmGuest = await capacityConfirm(storage, reservationAttr);
    const capacityDay = await getParkCapacityDay(storage, reservationAttr);
    if (reservationAttr.numOfGuests > capacityDay.dayCapacity - ConfirmGuest) {
      throw new Error('No Capacity');
    }
    const user = createUser(storage, userAttr, t);
    const reservation = await createReservation(
      storage,
      reservationAttr,
      user.id,
      t
    );
    await t.commit();
    return { reservation };
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

exports.newUserReservation = newUserReservation;
