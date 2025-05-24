function Tienda() {
    this.accesoriosDisponibles = [
        { id: 1, nombre: "Sombrero", precio: 30 },
        { id: 2, nombre: "Cama Deluxe", precio: 50 },
        { id: 3, nombre: "Plato de Oro", precio: 80 }
    ];
}

Tienda.prototype.listarAccesorios = function() {
    return this.accesoriosDisponibles;
};

Tienda.prototype.buscarAccesorioPorId = function(id) {
    for (var i = 0; i < this.accesoriosDisponibles.length; i++) {
        if (this.accesoriosDisponibles[i].id == id) {
            return this.accesoriosDisponibles[i];
        }
    }
    return null;
};

Tienda.prototype.comprarAccesorio = function(usuario, accesorioId) {
    var accesorio = this.buscarAccesorioPorId(accesorioId);
    if (accesorio == null) {
        return "Accesorio no encontrado";
    }

    if (usuario.monedas >= accesorio.precio) {
        usuario.monedas = usuario.monedas - accesorio.precio;
        if (usuario.inventario == null) {
            usuario.inventario = [];
        }
        usuario.inventario.push(accesorio);
        return "Compra exitosa: " + accesorio.nombre;
    } else {
        return "No tienes suficientes monedas";
    }
};