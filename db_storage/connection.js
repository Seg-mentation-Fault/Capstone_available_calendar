const { Sequelize } = require('sequelize');
const DBstorage = require('./engine/db_storage');

const { db } = require('./credentials');

const sequelize = new Sequelize(db.database, db.user, db.password, {
  host: db.host,
  dialect: 'mysql',
  port: db.port,
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
    const storage = new DBstorage(sequelize);
    console.log(storage.models);
  })
  .catch((error) => console.error('Unable to connect to the database:', error));
