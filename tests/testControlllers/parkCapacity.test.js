// const { Op } = require('sequelize');
const storage = require('../../src/connection');
const {
  getParkCapacityDay,
  newParkCapacity,
} = require('../../src/controllers/parkCapacityController');

describe('Park capacity model', () => {
  beforeAll(async () => {
    await storage.parkCapacity.bulkCreate([
      { date: '2021-11-01', ParkId: 2, dayCapacity: 2000 },
      { date: '2021-11-02', ParkId: 2, dayCapacity: 3000 },
    ]);
    // done();
  });

  afterAll(async () => {
    await storage.parkCapacity.destroy({
      where: {
        date: '2021-11-01',
        ParkId: 2,
      },
    });
    await storage.parkCapacity.destroy({
      where: {
        date: '2021-11-02',
        ParkId: 2,
      },
    });
    await storage.parkCapacity.destroy({
      where: {
        date: '2021-11-01',
        ParkId: 4,
      },
    });
    // done();
  });

  it('return the number of capacity that was set for a specifiic day', async () => {
    const valid = {
      date: '2021-11-01',
      ParkId: 2,
    };
    const actual = await getParkCapacityDay(storage, valid);
    expect(actual).toEqual(2000);
  });

  it('return the nuber of capacity that was set for a specifiic day', async () => {
    const valid = {
      date: '2021-11-02',
      ParkId: 2,
    };
    const actual = await getParkCapacityDay(storage, valid);
    expect(actual).toEqual(3000);
  });

  it('create a parckCapacityRecord with valid fields', async () => {
    try {
      const valid = {
        date: '2021-11-01',
        dayCapacity: 1500,
        ParkId: 4,
      };
      const actual = await newParkCapacity(storage, valid);
      expect(actual.date).toEqual('2021-11-01');
      expect(actual.dayCapacity).toEqual(1500);
      expect(actual.ParkId).toEqual(4);
    } catch (error) {
      throw error;
    }
  });
});
