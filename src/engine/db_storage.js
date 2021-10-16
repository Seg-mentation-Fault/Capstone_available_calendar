//  models for database
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
