import client from '../lib/client.js';
import supertest from 'supertest';
import app from '../lib/app.js';
import { execSync } from 'child_process';

const request = supertest(app);

describe('API Routes', () => {

  afterAll(async () => {
    return client.end();
  });

  describe('/api/me/todos', () => {
    let user;

    beforeAll(async () => {
      execSync('npm run recreate-tables');

      const response = await request
        .post('/api/auth/signup')
        .send({
          name: 'Me the User',
          email: 'me@user.com',
          password: 'password'
        });

      expect(response.status).toBe(200);

      user = response.body;
    });

    let washDishes = {
      id: 1,
      task: 'wash the dishes',
      completed: false,
      userId: 1
    };

    // append the token to your requests:
    //  .set('Authorization', user.token);

    it('POST todo to /api/me/todos', async () => {
      const response = await request
        .post('/api/me/todos')
        .set('Authorization', user.token)
        .send(washDishes);

      // remove this line, here to not have lint error:
      user.token;

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        userId: user.id,
        ...washDishes
      });
    });

    it('PUT updated felix to /api/me/todos/:id', async () => {
      washDishes.task = 'wash the dishes';
      washDishes.completed = false;

      const response = await request
        .put(`/api/me/todos/${washDishes.id}`)
        .set('Authorization', user.token)
        .send(washDishes);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(washDishes);

    });


  });

});

