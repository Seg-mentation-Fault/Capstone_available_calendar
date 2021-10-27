const { getAllParksId } = require('../controllers/parkCapacityController');

/**
 * parksById - Get all parks with their capacity for a given park id
 * @async
 * @param {} storage - Constructor of the data base strorage.
 * @param {Object} data - Object with data to find parks
 * @param {String} data.ParkId -number of the park id.
 * @return {Array} Array - a list of parks capacities for a given park.
 */
const parksById = async (storage, data) => {
  try {
    // create the list with all parks
    const parks = await getAllParksId(storage, { ParkId: data.ParkId });
    const result = [];
    // Only return some fields
    parks.forEach((element) => {
      const parkInfo = {
        date: element.date,
        dayCapacity: element.dayCapacity,
        name: element.Park.name,
        ParkId: element.ParkId,
        createdAt: element.createdAt,
        updatedAt: element.updatedAt,
      };
      result.push(parkInfo);
    });
    return result;
  } catch (err) {
    throw err;
  }
};

exports.parksById = parksById;
