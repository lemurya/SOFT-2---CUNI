// Simulación básica de usuario y backend en memoria
var usuario = {
    id: 1,
    monedas: 100,
    inventario: []
};

var estado = { hambre: 50, felicidad: 100 };

function alimentar() {
    estado.hambre = Math.max(0, estado.hambre - 20);
    document.getElementById("estado").innerText =
        "Hambre: " + estado.hambre + ", Felicidad: " + estado.felicidad;
}


function mostrarInventario() {
    var html = "";
    for (var i = 0; i < usuario.inventario.length; i++) {
        var item = usuario.inventario[i];
        html += item.nombre + " " +
            "<button onclick='aplicarAccesorio(" + item.id + ")'>Usar</button><br>";
    }
    document.getElementById("inventario").innerHTML = html;
}

var personalizados = [];

function aplicarAccesorio(id) {
    personalizados.push(id);
    document.getElementById("personalizacion").innerText =
        "Accesorios activos: " + personalizados.join(", ");
}