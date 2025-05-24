
class ItemDecorator {
  constructor(room) {
    this.room = room;
  }

  getDescription() {
    return this.room.getDescription();
  }

  getItems() {
    return this.room.getItems();
  }
}

module.exports = ItemDecorator;
