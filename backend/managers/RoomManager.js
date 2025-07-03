const db = require('../database/db');
const RoomBase = require('../models/RoomBase');
const MesaDecorator = require('../decorators/MesaDecorator');
const SillaDecorator = require('../decorators/SillaDecorator');
const ItemDecorator = require('../decorators/ItemDecorator');

class RoomManager {
  constructor() {
    this.rooms = new Map();
  }

  async getRoom(usuarioId) {
    if (this.rooms.has(usuarioId)) {
      return this.rooms.get(usuarioId);
    }

    console.log(' BUSCANDO ITEMS PARA USUARIO:', usuarioId);

    let room = new RoomBase();
    const items = await new Promise((resolve, reject) => {
      db.all(
        `SELECT tipo, datos FROM room_items WHERE usuario_id = ?`,
        [usuarioId],
        (err, rows) => {
          if (err) {
            console.error(' ERROR AL CARGAR ITEMS:', err);
            return reject(err);
          }
          console.log(' ITEMS ENCONTRADOS:', rows);
          resolve(rows);
        }
      );
    });

    for (const item of items) {
      const data = JSON.parse(item.datos);
      switch (item.tipo) {
        case 'mesa':
          room = new MesaDecorator(room, data);
          break;
        case 'silla':
          room = new SillaDecorator(room, data);
          break;
        default:
          room = new ItemDecorator(room, data);
      }
    }

    this.rooms.set(usuarioId, room);
    return room;
  }

  async equipItem(usuarioId, tipo, datos) {
    console.log(' GUARDANDO ITEM:', usuarioId, tipo, datos);
    const disponible = await this.verificarInventarioDisponible(usuarioId, tipo);
    if (!disponible) {
      throw new Error('No tienes este ítem en tu inventario o ya está completamente colocado');
    }

    await new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO room_items (usuario_id, tipo, datos) VALUES (?, ?, ?)`,
        [usuarioId, tipo, JSON.stringify(datos)],
        function (err) {
          if (err) {
            console.error(' ERROR AL GUARDAR:', err);
            return reject(err);
          }
          console.log(' ITEM GUARDADO');
          resolve();
        }
      );
    });

    this.rooms.delete(usuarioId);
  }

  async resetRoom(usuarioId) {
    await new Promise((resolve, reject) => {
      db.run(
        `DELETE FROM room_items WHERE usuario_id = ?`,
        [usuarioId],
        function (err) {
          if (err) return reject(err);
          resolve();
        }
      );
    });

    this.rooms.delete(usuarioId);
  }

  async updateItemPosition(usuarioId, index, newPos) {
    const items = await new Promise((resolve, reject) => {
      db.all(
        'SELECT rowid, datos FROM room_items WHERE usuario_id = ?',
        [usuarioId],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows);
        }
      );
    });
  
    if (index >= items.length) throw new Error('Ítem fuera de rango');
  
    const item = items[index];
    const datos = JSON.parse(item.datos);
    datos.posX = newPos.posX;
    datos.posY = newPos.posY;
  
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE room_items SET datos = ? WHERE rowid = ?',
        [JSON.stringify(datos), item.rowid],
        function (err) {
          if (err) return reject(err);
          resolve({ updated: this.changes });
        }
      );
    });
  
    // Refrescar caché
    this.rooms.delete(usuarioId);
  }
  
  async guardarCambios(usuarioId, items) {
    // 1. Eliminar todos los ítems anteriores del usuario
    await new Promise((resolve, reject) => {
      db.run(
        'DELETE FROM room_items WHERE usuario_id = ?',
        [usuarioId],
        function (err) {
          if (err) return reject(err);
          resolve();
        }
      );
    });
  
    // 2. Insertar nuevos ítems con sus posiciones actualizadas
    for (const item of items) {
      const tipo = item.name;
  
      await new Promise((resolve, reject) => {
        db.run(
          'INSERT INTO room_items (usuario_id, tipo, datos) VALUES (?, ?, ?)',
          [usuarioId, tipo, JSON.stringify(item)],
          function (err) {
            if (err) return reject(err);
            resolve();
          }
        );
      });
    }
  
    // 3. Limpiar caché del room
    this.rooms.delete(usuarioId);
  }  
  
  async verificarInventarioDisponible(usuarioId, tipo) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT COUNT(*) as total FROM tienda_items_usuario WHERE usuario_id = ? AND tipo = ?`,
        [usuarioId, tipo],
        (err, rows1) => {
          if (err) return reject(err);
  
          db.all(
            `SELECT COUNT(*) as colocados FROM room_items WHERE usuario_id = ? AND tipo = ?`,
            [usuarioId, tipo],
            (err2, rows2) => {
              if (err2) return reject(err2);
  
              const total = rows1[0].total;
              const colocados = rows2[0].colocados;
              resolve(total > colocados); // si aún tiene disponibles
            }
          );
        }
      );
    });
  }

}

module.exports = new RoomManager();
