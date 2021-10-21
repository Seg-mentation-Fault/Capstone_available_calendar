// const { Op } = require('sequelize');
const storage = require('../../src/connection');
const {
  getParkCapacityDay,
  newParkCapacity,
  deleteParkCapacity,
} = require('../../src/controllers/parkCapacityController');

describe('Park capacity model', () => {
  beforeAll(async () => {
    await storage.parkCapacity.bulkCreate([
      { date: '2021-11-01', ParkId: 2, dayCapacity: 2000 },
      { date: '2021-11-02', ParkId: 2, dayCapacity: 3000 },
    ]);
  });

  afterAll(async () => {
    await storage.parkCapacity.destroy({
      where: { date: '2021-11-01', ParkId: 2 },
    });
    await storage.parkCapacity.destroy({
      where: { date: '2021-11-02', ParkId: 2 },
    });
    await storage.parkCapacity.destroy({
      where: { date: '2021-11-01', ParkId: 4 },
    });
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

  it.skip('Throw an error passing a fake Park ID to new park capacity', async () => {
    try {
      const invalid = {
        date: '2021-11-01',
        dayCapacity: 1500,
        ParkId: 7,
      };
      expect(async () => {
        await newParkCapacity(storage, invalid);
      }).toThrowError('Park ID does not exist');
    } catch (error) {
      throw error;
    }
  });

  it('return park`s capacity number for a given day', async () => {
    const valid = { date: '2021-11-01', ParkId: 2 };
    const valid2 = { date: '2021-11-02', ParkId: 2 };

    const actual = await getParkCapacityDay(storage, valid);
    const actual2 = await getParkCapacityDay(storage, valid2);

    expect(actual).toEqual(2000);
    expect(actual2).toEqual(3000);
  });

  it.skip('Throw an error passing a date without assigned parks', async () => {
    const invalid = { date: '2021-01-01', ParkId: 2 };

    expect(async () => {
      await getParkCapacityDay(storage, invalid);
    }).toThrowError('There is no park assigned for this day');
  });

  it('Delete a record of park capacity with valid fields', async () => {
    await storage.parkCapacity.create({
      date: '2021-11-03',
      ParkId: 3,
      dayCapacity: 1000,
    });

    const valid = { date: '2021-11-03', ParkId: 3 };
    const actual = await deleteParkCapacity(storage, valid);
    expect(actual).toEqual(1);
  });

  it('Return 0 when date don`t has assigned parks capacitys', async () => {
    const invalid = { date: '2021-11-04', ParkId: 3 };
    const actual = await deleteParkCapacity(storage, invalid);
    expect(actual).toEqual(0);
  });

  it('Return 0 when Id park dosnot exist', async () => {
    const invalid = { date: '2021-11-01', ParkId: 7 };
    const actual = await deleteParkCapacity(storage, invalid);
    expect(actual).toEqual(0);
  });
});
