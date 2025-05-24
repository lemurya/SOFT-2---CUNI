
const ItemDecorator = require('./ItemDecorator');

class MesaDecorator extends ItemDecorator {
  constructor(room, itemData) {
    super(room);
    this.item = { type: 'mesa', ...itemData };
  }

  getDescription() {
    return `${this.room.getDescription()}, con una mesa`;
  }

  getItems() {
    return [...this.room.getItems(), this.item];
  }
}

module.exports = MesaDecorator;
