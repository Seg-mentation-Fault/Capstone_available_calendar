const storage = require('../../src/connection');
const { createUser, getUser } = require('../../src/controllers/userController');

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
