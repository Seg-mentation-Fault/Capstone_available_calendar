const {
  createPark,
  getAllPark,
  updatePark,
} = require('../controllers/parkContrlloers');

/**
 *
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
 *
 * @param {*} storage - Constructor of the data base strorage.
 * @param {*} attributes - Object with data to create the new user
 * @param {String} attributes.name - the name of the park
 * @param {String} attributes.capacity - the exact cacity of the park
 * @returns
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
 *
 * @param {*} storage
 * @param {*} attributes
 * @returns
 */
const putPark = async (storage, attributes) => {
  const t = await storage.client.transaction();

  try {
    let park = await storage.park.findOne({
      where: { name: attributes.name },
    });
    if (park === null) {
      throw new Error(`Park ${attributes.name} do not exist`);
    }
    const newAttr = { name: park.name, capacity: park.capacity };

    if (attributes.name && attributes.name !== park.name) {
      newAttr.name = attributes.name;
    }
    if (attributes.capacity && attributes.c !== park.capacity) {
      newAttr.capacity = attributes.capacity;
    }
    park = await updatePark(storage, { id: attributes.id }, newAttr, t);
    if (park >= 1) {
      return { done: true };
    }
    throw new Error('Nothing was updated');
  } catch (err) {
    throw err;
  }
};

exports.parks = parks;
exports.newPark = newPark;
exports.putPark = putPark;
