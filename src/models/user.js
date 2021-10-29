const { DataTypes, Model } = require('sequelize');

const mapUser = (sequelize) => {
  class User extends Model {}

  User.init(
    {
      // Model attributes are defined here
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
      },
      firstName: {
        type: DataTypes.STRING(128),
        notEmpty: true,
        allowNull: false,
        validate: {
          isAlphanumeric: false,
          is: /^[A-Za-z \u00f1\u00d1]+$/,
        },
      },
      lastName: {
        type: DataTypes.STRING(128),
        notEmpty: true,
        allowNull: false,
        validate: {
          isAlphanumeric: false,
          is: /^[A-Za-z \u00f1\u00d1]+$/,
        },
      },
      email: {
        type: DataTypes.STRING(128),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
    },
    {
      // Other model options go here
      sequelize, // We need to pass the connection instance
      modelName: 'User', // We need to choose the model name
    }
  );
  (async () => {
    await User.sync();
  })();
  return User;
};

module.exports = mapUser;
