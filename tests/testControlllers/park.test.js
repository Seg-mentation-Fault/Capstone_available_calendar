const storage = require('../../src/connection');
const {
  createPark,
  getPark,
  getAllPark,
  deletePark,
  updatePark,
} = require('../../src/controllers/parkContrlloers');

describe('create Park', () => {
  it('should create a park', async () => {
    const park = await createPark(storage, {
      name: 'pruebaPark',
      capacity: 3000,
    });
    expect(park.name).toEqual('pruebaPark');
    expect(park.capacity).toEqual(3000);
    const findPark = await storage.park.findOne({
      where: { name: 'pruebaPark' },
      raw: true,
    });
    expect(findPark.capacity).toBe(park.capacity);
    await storage.park.destroy({ where: { name: 'pruebaPark' } });
  });
});

describe('get Park', () => {
  it('Shoud get an user a return it', async () => {
    const newPark = await createPark(storage, {
      name: 'pruebaPark',
      capacity: 2000,
    });
    const findPark = await getPark(storage, { name: 'pruebaPark' });
    expect(findPark.capacity).toEqual(newPark.capacity);
    expect(findPark.name).toEqual('pruebaPark');
    await storage.park.destroy({ where: { name: 'pruebaPark' } });
  });

  it('Shoudl fail and do not get the user', async () => {
    await expect(
      getPark(storage, { name: 'this Park not exits' })
    ).rejects.toBeInstanceOf(Error);
  });
});

describe('get all parks ', () => {
  it('should get all the parks', async () => {
    const parks = await getAllPark(storage);
    expect(parks.length).toEqual(4);
  });
});

describe('Delete park', () => {
  it('should delete an record', async () => {
    await createPark(storage, {
      name: 'pruebaPark2',
      capacity: 3000,
    });
    const deleted = await deletePark(storage, {
      name: 'pruebaPark2',
    });
    expect(deleted).toEqual({ done: true });
  });
});

describe('park updated', () => {
  it('shoud update a new record', async () => {
    await createPark(storage, {
      name: 'pruebaPark3',
      capacity: 3000,
    });
    const updated = await updatePark(
      storage,
      {
        name: 'pruebaPark3',
      },
      { capacity: 500 }
    );
    expect(updated).toBeGreaterThanOrEqual(1);
    const userUpdated = await getPark(storage, {
      name: 'pruebaPark3',
    });
    expect(userUpdated.capacity).toEqual(500);
    await storage.park.destroy({ where: { name: 'pruebaPark3' } });
  });
});
