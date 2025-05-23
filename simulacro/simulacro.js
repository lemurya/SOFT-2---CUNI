
let userId = localStorage.getItem("userId");
const tema = localStorage.getItem("tema");

console.log("✅ userId:", userId);
console.log("✅ tema:", tema);

let preguntas = [];
let indice = 0;
let correctas = 0;
let puntos = 0;

document.addEventListener('DOMContentLoaded', () => {
  iniciarSimulacro();
});

// PRincipio de responsabilidad unica: esta función inicia la sesión en el backend
async function iniciarSimulacro() {
  if (!userId || !tema) {
    alert("Faltan datos del simulacro");
    window.location.href = "simulacro.html";
    return;
  }

  await fetch('/api/simulacro/iniciar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, tema })
  });

  cargarPregunta();
}

// SRP: esta función carga todas las preguntas de una vez
async function cargarPreguntas() {
  const res = await fetch(`/api/simulacro/${userId}/todas`);
  if (!res.ok) {
    alert("No se pudieron cargar las preguntas.");
    return;
  }

  const todas = await res.json();

  document.getElementById('inicio').style.display = 'none';
  document.getElementById('simulacro').style.display = 'block';

  const contenedor = document.getElementById('contenedor-preguntas');
  contenedor.innerHTML = '';

  todas.forEach((pregunta, index) => {
    const card = document.createElement('div');
    card.className = 'card';

    card.innerHTML = `
      <h3>Pregunta ${index + 1}</h3>
      <p>${pregunta.question}</p>
      ${pregunta.options.map(op => `
        <label>
          <input type="radio" name="preg-${index}" value="${op}">
          ${op}
        </label>
      `).join('<br>')}
    `;

    contenedor.appendChild(card);
  });

  document.getElementById('finalizar-btn').style.display = 'block';
}



async function enviarRespuesta() {
  const seleccion = document.querySelector('input[name="opcion"]:checked');
  if (!seleccion) return alert("Selecciona una respuesta");

  await fetch(`/api/simulacro/${userId}/responder`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ respuesta: seleccion.value })
  });

  cargarPregunta();
}

// SRP: evalúa las respuestas del usuario contra el set original
async function calcularResultados() {
  let correctas = 0;

  const res = await fetch(`/api/simulacro/${userId}/todas`);
  const preguntas = await res.json();

  preguntas.forEach((pregunta, i) => {
    const seleccion = document.querySelector(`input[name="preg-${i}"]:checked`);
    if (seleccion && seleccion.value === pregunta.correct) correctas++;
  });

      const total = preguntas.length;
      const xp = correctas * 10;

      document.getElementById('simulacro').style.display = 'none';
      document.getElementById('resultado').style.display = 'block';
      document.getElementById('detalle-resultado').innerText =
        `✔️ Correctas: ${correctas} / ${total}\n` +
        `❌ Incorrectas: ${total - correctas}\n` +
        `🏅 Puntos obtenidos: ${xp}\n✨ Experiencia ganada: ${xp} XP`;
}


// SRP: limpia la sesión en backend y redirige al inicio
async function reiniciar() {
  await fetch(`/api/simulacro/${userId}/reiniciar`, { method: 'DELETE' });
  window.location.href = "simulacro.html";
}

// Hook de inicio que respeta la separación de responsabilidades
document.addEventListener("DOMContentLoaded", () => {
  cargarPreguntas();
});
