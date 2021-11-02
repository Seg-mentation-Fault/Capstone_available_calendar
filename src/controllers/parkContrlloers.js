/**
 * createPark - creates a new park
 * @async
 * @param {} storage - Constructor of the data base strorage.
 * @param {Object} attributes - Object with data to create the new user
 * @param {String} attributes.name - the name of the park
 * @param {String} attributes.capacity - the exact cacity of the park
 * @param {String} attributes.description - Despription of the mark max length 100 characteres
 * @param {} t - a key for transactions
 * @return {Object} park - record of the new park
 */
const createPark = async (storage, attributes, t) => {
  try {
    const park = await storage.createRecord(
      'Park',
      {
        name: attributes.name,
        capacity: attributes.capacity,
        description: attributes.description,
      },
      t
    );
    return park;
  } catch (err) {
    throw err;
  }
};

/**
 * getPark - find one park by name
 * @async
 * @param {} storage - Constructor of the data base strorage.
 * @param {Object} attributes - Object with data to create the new user
 * @param {String} attributes.name - the name of the park
 * @return {Object} park - the park to be find
 */
const getPark = async (storage, attributes) => {
  try {
    const park = await storage.park.findOne({
      where: { name: attributes.name },
      raw: true,
    });
    if (park) {
      return park;
    }
    throw new Error('that Park did not exits');
  } catch (err) {
    throw err;
  }
};

/**
 * getParkById - find one park by id
 * @async
 * @param {} storage - Constructor of the data base strorage.
 * @param {Object} attributes - Object with data to create the new user
 * @param {String} attributes.ParkId - the name of the park
 * @return {Object} park - the park to be find
 */
const getParkById = async (storage, attributes) => {
  try {
    const park = await storage.park.findOne({
      where: { id: attributes.ParkId },
      raw: true,
    });
    if (park) {
      return park;
    }
    throw new Error('that Park did not exits');
  } catch (err) {
    throw err;
  }
};

/**
 * getAllPark - get all the parks created
 * @async
 * @param {} storage - Constructor of the data base strorage.
 * @return {list} park - a list of all parks createad
 */
const getAllPark = async (storage) => {
  try {
    const parks = await storage.park.findAll({ raw: true });
    return parks;
  } catch (err) {
    throw err;
  }
};

/**
 * deletePark - deletes a park
 * @async
 * @param {} storage - Constructor of the data base strorage.
 * @param {Object} attributes - Object with data to create the new user
 * @param {String} attributes.name - the name of the park
 * @return {integer} park - a number grather tahn 0 of the objects deleted
 */
const deletePark = async (storage, attributes, t) => {
  try {
    const deleteattr = { name: attributes.name };
    const deleted = await storage.deleteRecord('Park', deleteattr, t);
    if (deleted >= 1) {
      return { done: true };
    }
    throw new Error('nothig was deleted');
  } catch (err) {
    throw err;
  }
};

/**
 * updatePark - updates an park by its name
 * @async
 * @param {} storage - Constructor of the data base strorage.
 * @param {object} Oldattributes - object with the data neded
 * @param {string} Oldattributes.name - the name of the park to be updated
 * @param {object} newAttributes - the object with the attributes to be updated
 * @param {} t - the key for the transaction action
 * @return {integer} user - a number grether tan 0 of the records updates
 */
const updatePark = async (storage, oldAttributes, newAttributes, t) => {
  try {
    const updated = await storage.updateRecord(
      'Park',
      oldAttributes,
      newAttributes,
      t
    );
    return updated[0];
  } catch (err) {
    throw err;
  }
};

exports.createPark = createPark;
exports.getPark = getPark;
exports.getParkById = getParkById;
exports.getAllPark = getAllPark;
exports.deletePark = deletePark;
exports.updatePark = updatePark;
