class Room {
    //room es la habitación única propia de cada jugador
    constructor() {
      if (Room.instance) return Room.instance;
      this.items = [];
      Room.instance = this;
    }

    //equipar accesorios en el room (post)
    equipItem(item) {
      this.items.push(item);
    }
    
    //get
    getItems() {
      return this.items;
    }

    //delete
    clearItems() {
      this.items = [];
    }
  }
  
  const roomInstance = new Room();
  module.exports = roomInstance;
  