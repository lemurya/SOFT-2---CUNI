class Room {
    constructor() {
      if (Room.instance) return Room.instance;
      this.items = [];
      Room.instance = this;
    }
  
    equipItem(item) {
      this.items.push(item);
    }
  
    getItems() {
      return this.items;
    }
  
    clearItems() {
      this.items = [];
    }
  }
  
  const roomInstance = new Room();
  module.exports = roomInstance;
  