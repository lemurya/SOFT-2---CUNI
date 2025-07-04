class ItemInventario {
  constructor(row) {
    this.id = row.id;
    this.usuarioId = row.usuario_id;
    this.nombre = row.nombre;
    this.tipo = row.tipo;
    this.costo = row.costo;
    this.enUso = row.en_uso === 1; // 👈 conversión aquí
  }
}

module.exports = ItemInventario;
