let usuario = null;
let indiceActual = 0;
let preguntas = [];

// Ejecutar al cargar la página
window.onload = () => {
  const usuarioGuardado = localStorage.getItem("usuario");
  if (usuarioGuardado) {
    usuario = JSON.parse(usuarioGuardado);
    mostrarInfoUsuario();
  }
};

// Mostrar datos del usuario
function mostrarInfoUsuario() {
  document.getElementById("usuarioInfo").style.display = "block";
  document.getElementById("usuarioNombre").innerText = usuario.nombre;
  document.getElementById("usuarioExp").innerText = usuario.experiencia;
  document.getElementById("usuarioMonedas").innerText = usuario.monedas;
}

// Registro
function registrar() {
  const nombre = document.getElementById("nombreRegistro").value;
  const correo = document.getElementById("correoRegistro").value;
  const contrasena = document.getElementById("contrasenaRegistro").value;

  fetch("http://localhost:3000/api/usuarios/registro", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre, correo, contrasena })
  })
    .then(res => res.json())
    .then(data => alert(data.mensaje));
}

// Login
function login() {
  const correo = document.getElementById("correo").value;
  const contrasena = document.getElementById("contrasena").value;

  fetch("http://localhost:3000/api/usuarios/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ correo, contrasena })
  })
    .then(res => res.json())
    .then(data => {
      usuario = data.datos;
      localStorage.setItem("usuario", JSON.stringify(usuario)); // Guardar sesión
      mostrarInfoUsuario();
    });
}

// Cambiar nombre
function actualizarNombre() {
  const nuevoNombre = document.getElementById("nuevoNombre").value;

  fetch("http://localhost:3000/api/usuarios/cambiar-nombre", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ correo: usuario.correo, nuevoNombre })
  })
    .then(res => res.json())
    .then(data => {
      alert(data.mensaje);
      usuario.nombre = nuevoNombre;
      localStorage.setItem("usuario", JSON.stringify(usuario)); // actualizar storage
      mostrarInfoUsuario();
    });
}

// Iniciar simulacro
function iniciarSimulacro() {
  const tema = document.getElementById("temaSelect").value;

  fetch("http://localhost:3000/api/simulacro/iniciar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: usuario.id, tema })
  })
    .then(res => res.json())
    .then(data => {
      if (data.error) return alert(data.error);
      indiceActual = 0;
      cargarPreguntas();
    });
}

// Obtener preguntas
function cargarPreguntas() {
  fetch(`http://localhost:3000/api/simulacro/${usuario.id}/todas`)
    .then(res => res.json())
    .then(data => {
      preguntas = data;
      mostrarPregunta();
    });
}

// Mostrar una pregunta
function mostrarPregunta() {
  const contenedor = document.getElementById("pregunta");
  const opciones = document.getElementById("opciones");
  const btn = document.getElementById("btnResponder");

  if (indiceActual >= preguntas.length) {
    contenedor.innerText = "Fin del simulacro.";
    opciones.innerHTML = "";
    btn.style.display = "none";
    return;
  }

  const actual = preguntas[indiceActual];
  contenedor.innerText = actual.question;
  opciones.innerHTML = "";

  actual.options.forEach(opt => {
    opciones.innerHTML += `
      <label><input type="radio" name="respuesta" value="${opt}"> ${opt}</label><br>
    `;
  });

  btn.style.display = "inline";
}

// Responder pregunta
function responder() {
  const seleccion = document.querySelector('input[name="respuesta"]:checked');
  if (!seleccion) return alert("Selecciona una respuesta");

  fetch(`http://localhost:3000/api/simulacro/${usuario.id}/responder`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ respuesta: seleccion.value })
  })
    .then(() => {
      indiceActual++;
      mostrarPregunta();
    });
}

// Ver resultados
function verResultados() {
  fetch(`http://localhost:3000/api/simulacro/${usuario.id}/resultados`)
    .then(res => res.json())
    .then(data => {
      alert(`Total: ${data.total}\nCorrectas: ${data.correctas}\nIncorrectas: ${data.incorrectas}`);
      usuario.experiencia += data.experienciaGanada;
      usuario.monedas += data.monedasGanadas;
      localStorage.setItem("usuario", JSON.stringify(usuario)); // actualizar
      mostrarInfoUsuario();
    });
}

// Ver reportes
function verReportes() {
  fetch(`http://localhost:3000/api/reportes/${usuario.id}`)
    .then(res => res.json())
    .then(data => {
      const div = document.getElementById("historialReportes");
      div.innerHTML = "<h4>Historial de Reportes</h4>";
      data.reportes.forEach(r => {
        div.innerHTML += `<p><b>${r.tema}</b> - ${r.correctas}/${r.total} el ${r.fecha}</p>`;
      });
    });
}

// Filtrar reportes por tema
function verReportesPorTema() {
  const tema = document.getElementById("temaFiltro").value;
  fetch(`http://localhost:3000/api/reportes/${usuario.id}`)
    .then(res => res.json())
    .then(data => {
      const div = document.getElementById("historialReportes");
      div.innerHTML = "<h4>Reportes Filtrados</h4>";
      data.reportes
        .filter(r => r.tema.toLowerCase().includes(tema.toLowerCase()))
        .forEach(r => {
          div.innerHTML += `<p><b>${r.tema}</b> - ${r.correctas}/${r.total} el ${r.fecha}</p>`;
        });
    });
}

// Cerrar sesión
function logout() {
  localStorage.removeItem("usuario");
  location.reload();
}
