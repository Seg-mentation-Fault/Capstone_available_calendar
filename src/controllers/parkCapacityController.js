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
 * getAllParksDay - Get all parks that match with a given date.
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
    return parksDays;
  } catch (err) {
    throw err;
  }
};

/**
 * newParkCapacity - insert a new record with tha capacity for a specific park
 * @param {*} storage - Constructor of the data base strorage.
 * @param {Object} attributes - Object with the date to search parks
 * @param {String} attributes.date - String with the date farmat "yyyy-mm-dd"
 * @param {Number} attributes.dayCapacity - The capacity to set in a specific park for a given day
 * @param {Nuber} attributes.ParkId - The id number of a park
 * @param {} t - transaction of the ORM
 * @return {Object} parkCapacity - record of the new park capacity
 */
const newParkCapacity = async (storage, attributes, t) => {
  try {
    let parkCapacity = await storage.parkCapacity.findOne({
      where: { date: attributes.date, ParkId: attributes.ParkId },
    });
    const fullCapacity = await storage.park.findOne({
      attributes: ['capacity'],
      where: { id: attributes.ParkId },
    });
    if (
      parkCapacity === null &&
      attributes.dayCapacity <= fullCapacity.dataValues.capacity
    ) {
      parkCapacity = await storage.createRecord(
        'ParkCapacity',
        {
          date: attributes.date,
          dayCapacity: attributes.dayCapacity,
          ParkId: attributes.ParkId,
        },
        t
      );
    }
    return parkCapacity;
  } catch (err) {
    throw err;
  }
};

exports.getParkCapacityDay = getParkCapacityDay;
exports.getAllParksDay = getAllParksDay;
exports.newParkCapacity = newParkCapacity;
