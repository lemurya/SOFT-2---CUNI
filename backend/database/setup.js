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

    //Tabla de preguntas
    db.run(`
      CREATE TABLE IF NOT EXISTS preguntas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pregunta TEXT NOT NULL,
        opciones TEXT NOT NULL, -- JSON con opciones
        correcta TEXT NOT NULL,
        tema TEXT NOT NULL
      )
  `);
  const preguntasIniciales = {
  matematica: [
    { question: "Si 5x − 3 = 2x + 12, ¿cuál es el valor de x?", options: ["5", "1", "3", "7"], correct: "5" },
    { question: "¿Cuál es el número que sigue en la serie: 2, 6, 12, 20, 30...?", options: ["36", "40", "42", "48"], correct: "42" },
    { question: "Resuelve: (x + 3)(x − 2) = 0. ¿Cuál es una raíz?", options: ["−3", "2", "−2", "3"], correct: "2" }
  ],
  verbal: [
    { question: "Seleccione el sinónimo de 'elocuente':", options: ["Callado", "Persuasivo", "Tímido", "Inseguro"], correct: "Persuasivo" },
    { question: "¿Cuál es la palabra que completa correctamente la analogía? Agua es a líquido como hielo es a:", options: ["gas", "sólido", "plasma", "niebla"], correct: "sólido" },
    { question: "Seleccione el antónimo de 'beligerante':", options: ["Agresivo", "Pacífico", "Violento", "Conflictivo"], correct: "Pacífico" }
  ],
  ciencias: [
    { question: "¿Cuál es la función principal de los glóbulos rojos?", options: ["Defender contra infecciones", "Transportar oxígeno", "Coagular sangre", "Formar huesos"], correct: "Transportar oxígeno" },
    { question: "¿Qué ley de Newton explica la acción y reacción?", options: ["Primera", "Segunda", "Tercera", "Cuarta"], correct: "Tercera" },
    { question: "¿Qué parte de la célula controla sus funciones?", options: ["Mitocondria", "Citoplasma", "Núcleo", "Membrana"], correct: "Núcleo" }
  ],
  historia: [
    { question: "¿Quién proclamó la independencia del Perú en 1821?", options: ["Simón Bolívar", "José de San Martín", "Miguel Grau", "Ramón Castilla"], correct: "José de San Martín" },
    { question: "¿Cuál fue la civilización que construyó Chan Chan?", options: ["Moche", "Chimú", "Nazca", "Inca"], correct: "Chimú" },
    { question: "¿En qué año se dio la Revolución Francesa?", options: ["1789", "1776", "1810", "1804"], correct: "1789" }
  ]
};

db.get(`SELECT COUNT(*) as count FROM preguntas`, (err, row) => {
  if (err) {
    console.error("❌ Error al verificar preguntas:", err);
  } else if (row.count === 0) {
    const stmt = db.prepare(`
      INSERT INTO preguntas (pregunta, opciones, correcta, tema)
      VALUES (?, ?, ?, ?)
    `);

    for (const tema in preguntasIniciales) {
      preguntasIniciales[tema].forEach(p => {
        stmt.run(p.question, JSON.stringify(p.options), p.correct, tema);
      });
    }

    stmt.finalize(() => {
      console.log("✅ Preguntas iniciales insertadas en la base de datos.");
    });
  }
});


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
