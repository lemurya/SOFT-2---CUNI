const request = require('supertest');
const app = require('../index');

describe(':( Unhappy Path - RoomController', () => {
  test('GET /api/room sin usuario_id debe dar error', async () => {
    const res = await request(app).get(`/api/room`);
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('POST /api/room con datos incompletos debe fallar', async () => {
    const res = await request(app).post('/api/room').send({
      tipo: 'mesa',
      datos: {
        name: 'mesa',
        posX: '50px',
        posY: '100px'
      }
    });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});
