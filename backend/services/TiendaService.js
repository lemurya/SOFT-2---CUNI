// services/TiendaService.js

const db = require('../database/db');
const ProductoCatalogo = require('../models/ProductoCatalogo');
const ItemInventario = require('../models/ItemInventario');

class TiendaService {
  // Obtener productos del catálogo
  async obtenerCatalogo() {
    return new Promise((resolve, reject) => {
      db.all(`SELECT * FROM tienda_catalogo`, (err, rows) => {
        if (err) return reject(err);
        const productos = rows.map(row => new ProductoCatalogo(row));
        resolve(productos);
      });
    });
  }

  // Obtener ítems comprados por el usuario (incluye enUso)
  async obtenerItemsComprados(usuarioId) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM tienda_items_usuario WHERE usuario_id = ?`,
        [usuarioId],
        (err, rows) => {
          if (err) return reject(err);
          // Cada ItemInventario convierte en_uso → enUso booleano
          const items = rows.map(r => new ItemInventario(r));
          resolve(items);
        }
      );
    });
  }

  // Comprar un ítem del catálogo
  async comprarItem(usuarioId, productoId) {
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.get(
          `SELECT * FROM tienda_catalogo WHERE id = ?`,
          [productoId],
          (err, producto) => {
            if (err || !producto) return reject({ mensaje: 'Producto no encontrado' });

            const esRepetible = producto.tipo === 'silla' || producto.tipo === 'mesa';

            // Si no es repetible, evitar duplicados
            const verificarYComprar = () => {
              db.get(
                `SELECT * FROM usuarios WHERE id = ?`,
                [usuarioId],
                (err, usuario) => {
                  if (err || !usuario) return reject({ mensaje: 'Usuario no encontrado' });
                  if (usuario.monedas < producto.costo) {
                    return reject({ mensaje: 'Fondos insuficientes' });
                  }

                  const nuevasMonedas = usuario.monedas - producto.costo;
                  db.run(
                    `UPDATE usuarios SET monedas = ? WHERE id = ?`,
                    [nuevasMonedas, usuarioId],
                    err => {
                      if (err) return reject({ mensaje: 'Error al actualizar monedas' });

                      db.run(
                        `INSERT INTO tienda_items_usuario (usuario_id, nombre, tipo, costo, en_uso)
                         VALUES (?, ?, ?, ?, 0)`,
                        [usuarioId, producto.nombre, producto.tipo, producto.costo],
                        function (err) {
                          if (err) return reject({ mensaje: 'Error al guardar ítem comprado' });

                          resolve({
                            item: {
                              id: this.lastID,
                              usuarioId,
                              nombre: producto.nombre,
                              tipo: producto.tipo,
                              costo: producto.costo,
                              enUso: false
                            },
                            monedasRestantes: nuevasMonedas
                          });
                        }
                      );
                    }
                  );
                }
              );
            };

            if (!esRepetible) {
              db.get(
                `SELECT * FROM tienda_items_usuario WHERE usuario_id = ? AND nombre = ?`,
                [usuarioId, producto.nombre],
                (err, yaComprado) => {
                  if (err) return reject({ mensaje: 'Error al verificar ítem comprado' });
                  if (yaComprado) return reject({ mensaje: 'Este producto ya ha sido comprado' });
                  verificarYComprar();
                }
              );
            } else {
              verificarYComprar();
            }
          }
        );
      });
    });
  }

  // Activar un ítem comprado: marca en_uso = 1 y desactiva los demás
  async activarItem(usuarioId, itemNombre) {
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        // 1) Desequipar todos
        db.run(
          `UPDATE tienda_items_usuario SET en_uso = 0 WHERE usuario_id = ?`,
          [usuarioId],
          err => {
            if (err) return reject({ mensaje: 'Error limpiando estado' });

            // 2) Equipar seleccionado
            db.run(
              `UPDATE tienda_items_usuario SET en_uso = 1 WHERE usuario_id = ? AND nombre = ?`,
              [usuarioId, itemNombre],
              err2 => {
                if (err2) return reject({ mensaje: 'Error activando ítem' });

                // 3) Leer y devolver el registro actualizado
                db.get(
                  `SELECT * FROM tienda_items_usuario WHERE usuario_id = ? AND nombre = ?`,
                  [usuarioId, itemNombre],
                  (err3, row) => {
                    if (err3) return reject({ mensaje: 'Error leyendo ítem' });
                    const item = new ItemInventario(row);
                    resolve({ mensaje: 'Ítem equipado', item });
                  }
                );
              }
            );
          }
        );
      });
    });
  }
}

module.exports = new TiendaService();
