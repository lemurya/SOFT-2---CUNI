const db = require('../database/db');
const ProductoCatalogo = require('../models/ProductoCatalogo');
const ItemInventario = require('../models/ItemInventario');

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
        const items = rows.map(row => new ItemInventario(row)); 
        resolve(items);
      });
    });
  }


  async comprarItem(usuarioId, productoId) {
    try {
      const producto = await new Promise((resolve, reject) => {
        db.get(`SELECT * FROM tienda_catalogo WHERE id = ?`, [productoId], (err, producto) => {
          if (err || !producto) return reject({ mensaje: 'Producto no encontrado' });
          resolve(producto);
        });
      });

      const esRepetible = producto.tipo === 'silla' || producto.tipo === 'mesa';

      const usuario = await new Promise((resolve, reject) => {
        db.get(`SELECT * FROM usuarios WHERE id = ?`, [usuarioId], (err, usuario) => {
          if (err || !usuario) return reject({ mensaje: 'Usuario no encontrado' });
          resolve(usuario);
        });
      });

      if (usuario.monedas < producto.costo) {
        throw { mensaje: 'Fondos insuficientes' };
      }

      const nuevasMonedas = usuario.monedas - producto.costo;

 
      await new Promise((resolve, reject) => {
        db.run(`UPDATE usuarios SET monedas = ? WHERE id = ?`, [nuevasMonedas, usuarioId], (err) => {
          if (err) return reject({ mensaje: 'Error al actualizar monedas' });
          resolve();
        });
      });


      await new Promise((resolve, reject) => {
        db.run(`INSERT INTO tienda_items_usuario (usuario_id, nombre, tipo, costo, en_uso)
                VALUES (?, ?, ?, ?, 0)`,
          [usuarioId, producto.nombre, producto.tipo, producto.costo], function (err) {
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
          });
      });

      return { item: { nombre: producto.nombre, tipo: producto.tipo, enUso: false }, monedasRestantes: nuevasMonedas };

    } catch (error) {
      throw error;
    }
  }


  async activarItem(usuarioId, itemNombre) {
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        
        db.run(`UPDATE tienda_items_usuario SET en_uso = 0 WHERE usuario_id = ?`, [usuarioId], (err) => {
          if (err) return reject({ mensaje: 'Error limpiando estado' });

          
          db.run(`UPDATE tienda_items_usuario SET en_uso = 1 WHERE usuario_id = ? AND nombre = ?`, [usuarioId, itemNombre], (err2) => {
            if (err2) return reject({ mensaje: 'Error activando ítem' });

            db.get(`SELECT * FROM tienda_items_usuario WHERE usuario_id = ? AND nombre = ?`, [usuarioId, itemNombre], (err3, row) => {
              if (err3) return reject({ mensaje: 'Error leyendo ítem' });
              const item = new ItemInventario(row);
              resolve({ mensaje: 'Ítem equipado', item });
            });
          });
        });
      });
    });
  }
}

module.exports = new TiendaService();
