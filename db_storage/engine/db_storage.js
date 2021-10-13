const User = require('../models/user');
const Park = require('../models/park');
const Reservation = require('../models/reservation');
const ParkCapacity = require('../models/parkCapacity');

//  Class to manipulate database
class DBstorage {
  constructor(sequelize) {
    this.user = User(sequelize);
    this.park = Park(sequelize);
    this.parkCapacity = ParkCapacity(sequelize);
    this.reservation = Reservation(sequelize);
    this.client = sequelize;
    this.models = sequelize.models;
  }

  //  create a record for a model
  async createRecord(model, attributes, t) {
    const newRecord = await this.models[model].create(attributes, {
      transaction: t,
    });
    return newRecord;
  }

  //  create a new and resevation at the same time
  //  recives two objects, each one is for the createion of its model
  async newUserReservation(userAttr, reservationAttr) {
    const t = await this.client.transaction();

    try {
      const capacityConfirm = await this.reservation.sum('numOfGuests', {
        where: { date: reservationAttr.date, ParkId: reservationAttr.ParkId },
      });
      const capacityDay = await this.parkCapacity.findOne({
        where: {
          date: reservationAttr.date,
          ParkId: reservationAttr.ParkId,
        },
      });
      console.log('info \n\n', capacityConfirm, capacityDay.dayCapacity);
      if (
        reservationAttr.numOfGuests >
        capacityDay.dayCapacity - capacityConfirm
      ) {
        return { error: true };
      }
      let user = await this.user.findOne({ where: { email: userAttr.email } });
      if (user === null) {
        user = await this.createRecord(
          'User',
          {
            firstName: userAttr.firstName,
            lastName: userAttr.lastName,
            email: userAttr.email,
          },
          t
        );
      }
      const reservation = await this.createRecord(
        'Reservation',
        {
          date: reservationAttr.date,
          numOfGuests: reservationAttr.numOfGuests,
          ParkId: reservationAttr.ParkId,
          UserId: user.id,
        },
        t
      );
      await t.commit();
      return { user, reservation, error: false };
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }
}

module.exports = DBstorage;
