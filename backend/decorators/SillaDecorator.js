
const ItemDecorator = require('./ItemDecorator');

class SillaDecorator extends ItemDecorator {
  constructor(room, itemData) {
    super(room);
    this.item = { type: 'silla', ...itemData };
  }

  getDescription() {
    return `${this.room.getDescription()}, con una silla`;
  }

  getItems() {
    return [...this.room.getItems(), this.item];
  }
}

module.exports = SillaDecorator;
