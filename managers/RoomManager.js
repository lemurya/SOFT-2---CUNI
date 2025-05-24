
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

    let room = new RoomBase();
    const items = await new Promise((resolve, reject) => {
      db.all(`SELECT tipo, datos FROM room_items WHERE usuario_id = ?`, [usuarioId], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
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
    await new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO room_items (usuario_id, tipo, datos) VALUES (?, ?, ?)`,
        [usuarioId, tipo, JSON.stringify(datos)],
        function (err) {
          if (err) return reject(err);
          resolve();
        }
      );
    });
    this.rooms.delete(usuarioId);
  }

  async resetRoom(usuarioId) {
    await new Promise((resolve, reject) => {
      db.run(`DELETE FROM room_items WHERE usuario_id = ?`, [usuarioId], function (err) {
        if (err) return reject(err);
        resolve();
      });
    });
    this.rooms.delete(usuarioId);
  }
}

module.exports = new RoomManager();
