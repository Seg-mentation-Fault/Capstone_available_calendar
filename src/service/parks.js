const {
  createPark,
  getAllPark,
  updatePark,
} = require('../controllers/parkContrlloers');

/**
 * parks - get all parks
 * @param {*} storage - Constructor of the data base strorage.
 * @returns a list of parks
 */
const parks = async (storage) => {
  try {
    // create the list with all parks
    const parksList = await getAllPark(storage);
    return parksList;
  } catch (err) {
    throw err;
  }
};

/**
 * newPark - Creates a new park
 * @param {*} storage - Constructor of the data base strorage.
 * @param {*} attributes - Object with data to create the new user
 * @param {String} attributes.name - the name of the new park
 * @param {Number} attributes.capacity - the exact capacity of the new park
 * @param {Number} attributes.description - Despription of the mark max length 100 characteres
 * @returns {Object} park - record of the new park
 */
const newPark = async (storage, attributes) => {
  const t = await storage.client.transaction();
  try {
    let park = await storage.park.findOne({
      where: { name: attributes.name },
    });
    if (park === null) {
      park = await createPark(
        storage,
        {
          name: attributes.name,
          capacity: attributes.capacity,
          description: attributes.description,
        },
        t
      );
      await t.commit();
      return park;
    }
    return { done: false, msg: `Park ${attributes.name} alrready exist` };
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

/**
 * putPark - upadate a park information
 * @param {*} storage - Constructor of the data base strorage.
 * @param {*} attributes  Object with data to update the park
 * @param {*} attributes.id  Id of the park to update
 */
const putPark = async (storage, attributes) => {
  const t = await storage.client.transaction();

  try {
    // check if a park exists to update exists
    let park = await storage.park.findOne({
      where: { id: attributes.id },
    });
    if (park === null) {
      throw new Error(`Park ${park.name} do not exist`);
    }
    // set the new attributes to update
    const newAttr = { name: park.name, capacity: park.capacity };
    if (attributes.name) {
      newAttr.name = attributes.name;
    }
    if (attributes.capacity) {
      newAttr.capacity = attributes.capacity;
    }
    if (attributes.description) {
      newAttr.description = attributes.description;
    }
    park = await updatePark(storage, { id: attributes.id }, newAttr, t);
    if (park >= 1) {
      await t.commit();
      return { done: true };
    }
    throw new Error('Nothing was updated');
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

exports.parks = parks;
exports.newPark = newPark;
exports.putPark = putPark;
