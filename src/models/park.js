const { DataTypes, Model } = require('sequelize');

const mapPark = (sequelize) => {
  class Park extends Model {}

  Park.init(
    {
      // Model attributes are defined here
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
      },
      name: {
        type: DataTypes.STRING(128),
        notEmpty: true,
        allowNull: false,
        validate: {
          is: /^[A-Za-z 0-9]+$/,
        },
      },
      capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      // Other model options go here
      sequelize, // We need to pass the connection instance
      modelName: 'Park', // We need to choose the model name
    }
  );
  (async () => {
    await Park.sync();
  })();
  return Park;
};

module.exports = mapPark;
