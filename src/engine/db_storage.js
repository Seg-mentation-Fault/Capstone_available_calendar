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
}

module.exports = DBstorage;
