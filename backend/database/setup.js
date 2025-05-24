// src/database/setup.js
const db = require('./db');

db.serialize(() => {
  // Tabla de usuarios
  db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      correo TEXT UNIQUE NOT NULL,
      contrasena TEXT NOT NULL,
      experiencia INTEGER DEFAULT 0,
      monedas INTEGER DEFAULT 0,
      configuracion TEXT
    )
  `);

  // Tabla de reportes
  db.run(`
    CREATE TABLE IF NOT EXISTS reportes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER NOT NULL,
      correctas INTEGER NOT NULL,
      total INTEGER NOT NULL,
      fecha TEXT DEFAULT CURRENT_TIMESTAMP,
      tema TEXT NOT NULL,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    )
  `);

  // Tabla de ítems de la habitación
  db.run(`
    CREATE TABLE IF NOT EXISTS room_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER NOT NULL,
      tipo TEXT NOT NULL,
      datos TEXT NOT NULL,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    )
  `);

  // Tabla del catálogo de tienda (y luego insertar productos)
  db.run(`
    CREATE TABLE IF NOT EXISTS tienda_catalogo (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      tipo TEXT NOT NULL,
      costo INTEGER NOT NULL
    )
  `, (err) => {
    if (err) {
      console.error("❌ Error al crear tienda_catalogo:", err);
    } else {
      db.get(`SELECT COUNT(*) as count FROM tienda_catalogo`, (err, row) => {
        if (err) {
          console.error("❌ Error al verificar tienda_catalogo:", err);
        } else if (row.count === 0) {
          const stmt = db.prepare(`
            INSERT INTO tienda_catalogo (nombre, tipo, costo) VALUES (?, ?, ?)
          `);
          stmt.run("Gorro Andino", "accesorio", 20);
          stmt.run("Chaleco de Alpaca", "accesorio", 35);
          stmt.run("Bufanda Morada", "accesorio", 25);
          stmt.finalize();
          console.log("🛍️ Catálogo de tienda inicial insertado.");
        }
      });
    }
  });

  // Tabla de ítems comprados por usuario (con columna en_uso)
  db.run(`
    CREATE TABLE IF NOT EXISTS tienda_items_usuario (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER NOT NULL,
      nombre TEXT NOT NULL,
      tipo TEXT NOT NULL,
      costo INTEGER NOT NULL,
      en_uso INTEGER DEFAULT 0,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    )
  `);

  console.log("✅ Todas las tablas fueron creadas correctamente.");
});
