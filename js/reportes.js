const usuario = JSON.parse(localStorage.getItem("usuario"));
if (!usuario) {
  window.location.href = "login.html";
}
fetch(`http://localhost:3000/api/reportes?usuario_id=${usuario.id}`)
  .then(res => res.json())
  .then(data => {
    const div = document.getElementById("reportes");
    if (data.reportes.length === 0) {
      div.innerHTML = "<p>No hay reportes disponibles.</p>";
    } else {
      let html = "<ul>";
      data.reportes.forEach(r => {
        html += `<li>${r.fecha}: ${r.correctas}/${r.total} correctas</li>`;
      });
      html += "</ul>";
      div.innerHTML = html;
    }
  });