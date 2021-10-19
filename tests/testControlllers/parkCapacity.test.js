const storage = require('../../src/connection');
const {
  getParkCapacityDay,
} = require('../../src/controllers/parkCapacityController');

describe.only('Park capacity model', () => {
  it('return the nuber of capacity that was set for a specifiic day', async () => {
    const valid = {
      date: '2021-10-13',
      ParkId: 1,
    };
    const actual = await getParkCapacityDay(storage, valid);
    // done();
    expect(actual).toEqual(4000);
  });
});
