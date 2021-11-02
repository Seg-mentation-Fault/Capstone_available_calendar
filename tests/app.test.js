const request = require('supertest');
const storage = require('../src/connection');

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
  beforeAll(async () => {
    await storage.parkCapacity.bulkCreate([
      { date: '2021-10-13', ParkId: 1, dayCapacity: 1000 },
      { date: '2021-10-14', ParkId: 1, dayCapacity: 4000 },
      { date: '2021-10-13', ParkId: 2, dayCapacity: 6000 },
      { date: '2021-10-14', ParkId: 2, dayCapacity: 1000 },
      { date: '2021-10-13', ParkId: 3, dayCapacity: 1000 },
      { date: '2021-10-14', ParkId: 3, dayCapacity: 5000 },
      { date: '2021-10-13', ParkId: 4, dayCapacity: 2000 },
      { date: '2021-10-14', ParkId: 4, dayCapacity: 500 },
    ]);
    // done();
  });

  afterAll(async () => {
    await storage.parkCapacity.destroy({
      where: { date: ['2021-10-13', '2021-10-14'] },
    });
  });

  it('Respond list of objects with parks information, valid guest and date', (done) => {
    try {
      request('http://localhost:3000/api/v1/')
        .post('/parkcapacity/availability')
        .send({ numOfGuests: 400, date: '2021-10-13' })
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual([
            {
              id: 1,
              name: 'Mundo Aventura',
              availability: true,
              description: null,
            },
            {
              id: 2,
              name: 'Salitre Magico',
              availability: true,
              description: null,
            },
            {
              id: 3,
              name: 'Maloca',
              availability: true,
              description: null,
            },
            {
              id: 4,
              name: 'El Mundo de los Niños',
              availability: true,
              description: null,
            },
          ]);
          done();
        });
    } catch (error) {
      done(error);
    }
  });

  it('Respond with a empty list, date with no parks asigned', (done) => {
    try {
      request('http://localhost:3000/api/v1/')
        .post('/parkcapacity/availability')
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
        .post('/parkcapacity/availability')
        .send({ numOfGuests: 8000, date: '2021-10-13' })
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual([
            {
              id: 1,
              name: 'Mundo Aventura',
              availability: false,
              description: null,
            },
            {
              id: 2,
              name: 'Salitre Magico',
              availability: false,
              description: null,
            },
            {
              id: 3,
              name: 'Maloca',
              availability: false,
              description: null,
            },
            {
              id: 4,
              name: 'El Mundo de los Niños',
              availability: false,
              description: null,
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
        .post('/parkcapacity/availability')
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
        .post('/parkcapacity/availability')
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
