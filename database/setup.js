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
  
});
