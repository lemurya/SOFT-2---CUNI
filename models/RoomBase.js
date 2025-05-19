class RoomBase {
    //habitacion empty por default (no se instancia)
    getDescription() {
      return 'Habitación vacía';
    }
  
    getItems() {
      return [];
    }
  }
  
  module.exports = RoomBase;
  