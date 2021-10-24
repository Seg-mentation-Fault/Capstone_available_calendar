const storage = require('../../src/connection');
const {
  createUser,
  getUser,
  getAllUser,
  deleteUser,
  updateUser,
} = require('../../src/controllers/userController');
const { newUserReservation } = require('../../src/service/userReservation');

describe('user model', () => {
  afterEach(() => {
    storage.user.destroy({ where: { email: 'username@example.com' } });
  });

  it('create a user with valid fields', async () => {
    const valid = {
      firstName: 'user1',
      lastName: 'user1',
      email: 'username@example.com',
    };

    const actual = await createUser(storage, valid);
    expect(actual.firstName).toEqual('user1');
    expect(actual.lastName).toEqual('user1');
    expect(actual.email).toEqual('username@example.com');
  });
});

describe('get User', () => {
  it('Shoud get an user a return it', async () => {
    const newUser = await createUser(storage, {
      firstName: 'user1',
      lastName: 'user1',
      email: 'username2@example.com',
    });
    const findUser = await getUser(storage, { email: 'username2@example.com' });
    expect(findUser.email).toEqual(newUser.email);
    expect(findUser.email).toEqual('username2@example.com');
    await storage.user.destroy({ where: { email: 'username2@example.com' } });
  });

  it('Shoudl fail and do not get the user', async () => {
    await expect(
      getUser(storage, { email: 'username2@example.com' })
    ).rejects.toBeInstanceOf(Error);
  });
});

describe('getAllUSer', () => {
  it('should return a lists of all users', async () => {
    const newUser1 = await createUser(storage, {
      firstName: 'user1',
      lastName: 'user1',
      email: 'username3@example.com',
    });
    const newUser2 = await createUser(storage, {
      firstName: 'user1',
      lastName: 'user1',
      email: 'username4@example.com',
    });
    const users = await getAllUser(storage);
    expect(users).toBeInstanceOf(Array);
    expect(users.length).toBeGreaterThanOrEqual(2);
    await storage.user.destroy({ where: { email: newUser1.email } });
    await storage.user.destroy({ where: { email: newUser2.email } });
  });

  it('should returns a list with users to specific date and park', async () => {
    const capacityDay1 = await storage.parkCapacity.create({
      date: '2021-10-21',
      dayCapacity: 300,
      ParkId: 1,
    });
    const capacityDay2 = await storage.parkCapacity.create({
      date: '2021-10-22',
      dayCapacity: 300,
      ParkId: 2,
    });
    const reservation1 = await newUserReservation(
      storage,
      {
        firstName: 'usert',
        lastName: 'usert',
        email: 'userTU1@gmail.com',
      },
      { numOfGuests: 1, date: '2021-10-21', ParkId: 1 }
    );
    const reservation2 = await newUserReservation(
      storage,
      {
        firstName: 'usertt',
        lastName: 'usertt',
        email: 'userTU2@gmail.com',
      },
      { numOfGuests: 1, date: '2021-10-22', ParkId: 2 }
    );
    const users = await getAllUser(storage, {
      ParkId: 1,
      date: '2021-10-21',
    });
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('userTU1@gmail.com');
    await storage.parkCapacity.destroy({
      where: { ParkId: capacityDay1.ParkId },
    });
    await storage.parkCapacity.destroy({
      where: { ParkId: capacityDay2.ParkId },
    });
    await storage.user.destroy({ where: { email: 'userTU1@gmail.com' } });
    await storage.user.destroy({ where: { email: 'userTU2@gmail.com' } });
    await storage.reservation.destroy({
      where: { confirmCode: reservation1.reservation.dataValues.confirmCode },
    });
    await storage.reservation.destroy({
      where: { confirmCode: reservation2.reservation.dataValues.confirmCode },
    });
  });
});

describe('delete user', () => {
  it('Should delete a given user by email', async () => {
    await createUser(storage, {
      firstName: 'user1',
      lastName: 'user1',
      email: 'username12@example.com',
    });
    const deleted = await deleteUser(storage, {
      email: 'username12@example.com',
    });
    expect(deleted).toEqual({ done: true });
  });
});

describe('Update User', () => {
  it('should updated the user', async () => {
    await createUser(storage, {
      firstName: 'usertest',
      lastName: 'usertest',
      email: 'username20@example.com',
    });
    const updated = await updateUser(
      storage,
      {
        email: 'username20@example.com',
      },
      { firstName: 'NUevo' }
    );
    expect(updated).toBeGreaterThanOrEqual(1);
    const userUpdated = await getUser(storage, {
      email: 'username20@example.com',
    });
    expect(userUpdated.firstName).toEqual('NUevo');
    await storage.user.destroy({ where: { email: 'username20@example.com' } });
  });
});
