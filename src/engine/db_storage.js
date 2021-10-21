//  models for database
const User = require('../models/user');
const Park = require('../models/park');
const Reservation = require('../models/reservation');
const ParkCapacity = require('../models/parkCapacity');

//  Class to manipulate database
class DBstorage {
  /**
   * constructor for the DBstorage
   * @param  {} sequelize [conection to db storage]
   */
  constructor(sequelize) {
    this.user = User(sequelize);
    this.park = Park(sequelize);
    this.parkCapacity = ParkCapacity(sequelize);
    this.reservation = Reservation(sequelize);
    this.client = sequelize;
    this.models = sequelize.models;
  }

  /**
   * createRecord - create a new record for a given model
   * @async
   * @param {String} model - The of the model to create a new record
   * @param {Object} attributes - Object with data to create the new attribute.
   * @param {*} t - transaction of the ORM
   * @return {Object} newRecord - record for a given model
   */
  async createRecord(model, attributes, t) {
    const newRecord = await this.models[model].create(attributes, {
      transaction: t,
    });
    return newRecord;
  }

  /**
   * deleteRecord - delete a row for a given model
   * @param {String} model - The of the model delete a record
   * @param {Object} attributes - Object with data to delete the instance.
   * @param {*} t - transaction of the ORM
   * @returns number of rows deleted
   */
  async deleteRecord(model, attributes, t) {
    const deleted = this.models[model].destroy(
      { where: attributes },
      { transaction: t }
    );
    return deleted;
  }
}

module.exports = DBstorage;
