document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();
  fetch("http://localhost:3000/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      correo: document.getElementById("correo").value,
      contrasena: document.getElementById("contrasena").value
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.datos) {
      localStorage.setItem("usuario", JSON.stringify(data.datos));
      window.location.href = "dashboard.html";
    } else {
      alert(data.mensaje);
    }
  });
});