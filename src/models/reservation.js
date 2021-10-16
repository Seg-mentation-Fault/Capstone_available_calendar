const { DataTypes, Model } = require('sequelize');
const randomstring = require('randomstring');

const User = require('./user');
const Park = require('./park');

const mapReservation = (sequelize) => {
  class Reservation extends Model {}

  Reservation.init(
    {
      // Model attributes are defined here
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          isDate: true,
        },
      },
      numOfGuests: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
        },
      },
      confirmCode: {
        type: DataTypes.STRING(6),
        defaultValue: randomstring.generate({
          length: 6,
          charset: 'alphanumeric',
        }),
        allowNull: false,
        unique: true,
      },
    },
    {
      // Other model options go here
      sequelize, // We need to pass the connection instance
      modelName: 'Reservation', // We need to choose the model name
    }
  );
  (async () => {
    Reservation.removeAttribute('id');

    // Forein key for parkId
    const park = Park(sequelize);
    Reservation.belongsTo(park);
    park.hasMany(Reservation);

    // Forein key for userId
    const user = User(sequelize);
    Reservation.belongsTo(user);
    user.hasMany(Reservation);

    await Reservation.sync();
  })();
  return Reservation;
};

module.exports = mapReservation;
