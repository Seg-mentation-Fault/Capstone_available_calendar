const storage = require('../../src/connection');
const { createPark } = require('../../src/controllers/parkContrlloers');

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
