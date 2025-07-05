const sqlite3 = require('sqlite3').verbose();
const Reporte = require('../models/Reporte');

let db;

beforeAll(done => {
  db = new sqlite3.Database(':memory:', err => {
    if (err) return done(err);

    db.serialize(() => {
      db.run(`
        CREATE TABLE reportes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          usuario_id INTEGER NOT NULL,
          correctas INTEGER NOT NULL,
          total INTEGER NOT NULL,
          fecha TEXT DEFAULT CURRENT_TIMESTAMP,
          tema TEXT NOT NULL
        )
      `, done);
    });
  });
});

beforeEach(done => {
  // Limpiar antes de cada prueba
  db.run(`DELETE FROM reportes`, () => {
    const stmt = db.prepare(`
      INSERT INTO reportes (usuario_id, correctas, total, fecha, tema)
      VALUES (?, ?, ?, ?, ?)
    `);
    stmt.run(1, 3, 3, '2025-07-01T12:00:00Z', 'matematica');
    stmt.run(1, 2, 3, '2025-07-02T12:00:00Z', 'ciencias');
    stmt.run(2, 1, 3, '2025-07-01T12:00:00Z', 'verbal');
    stmt.finalize(done);
  });
});

afterAll(() => {
  db.close();
});

describe('Reporte.obtenerPorUsuario', () => {
  it('debe retornar reportes para el usuario 1', async () => {
    const resultados = await Reporte.obtenerPorUsuario(db, 1);
    expect(resultados).toHaveLength(2);
  });

  it('debe retornar reportes en orden descendente por fecha', async () => {
    const resultados = await Reporte.obtenerPorUsuario(db, 1);
    expect(resultados[0].tema).toBe('ciencias'); 
    expect(resultados[1].tema).toBe('matematica');
  });

  it('debe retornar arreglo vacío si el usuario no tiene reportes', async () => {
    const resultados = await Reporte.obtenerPorUsuario(db, 99);
    expect(resultados).toEqual([]);
  });

  it('debe lanzar error si hay problema con la consulta', async () => {
    
    await expect(Reporte.obtenerPorUsuario(null, 1)).rejects.toThrow();
  });
});
