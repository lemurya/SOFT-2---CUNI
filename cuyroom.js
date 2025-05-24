var usuario = {
    id: 1,
    monedas: 100,
    hambre: 50,
    felicidad: 100,
    inventario: [],
    activos: []
};

var ropa = [
    { id: 1, nombre: "Gorro Andino", precio: 20 },
    { id: 2, nombre: "Chaleco de Alpaca", precio: 35 },
    { id: 3, nombre: "Bufanda Morada", precio: 25 }
];

function actualizar() {
    document.getElementById("monedas").innerText = usuario.monedas;
    document.getElementById("estado").innerText = "Hambre: " + usuario.hambre + " | Felicidad: " + usuario.felicidad;
    renderTienda();
    renderInventario();
    renderPersonalizacion();
}

function alimentar() {
    usuario.hambre = Math.max(0, usuario.hambre - 20);
    usuario.felicidad = Math.min(100, usuario.felicidad + 10);
    actualizar();
}


function comprar(id) {
    for (var i = 0; i < ropa.length; i++) {
        if (ropa[i].id == id && usuario.monedas >= ropa[i].precio) {
            usuario.monedas -= ropa[i].precio;
            usuario.inventario.push(ropa[i]);
            alert("Compraste " + ropa[i].nombre);
            actualizar();
            return;
        }
    }
    alert("No tienes suficientes monedas.");
}

function renderInventario() {
    var html = "";
    for (var i = 0; i < usuario.inventario.length; i++) {
        var item = usuario.inventario[i];
        html += "<p>" + item.nombre + " <button onclick='aplicar(" + item.id + ")'>Usar</button></p>";
    }
    document.getElementById("inventario").innerHTML = html;
}

function aplicar(id) {
    usuario.activos.push(id);
    actualizar();
}

function renderPersonalizacion() {
    var html = "Accesorios activos: ";
    for (var i = 0; i < usuario.activos.length; i++) {
        for (var j = 0; j < usuario.inventario.length; j++) {
            if (usuario.inventario[j].id == usuario.activos[i]) {
                html += usuario.inventario[j].nombre + ", ";
            }
        }
    }
    document.getElementById("personalizacion").innerText = html;
}

actualizar();