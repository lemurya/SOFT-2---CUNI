class ItemInventario {
    constructor({ nombre, tipo, costo, en_uso }) {
      this.nombre = nombre;
      this.tipo = tipo;
      this.costo = costo;
      this.enUso = en_uso === 1; // convertir 1/0 en booleano
    }
  }
  
  module.exports = ItemInventario;