const User = require('../models/user');
const Reservation = require('../models/reservation');

//  Class to manipulate database
class DBstorage {
  constructor(sequelize) {
    this.user = User(sequelize);
    this.reservations = Reservation(sequelize);
    this.client = sequelize;
    this.models = sequelize.models;
  }
}

module.exports = DBstorage;
