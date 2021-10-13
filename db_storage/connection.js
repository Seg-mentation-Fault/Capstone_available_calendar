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
    const userAttr = {
      firstName: 'prueba5',
      lastName: 'Prueba5genial',
      email: 'prueba5@gmail.com',
    };
    const reservationAttr = {
      date: '2021-10-14',
      numOfGuests: 510,
      ParkId: 4,
    };
    storage
      .newUserReservation(userAttr, reservationAttr)
      .then((record) => {
        if (record.error === false) {
          console.log(record.user.firstName);
          console.log(record.reservation.confirmCode);
        } else {
          console.error('No capacity');
          process.exit(1);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  })
  .catch((error) => console.error('Unable to connect to the database:', error));
