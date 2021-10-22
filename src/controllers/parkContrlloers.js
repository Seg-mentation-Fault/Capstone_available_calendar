/**
 * createPark - creates a new park
 * @async
 * @param {} storage - Constructor of the data base strorage.
 * @param {Object} attributes - Object with data to create the new user
 * @param {String} attributes.name - the name of the park
 * @param {String} attributes.capacity - the exact cacity of the park
 * @param {} t - a key for transactions
 * @return {Object} user - record of the new user
 */
const createPark = async (storage, attributes, t) => {
  try {
    const park = await storage.createRecord(
      'Park',
      {
        name: attributes.name,
        capacity: attributes.capacity,
      },
      t
    );
    return park;
  } catch (err) {
    throw err;
  }
};

exports.createPark = createPark;
