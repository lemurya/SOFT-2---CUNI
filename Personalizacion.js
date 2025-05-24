function Personalizacion() {
    this.personalizaciones = {};
}

Personalizacion.prototype.aplicarAccesorio = function(usuario, accesorioId) {
    if (usuario.inventario == null || usuario.inventario.length == 0) {
        return "El usuario no tiene accesorios";
    }

    var encontrado = false;
    for (var i = 0; i < usuario.inventario.length; i++) {
        if (usuario.inventario[i].id == accesorioId) {
            encontrado = true;
            break;
        }
    }

    if (!encontrado) {
        return "El accesorio no está en el inventario del usuario";
    }

    if (this.personalizaciones[usuario.id] == null) {
        this.personalizaciones[usuario.id] = [];
    }

    this.personalizaciones[usuario.id].push(accesorioId);
    return "Accesorio aplicado correctamente";
};

Personalizacion.prototype.obtenerAccesoriosActivos = function(usuario) {
    if (this.personalizaciones[usuario.id] != null) {
        return this.personalizaciones[usuario.id];
    }
    return [];
};