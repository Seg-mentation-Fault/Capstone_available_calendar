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
      raw: true,
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
 * @param {object} attributes - object with the data neded, not neccessary
 * @param {date} attributes.date - the day when the user create the reseravation
 * @param {integer} attributes.ParkId - the Id number of the Park
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

/**
 * deleteUser - delete an user by email
 * @async
 * @param {} storage - Constructor of the data base strorage.
 * @param {object} attributes - object with the data neded
 * @param {string} attributes.email - the email of the user to be deleted
 * @param {} t - the key for the transactions
 * @return {Object} user - record of user to find or not if does not exits
 */
const deleteUser = async (storage, attributes, t) => {
  try {
    const deleteattr = { email: attributes.email };
    const deleted = await storage.deleteRecord('User', deleteattr, t);
    if (deleted >= 1) {
      return { done: true };
    }
    throw new Error('nothig was deleted');
  } catch (err) {
    throw err;
  }
};

/**
 * updateUser - updates an user by email
 * @async
 * @param {} storage - Constructor of the data base strorage.
 * @param {object} Oldattributes - object with the data neded
 * @param {string} Oldattributes.email - the email of the user to be updated
 * @param {object} newAttributes - the object with the attributes to be updated
 * @param {} t - the key for the transaction action
 * @return {Object} user - record of user to find or not if does not exits
 */
const updateUser = async (storage, oldAttributes, newAttributes) => {
  try {
    const updated = await storage.user.update(newAttributes, {
      where: oldAttributes,
    });
    return updated;
  } catch (err) {
    throw err;
  }
};

exports.createUser = createUser;
exports.getUser = getUser;
exports.getAllUser = getAllUser;
exports.deleteUser = deleteUser;
exports.updateUser = updateUser;
