/**
 * createUser - Verify if a user alrready exists by email, create a new if don't exists
 * @async
 * @param {} storage - Constructor of the data base strorage.
 * @param {Object} attributes - Object with data to create the new user
 * @param {String} attributes.email - String with a valid email
 * @param {String} attributes.firstName - String with the first name
 * @param {String} attributes.lastName - String with the last name
 * @return {Object} user - record of the new user
 */
const createUser = async (storage, attributes, t) => {
  try {
    //  checks if the user exits by email
    let user = await storage.user.findOne({
      where: { email: attributes.email },
    });
    if (user === null) {
      user = await storage.createRecord(
        'User',
        {
          firstName: attributes.firstName,
          lastName: attributes.lastName,
          email: attributes.email,
        },
        t
      );
    }
    return user;
  } catch (err) {
    throw err;
  }
};

/**
 * getUser - verify if a user exits or does not exits
 * @async
 * @param {} storage - Constructor of the data base strorage.
 * @param {Object} attributes - Object with data to get a user
 * @param {String} attributes.email - String with a valid email
 * @return {Object} user - record of user to find or not if does not exits
 */
const getUser = async (storage, attributes) => {
  try {
    const user = await storage.user.findOne({
      where: { email: attributes.email },
    });
    if (user) {
      return user;
    }
    throw new Error('there is no such user');
  } catch (err) {
    throw err;
  }
};

/**
 * getAllUser - gives all the users for all reservations
 * @async
 * @param {} storage - Constructor of the data base strorage.
 * @return {Object} user - record of user to find or not if does not exits
 */
const getAllUser = async (storage, attributes = null) => {
  try {
    if (attributes === null) {
      const users = await storage.user.findAll({ raw: true });
      return users;
    }
    const reservationDate = await storage.reservation.findAll({
      where: { date: attributes.date, ParkId: attributes.ParkId },
      include: {
        model: storage.user,
      },
    });
    // console.log(reservationDate);
    const users = [];
    const ids = [];
    reservationDate.forEach((element) => {
      if (!ids.includes(element.dataValues.User.dataValues.id)) {
        users.push(element.dataValues.User.dataValues);
      }
      ids.push(element.dataValues.User.dataValues.id);
    });
    return users;
    // throw new Error('there is not users');
  } catch (err) {
    throw err;
  }
};

exports.createUser = createUser;
exports.getUser = getUser;
exports.getAllUser = getAllUser;
