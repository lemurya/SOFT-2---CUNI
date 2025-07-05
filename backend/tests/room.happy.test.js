const request = require('supertest');
const app = require('../index');
const db = require('../database/db');

describe(':) Happy Path - RoomController', () => {
  const usuario_id = 1;

  beforeEach(done => {
    db.serialize(() => {
      // Limpiar ítems colocados
      db.run(`DELETE FROM room_items WHERE usuario_id = ?`, [usuario_id]);

      // Limpiar inventario
      db.run(`DELETE FROM tienda_items_usuario WHERE usuario_id = ?`, [usuario_id]);

      // Insertar sillas y mesas nuevas en el inventario (no en uso)
      const stmt = db.prepare(`
        INSERT INTO tienda_items_usuario (usuario_id, nombre, tipo, costo, en_uso)
        VALUES (?, ?, ?, ?, ?)
      `);
      stmt.run(usuario_id, 'Silla C', 'silla', 10, 0);
      stmt.run(usuario_id, 'Mesa A', 'mesa', 15, 0);
      stmt.finalize(done);
    });
  });

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
