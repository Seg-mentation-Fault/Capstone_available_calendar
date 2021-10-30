// const { Op } = require('sequelize');
const storage = require('../../src/connection');
const {
  getParkCapacityDay,
  newParkCapacity,
  getAllParksDay,
  deleteParkCapacity,
  updateParkCapacity,
} = require('../../src/controllers/parkCapacityController');

describe('Park capacity model', () => {
  beforeAll(async () => {
    await storage.parkCapacity.bulkCreate([
      { date: '2021-11-01', ParkId: 2, dayCapacity: 2000 },
      { date: '2021-11-02', ParkId: 2, dayCapacity: 3000 },
      { date: '2021-11-03', ParkId: 3, dayCapacity: 1000 },
      { date: '2021-11-04', ParkId: 3, dayCapacity: 1000 },
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
    await storage.parkCapacity.destroy({
      where: { date: '2021-11-04', ParkId: 3 },
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

  it('return park`s capacity number for a given day', async () => {
    try {
      const valid = { date: '2021-11-01', ParkId: 2 };
      const valid2 = { date: '2021-11-02', ParkId: 2 };

      const actual = await getParkCapacityDay(storage, valid);
      const actual2 = await getParkCapacityDay(storage, valid2);

      expect(actual).toEqual(2000);
      expect(actual2).toEqual(3000);
    } catch (error) {
      throw error;
    }
  });

  it('Throw an error passing a date without assigned parks', async () => {
    try {
      const invalid = { date: '2021-01-01', ParkId: 2 };

      await expect(getParkCapacityDay(storage, invalid)).rejects.toBeInstanceOf(
        Error
      );
      await expect(getParkCapacityDay(storage, invalid)).rejects.toThrowError(
        'There is no park assigned for this day'
      );
    } catch (error) {
      throw error;
    }
  });

  it('Delete a record of park capacity with valid fields', async () => {
    try {
      const valid = { date: '2021-11-03', ParkId: 3 };
      const actual = await deleteParkCapacity(storage, valid);
      expect(actual).toEqual({ done: true });
    } catch (error) {
      throw error;
    }
  });

  it('Throw an error when date don`t has assigned parks capacity', async () => {
    try {
      const invalid = { date: '2021-11-05', ParkId: 3 };
      await expect(deleteParkCapacity(storage, invalid)).rejects.toBeInstanceOf(
        Error
      );
      await expect(deleteParkCapacity(storage, invalid)).rejects.toThrowError(
        'Nothing was deleted'
      );
    } catch (error) {
      throw error;
    }
  });

  it('Return 0 when Id park dosnot exist', async () => {
    try {
      const invalid = { date: '2021-11-01', ParkId: 7 };
      await expect(deleteParkCapacity(storage, invalid)).rejects.toBeInstanceOf(
        Error
      );
      await expect(deleteParkCapacity(storage, invalid)).rejects.toThrowError(
        'Nothing was deleted'
      );
    } catch (error) {
      throw error;
    }
  });

  it('Get all parks that match with a valid date', async () => {
    try {
      const valid = { date: '2021-11-01' };
      const actual = await getAllParksDay(storage, valid);
      expect(actual).toHaveLength(2);
    } catch (error) {
      throw error;
    }
  });

  it('Get a empty list  with a invalid date', async () => {
    try {
      const valid = { date: '2021-10-01' };
      const actual = await getAllParksDay(storage, valid);
      expect(actual).toHaveLength(0);
      expect(actual).toEqual([]);
    } catch (error) {
      throw error;
    }
  });

  it('update a record of parck capacity with valid', async () => {
    try {
      const oldValid = { date: '2021-11-04', ParkId: 3 };
      const newValid = { dayCapacity: 300 };
      const actual = await updateParkCapacity(storage, oldValid, newValid);
      expect(actual).toEqual({ done: true });
    } catch (err) {
      throw err;
    }
  });
  it('Throw error wit invalid fields', async () => {
    try {
      const oldInvalid = { date: '2021-11-04', ParkId: 10 };
      const newValid = { dayCapacity: 300 };
      await expect(
        updateParkCapacity(storage, oldInvalid, newValid)
      ).rejects.toBeInstanceOf(Error);
      await expect(
        updateParkCapacity(storage, oldInvalid, newValid)
      ).rejects.toThrowError('Nothing was updated');
    } catch (err) {
      throw err;
    }
  });
});
