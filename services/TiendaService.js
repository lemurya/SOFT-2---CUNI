const db = require('../database/db');
const ItemTienda = require('../models/ItemTienda');
const ProductoCatalogo = require('../models/ProductoCatalogo');

class TiendaService {
  async obtenerCatalogo() {
    return new Promise((resolve, reject) => {
      db.all(`SELECT * FROM tienda_catalogo`, (err, rows) => {
        if (err) return reject(err);

        const productos = rows.map(row => new ProductoCatalogo(row));
        resolve(productos);
      });
    });
  }

  async obtenerItemsComprados(usuarioId) {
    return new Promise((resolve, reject) => {
      db.all(`SELECT * FROM tienda_items_usuario WHERE usuario_id = ?`, [usuarioId], (err, rows) => {
        if (err) return reject(err);

        const items = rows.map(row => new ItemTienda(row));
        resolve(items);
      });
    });
  }

  async comprarItem(usuarioId, productoId) {
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        // 1. Obtener el producto
        db.get(`SELECT * FROM tienda_catalogo WHERE id = ?`, [productoId], (err, producto) => {
          if (err || !producto) return reject({ mensaje: 'Producto no encontrado' });
  
          // 2. Verificar si el usuario ya compró ese ítem
          db.get(`SELECT * FROM tienda_items_usuario WHERE usuario_id = ? AND nombre = ?`, [usuarioId, producto.nombre], (err, yaComprado) => {
            if (err) return reject({ mensaje: 'Error al verificar ítem comprado' });
            if (yaComprado) return reject({ mensaje: 'Este producto ya ha sido comprado' });
  
            // 3. Obtener usuario y verificar monedas
            db.get(`SELECT * FROM usuarios WHERE id = ?`, [usuarioId], (err, usuario) => {
              if (err || !usuario) return reject({ mensaje: 'Usuario no encontrado' });
  
              if (usuario.monedas < producto.costo) {
                return reject({ mensaje: 'Fondos insuficientes' });
              }
  
              // 4. Descontar monedas
              const nuevasMonedas = usuario.monedas - producto.costo;
              db.run(`UPDATE usuarios SET monedas = ? WHERE id = ?`, [nuevasMonedas, usuarioId], (err) => {
                if (err) return reject({ mensaje: 'Error al actualizar monedas' });
  
                // 5. Insertar compra
                db.run(`
                  INSERT INTO tienda_items_usuario (usuario_id, nombre, tipo, costo)
                  VALUES (?, ?, ?, ?)
                `, [usuarioId, producto.nombre, producto.tipo, producto.costo], function (err) {
                  if (err) return reject({ mensaje: 'Error al guardar ítem comprado' });
  
                  resolve({
                    item: {
                      id: this.lastID,
                      usuarioId,
                      nombre: producto.nombre,
                      tipo: producto.tipo,
                      costo: producto.costo
                    },
                    monedasRestantes: nuevasMonedas
                  });
                });
              });
            });
          });
        });
      });
    });
  }
  
  }

module.exports = new TiendaService();
