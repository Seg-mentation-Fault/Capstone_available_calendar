const { updateParkCapacity } = require('../controllers/parkCapacityController');

/**
 * updateCapacity - Update the capacity of a park for a given date
 * @async
 * @param {} storage - Constructor of the data base strorage.
 * @param {Object} data - Object with data to find parks
 * @param {Number} data.ParkId -number of the park id.
 * @param {String} data.date - String with the date farmat "yyyy-mm-dd"
 * @param {Number} data.dayCapacity - the new capacity to update.
 * @return {Array} Array - a list of parks capacities for a given park.
 */
const updateCapacity = async (storage, data) => {
  const t = await storage.client.transaction();

  try {
    // get the full capacity of a park
    const fullCapacity = await storage.park.findOne({
      attributes: ['capacity'],
      where: { id: data.ParkId },
      raw: true,
    });
    if (fullCapacity === null) {
      throw new Error('Park ID does not exist');
    }
    if (fullCapacity.capacity < data.dayCapacity) {
      throw new Error(
        'the new capacity cannot be greater than the full capacity of the park'
      );
    }
    // Update the park capacity for the given date
    const updated = await updateParkCapacity(
      storage,
      { ParkId: data.ParkId, date: data.date },
      { dayCapacity: data.dayCapacity },
      t
    );
    await t.commit();
    return updated;
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

exports.updateCapacity = updateCapacity;
