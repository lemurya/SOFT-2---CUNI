document.getElementById("formCambio").addEventListener("submit", function(e) {
  e.preventDefault();
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  fetch("http://localhost:3000/api/cambiar-contrasena", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      correo: usuario.correo,
      contrasenaActual: document.getElementById("actual").value,
      nuevaContrasena: document.getElementById("nueva").value
    })
  })
  .then(res => res.json())
  .then(data => alert(data.mensaje));
});