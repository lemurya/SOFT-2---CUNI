document.getElementById("registroForm").addEventListener("submit", function(e) {
  e.preventDefault();
  fetch("http://localhost:3000/api/registro", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nombre: document.getElementById("nombre").value,
      correo: document.getElementById("correo").value,
      contrasena: document.getElementById("contrasena").value
    })
  })
  .then(res => res.json())
  .then(data => alert(data.mensaje));
});