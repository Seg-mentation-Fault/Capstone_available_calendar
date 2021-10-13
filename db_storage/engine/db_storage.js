const randomstring = require('randomstring');

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

  /*  create a new and resevation at the same time
   *  recives two objects, each one is for the createion of its model
   */
  async newUserReservation(userAttr, reservationAttr) {
    const t = await this.client.transaction();

    try {
      let capacityConfirm = await this.reservation.sum('numOfGuests', {
        where: { date: reservationAttr.date, ParkId: reservationAttr.ParkId },
      });
      if (Object.is(capacityConfirm, NaN) === true) {
        capacityConfirm = 0;
      }
      const capacityDay = await this.parkCapacity.findOne({
        where: {
          date: reservationAttr.date,
          ParkId: reservationAttr.ParkId,
        },
      });
      if (
        reservationAttr.numOfGuests >
        capacityDay.dayCapacity - capacityConfirm
      ) {
        throw new Error('No Capacity');
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
          confirmCode: randomstring.generate({
            length: 6,
            charset: 'alphanumeric',
          }),
          date: reservationAttr.date,
          numOfGuests: reservationAttr.numOfGuests,
          ParkId: reservationAttr.ParkId,
          UserId: user.id,
        },
        t
      );
      await t.commit();
      return { reservation };
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  /* return a list of objects with each park for a given date
   * each object contain:
   *   id: for given park date
   *   name: for given park date
   *   aviability: true if there is space, or false if there is not space
   */
  async parkByDay(data) {
    const parksDays = await this.parkCapacity.findAll({
      where: { date: data.date },
      include: {
        model: this.park,
      },
    });

    const result = [];
    parksDays.forEach((element) => {
      const parkInfo = {
        id: element.Park.id,
        name: element.Park.name,
        aviability: element.dayCapacity,
      };
      result.push(parkInfo);
    });
    return Promise.all(
      result.map(async (obj) => {
        const obj2 = obj;
        let capacityConfirm = await this.reservation.sum('numOfGuests', {
          where: { date: data.date, ParkId: obj.id },
        });

        if (Object.is(capacityConfirm, NaN) === true) {
          capacityConfirm = 0;
        }
        if (data.numOfGuests > obj.aviability - capacityConfirm) {
          obj2.aviability = false;
        } else {
          obj2.aviability = true;
        }
        return obj2;
      })
    );
  }
}

module.exports = DBstorage;
