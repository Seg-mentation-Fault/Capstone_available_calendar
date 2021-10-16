const { DataTypes, Model } = require('sequelize');

const Park = require('./park');

const mapParkCapacity = (sequelize) => {
  class ParkCapacity extends Model {}

  ParkCapacity.init(
    {
      // Model attributes are defined here
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          isDate: true,
        },
      },
      dayCapacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      // Other model options go here
      sequelize, // We need to pass the connection instance
      modelName: 'ParkCapacity', // We need to choose the model name
    }
  );
  (async () => {
    ParkCapacity.removeAttribute('id');

    // Forein key for parkId
    const park = Park(sequelize);
    ParkCapacity.belongsTo(park);
    park.hasMany(ParkCapacity);

    await ParkCapacity.sync();
  })();
  return ParkCapacity;
};

module.exports = mapParkCapacity;
