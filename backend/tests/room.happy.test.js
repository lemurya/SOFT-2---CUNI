const request = require('supertest');
const app = require('../index');

describe(':) Happy Path - RoomController', () => {
  const usuario_id = 1; // asegúrate que este usuario exista en la BD

  test('GET /api/room debe retornar los ítems colocados en habitación', async () => {
    const res = await request(app).get(`/api/room?usuario_id=${usuario_id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('items');
    expect(Array.isArray(res.body.items)).toBe(true);
  });

  test('POST /api/room debe permitir agregar un ítem', async () => {
    const res = await request(app)
      .post('/api/room')
      .send({
        usuario_id,
        tipo: 'silla',
        datos: {
          name: 'silla',
          imageUrl: 'silla',
          posX: '100px',
          posY: '200px'
        }
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('items');
  });
});
