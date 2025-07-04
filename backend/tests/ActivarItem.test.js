// tests/ActivarItem.test.js

const TiendaService = require('../services/TiendaService');
const db = require('../database/db');

// Precondición para las pruebas
beforeAll(done => {
  db.serialize(() => {
    // Crear tablas necesarias
    db.run(`CREATE TABLE IF NOT EXISTS tienda_items_usuario (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER NOT NULL,
      nombre TEXT NOT NULL,
      tipo TEXT NOT NULL,
      costo INTEGER NOT NULL,
      en_uso INTEGER DEFAULT 0
    )`);

    // Insertar dos ítems para el usuario 1
    db.run(`DELETE FROM tienda_items_usuario`);
    db.run(`INSERT INTO tienda_items_usuario (usuario_id, nombre, tipo, costo, en_uso)
            VALUES (1, 'Gorro Andino', 'accesorio', 20, 0)`);
    db.run(`INSERT INTO tienda_items_usuario (usuario_id, nombre, tipo, costo, en_uso)
            VALUES (1, 'Chaleco de Alpaca', 'accesorio', 35, 1)`, done);
  });
});

// Limpiar después de las pruebas
afterAll(done => {
  db.close(done);
});

// Test: Activar un ítem y asegurarse de que sólo esté marcado como en uso el ítem seleccionado
test('activarItem debe marcar en_uso solo al ítem seleccionado', async () => {
  jest.setTimeout(20000);  // Aumenta el tiempo de espera a 20 segundos

  console.log("Empezando prueba de activación...");
  
  const result = await TiendaService.activarItem(1, 'Gorro Andino');

  // Verificamos que el ítem seleccionado esté en uso
  expect(result).toHaveProperty('mensaje', 'Ítem equipado');
  expect(result.item.nombre).toBe('Gorro Andino');
  expect(result.item.enUso).toBe(true);

  // Verificamos que otros ítems no estén en uso
  const items = await TiendaService.obtenerItemsComprados(1);
  const gorro = items.find(i => i.nombre === 'Gorro Andino');
  const chompa = items.find(i => i.nombre === 'Chaleco de Alpaca');

  expect(gorro.enUso).toBe(true);
  expect(chompa.enUso).toBe(false);
});



