const { Sequelize } = require('sequelize');

const DBstorage = require('./engine/db_storage');
const { db } = require('./credentials');

const connectMysql = () => {
  const sequelize = new Sequelize(db.database, db.user, db.password, {
    host: db.host,
    dialect: 'mysql',
    port: db.port,
  });

  sequelize
    .authenticate()
    .then(() => {
      console.log('Connection has been established successfully.');
    })
    .catch((error) =>
      console.error('Unable to connect to the database:', error)
    );
  return sequelize;
};

const mysql = connectMysql();
const storage = new DBstorage(mysql);

module.exports = storage;
