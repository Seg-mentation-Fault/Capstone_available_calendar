const storage = require('../../src/connection');
const { createUser } = require('../../src/controllers/userController');

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
