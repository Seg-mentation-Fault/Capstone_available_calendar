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

exports.getParkCapacityDay = getParkCapacityDay;
