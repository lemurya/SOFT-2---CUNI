const ItemDecorator = require('./ItemDecorator');

class SillaDecorator extends ItemDecorator {
    //agregarle una silla gamer al cuy
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
