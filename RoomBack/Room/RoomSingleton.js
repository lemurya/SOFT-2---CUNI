const RoomBase = require('../models/RoomBase');

class Room {
  //room es la habitación única propia de cada jugador
  constructor() {
    if (Room.instance) return Room.instance;
    this.baseRoom = new RoomBase();
    this.decoratedRoom = this.baseRoom;
    Room.instance = this;
  }

  equipItem(decoratorClass, itemData) {
    //equipar accesorios en el room (post)
    this.decoratedRoom = new decoratorClass(this.decoratedRoom, itemData);
  }

  //get
  getItems() {
    return this.decoratedRoom.getItems();
  }
  //get
  getDescription() {
    return this.decoratedRoom.getDescription();
  }
  //delete
  clearItems() {
    this.baseRoom = new RoomBase();
    this.decoratedRoom = this.baseRoom;
  }
}

module.exports = new Room();
