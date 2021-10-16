/**
 * getParkCapacityDay - Get capacity of a park for given date.
 * @async
 * @param {} storage - Constructor of the data base strorage.
 * @param {Object} attributes - Object with the date and park id
 * @param {string} attributes.date - String with the date farmat "yyyy-mm-dd"
 * @param {Number} attributes.ParkId - The number id of a park
 * @return {Number} dayCapacity - is the capacity of any park for a given date
 */
const getParkCapacityDay = async (storage, attributes) => {
  try {
    const capacityDay = await storage.parkCapacity.findOne({
      where: {
        date: attributes.date,
        ParkId: attributes.ParkId,
      },
    });
    return capacityDay.dayCapacity;
  } catch (err) {
    throw err;
  }
};

/**
 * getParkCapacityDay - Get all parks that match with a given date.
 * @async
 * @param {} storage - Constructor of the data base strorage.
 * @param {Object} data - Object with the date to search parks
 * @param {string} data.date - String with the date farmat "yyyy-mm-dd"
 * @return {Array} parksDays - List with objejects of all parksCapacitys for a given date
 */
const getAllParksDay = async (storage, data) => {
  try {
    const parksDays = await storage.parkCapacity.findAll({
      where: { date: data.date },
      include: {
        model: storage.park,
      },
    });
    console.log(parksDays);
    return parksDays;
  } catch (err) {
    throw err;
  }
};

exports.getParkCapacityDay = getParkCapacityDay;
exports.getAllParksDay = getAllParksDay;
