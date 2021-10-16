const { getAllParksDay } = require('../controllers/parkCapacityController');
const { capacityConfirm } = require('../controllers/reservationController');

const parksByDay = async (storage, data) => {
  try {
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
