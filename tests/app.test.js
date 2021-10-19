const request = require('supertest');
// const storage = require('../src/connection');
// jest.setTimeout(20000);
describe('GET / ', () => {
  it('Respond with Ok status code 200', (done) => {
    try {
      request('http://localhost:3000/api/v1/').get('/').expect(200, done);
    } catch (error) {
      done(error);
    }
  });
});

describe('POST /retrive-parks-date ', () => {
  it('Respond list of objects with parks information, valid guest and date', (done) => {
    try {
      request('http://localhost:3000/api/v1/')
        .post('/retrive-parks-date')
        .send({ numOfGuests: 400, date: '2021-10-13' })
        .expect(200)
        .then((response) => {
          expect(response.body).toStrictEqual([
            {
              id: 1,
              name: 'Mundo Aventura',
              availability: true,
            },
            {
              id: 2,
              name: 'Salitre Magico',
              availability: true,
            },
            {
              id: 3,
              name: 'Maloca',
              availability: true,
            },
            {
              id: 4,
              name: 'El Mundo de los Niños',
              availability: true,
            },
          ]);
          done();
        });
    } catch (error) {
      // throw error;
      done(error);
    }
  });

  it('Respond with a empty list, date with no parks asigned', (done) => {
    try {
      request('http://localhost:3000/api/v1/')
        .post('/retrive-parks-date')
        .send({ numOfGuests: 400, date: '2021-10-05' })
        .expect(200)
        .then((response) => {
          expect(response.body).toStrictEqual([]);
          done();
        });
    } catch (error) {
      done(error);
    }
  });

  it('Respond with a list, with no capacity for any park', (done) => {
    try {
      request('http://localhost:3000/api/v1/')
        .post('/retrive-parks-date')
        .send({ numOfGuests: 8000, date: '2021-10-13' })
        .expect(200)
        .then((response) => {
          expect(response.body).toStrictEqual([
            {
              id: 1,
              name: 'Mundo Aventura',
              availability: false,
            },
            {
              id: 2,
              name: 'Salitre Magico',
              availability: false,
            },
            {
              id: 3,
              name: 'Maloca',
              availability: false,
            },
            {
              id: 4,
              name: 'El Mundo de los Niños',
              availability: false,
            },
          ]);
          done();
        });
    } catch (error) {
      done(error);
    }
  });

  it('Respond with a ERROR, numOfGuests should be a number', (done) => {
    try {
      request('http://localhost:3000/api/v1/')
        .post('/retrive-parks-date')
        .send({ numOfGuests: 'any8000', date: '2021-10-13' })
        .expect(400)
        .then((response) => {
          expect(response.body).toEqual({
            errors: [
              {
                value: 'any8000',
                msg: 'guest should be an Integer and above 0',
                param: 'numOfGuests',
                location: 'body',
              },
            ],
          });
          done();
        });
    } catch (error) {
      done(error);
    }
  });

  it('Respond with a ERROR, date should be a valid date', (done) => {
    try {
      request('http://localhost:3000/api/v1/')
        .post('/retrive-parks-date')
        .send({ numOfGuests: 400, date: '2021-13-13' })
        .expect(400)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).toEqual({
            errors: [
              {
                value: '2021-13-13',
                msg: 'date should an actual date format yyyy-mm-dd',
                param: 'date',
                location: 'body',
              },
            ],
          });
          return done();
        });
    } catch (error) {
      expect(error).toEqual({
        errors: [
          {
            value: '2021-13-13',
            msg: 'date should an actual date format yyyy-mm-dd',
            param: 'date',
            location: 'body',
          },
        ],
      });
      done(error);
    }
  });
});

describe.skip('POST /reservation', () => {
  // afterEach((done) => {
  //   storage.client.dropTable('Reservations');
  //   storage.client.dropTable('Users');
  //   done();
  // });
  it('Respond with an object, with done status and code confirmation', async () => {
    const body = {
      firstName: 'testname',
      lastName: 'testlast',
      email: 'test1@gmail.com',
      numOfGuests: 10,
      date: '2021-10-13',
      ParkId: 2,
    };
    request(
      'http://localhost:3000/api/v1/reservation',
      body,
      async (req, res) => {
        const response = JSON.parse(res.body);
        await expect(response).toBeCalledWith(
          expect.objectContaining({
            done: expect.toBe(false),
            confirmCode: expect.any(String),
          })
        );
      }
    );
  });
});
