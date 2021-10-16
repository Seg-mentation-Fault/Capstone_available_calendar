const getParkCapacityDay = async (storage, attributes) => {
  try {
    const capacityDay = await storage.parkCapacity.findOne({
      where: {
        date: attributes.date,
        ParkId: attributes.ParkId,
      },
    });
    return capacityDay;
  } catch (err) {
    throw err;
  }
};

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

exports.getParkCapacityDay = getParkCapacityDay;
exports.getAllParksDay = getAllParksDay;
