const storage = require('../../src/connection');
const {
  getAllReservation,
  getReservation,
  deleteReservation,
  updateReservation,
} = require('../../src/controllers/reservationController');

describe('Reservation model', () => {
  //   beforeAll(async () => {
  //     await storage.user.bulkCreate([
  //       { firstName: 'user1', lastName: 'user1ln', email: 'user1@gmail.com' },
  //       { firstName: 'user2', lastName: 'user2ln', email: 'user2@gmail.com' },
  //       { firstName: 'user3', lastName: 'user3ln', email: 'user3@gmail.com' },
  //     ]);
  //   });
  beforeAll(async () => {
    try {
      await storage.reservation.bulkCreate([
        {
          date: '2021-10-13',
          ParkId: 1,
          numOfGuests: 30,
          UserId: 1,
          confirmCode: 'fd48tr',
        },
        {
          date: '2021-10-14',
          ParkId: 3,
          numOfGuests: 30,
          UserId: 2,
          confirmCode: 'as78wq',
        },
        {
          date: '2021-10-13',
          ParkId: 1,
          numOfGuests: 30,
          UserId: 2,
          confirmCode: 'gf51uy',
        },
        {
          date: '2021-10-14',
          ParkId: 2,
          numOfGuests: 30,
          UserId: 2,
          confirmCode: 're16ng',
        },
        {
          date: '2021-10-13',
          ParkId: 1,
          numOfGuests: 30,
          UserId: 3,
          confirmCode: '3s5e8r',
        },
        {
          date: '2021-10-14',
          ParkId: 4,
          numOfGuests: 30,
          UserId: 2,
          confirmCode: '1d5s9t',
        },
      ]);
    } catch (error) {
      throw error;
    }
  });

  afterAll((done) => {
    storage.reservation.destroy({ truncate: true });
    done();
  });

  it('get all reservations with valid date and id', async () => {
    try {
      const valid = { date: '2021-10-13', ParkId: 1 };

      const actual = await getAllReservation(storage, valid);

      expect(actual).toHaveLength(3);
      expect(actual[0].date).toEqual('2021-10-13');
      expect(actual[0].ParkId).toEqual(1);
      expect(actual[0].UserId).toEqual(3);
      expect(actual[1].date).toEqual('2021-10-13');
      expect(actual[1].ParkId).toEqual(1);
      expect(actual[1].UserId).toEqual(1);
      expect(actual[2].date).toEqual('2021-10-13');
      expect(actual[2].ParkId).toEqual(1);
      expect(actual[2].UserId).toEqual(2);
    } catch (err) {
      throw err;
    }
  });

  it('get empty list passing day with no parks', async () => {
    try {
      const valid = { date: '2021-10-15', ParkId: 1 };

      const actual = await getAllReservation(storage, valid);
      expect(actual).toEqual([]);
    } catch (err) {
      throw err;
    }
  });

  it('get all reservations with valid userID', async () => {
    try {
      const valid = { UserId: 2 };

      const actual = await getAllReservation(storage, valid);
      expect(actual).toHaveLength(4);
    } catch (err) {
      throw err;
    }
  });

  it('get empty list passing invalid userID', async () => {
    try {
      const valid = { UserId: 10 };

      const actual = await getAllReservation(storage, valid);
      expect(actual).toEqual([]);
    } catch (err) {
      throw err;
    }
  });

  it('get reservation with valid confirmCode', async () => {
    try {
      const valid = { confirmCode: 'as78wq' };

      const actual = await getReservation(storage, valid);
      expect(actual.date).toEqual('2021-10-14');
      expect(actual.ParkId).toEqual(3);
      expect(actual.UserId).toEqual(2);
    } catch (err) {
      throw err;
    }
  });

  it('Delete a record of reservation with valid fields', async () => {
    try {
      const valid = { confirmCode: '1d5s9t' };
      const actual = await deleteReservation(storage, valid);
      expect(actual).toEqual({ done: true });
    } catch (err) {
      throw err;
    }
  });

  it('Return 0 when pass invalid field', async () => {
    try {
      const invalid = { confirmCode: '96583i' };
      await expect(deleteReservation(storage, invalid)).rejects.toBeInstanceOf(
        Error
      );
    } catch (err) {
      throw err;
    }
  });

  it('Return 0 when pass invalid field', async () => {
    try {
      const invalid = { date: '2021-10-14' };
      await expect(deleteReservation(storage, invalid)).rejects.toBeInstanceOf(
        Error
      );
    } catch (err) {
      throw err;
    }
  });

  it('update a record of parck capacity with valid', async () => {
    try {
      const oldValid = { confirmCode: 'fd48tr' };
      const newValid = { numOfGuests: 5 };
      const actual = await updateReservation(storage, oldValid, newValid);
      expect(actual).toEqual({ done: true });
    } catch (err) {
      throw err;
    }
  });
});
