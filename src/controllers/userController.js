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

exports.createUser = createUser;
