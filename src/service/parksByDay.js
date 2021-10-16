const { getAllParksDay } = require('../controllers/parkCapacityController');
const { capacityConfirm } = require('../controllers/reservationController');

/**
 * parksByDay - Get all parks with their capacity for a given date
 * @async
 * @param {} storage - Constructor of the data base strorage.
 * @param {Object} data - Object with data to find parks
 * @param {String} data.date - String with the date farmat "yyyy-mm-dd"
 * @param {Number} data.numOfGuests - Numberof guests
 * @return {Array} Promise - a list with objects with the name, id and availability.
 */
const parksByDay = async (storage, data) => {
  try {
    // create the list with all parks
    const parksDays = await getAllParksDay(storage, data);
    const result = [];
    parksDays.forEach((element) => {
      const parkInfo = {
        id: element.Park.id,
        name: element.Park.name,
        availability: element.dayCapacity,
      };
      result.push(parkInfo);
    });
    // set availability
    return Promise.all(
      result.map(async (obj) => {
        const obj2 = obj;

        const confirmGuest = await capacityConfirm(storage, {
          date: data.date,
          ParkId: obj.id,
        });

        if (data.numOfGuests > obj.availability - confirmGuest) {
          obj2.availability = false;
        } else {
          obj2.availability = true;
        }
        return obj2;
      })
    );
  } catch (err) {
    throw err;
  }
};

exports.parksByDay = parksByDay;
