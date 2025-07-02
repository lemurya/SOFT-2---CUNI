const db = require('../database/db');

const sesiones = {};

const obtenerPreguntasDesdeDB = (tema) => {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM preguntas WHERE tema = ?`, [tema], (err, rows) => {
      if (err) return reject(err);

      const preguntas = rows.map(row => ({
        id: row.id,
        pregunta: row.pregunta,
        opciones: JSON.parse(row.opciones),
        correct: row.correcta
      }));

      resolve(preguntas);
    });
  });
};

const iniciar = async (userId, tema) => {
  try {
    const preguntas = await obtenerPreguntasDesdeDB(tema);
    if (!preguntas.length) return null;

    sesiones[userId] = {
      tema,
      preguntas,
      correctas: 0,
      respuestas: Array(preguntas.length).fill(null), 
    };

    return sesiones[userId];
  } catch (err) {
    console.error("Error al obtener preguntas de DB:", err);
    return null;
  }
};

const responder = (userId, respuesta, indice) => {
  const sesion = sesiones[userId];
  if (!sesion || !sesion.preguntas[indice]) return;

  // Evitar doble evaluación
  if (sesion.respuestas[indice] !== null) return;

  const pregunta = sesion.preguntas[indice];
  sesion.respuestas[indice] = respuesta;

  if (respuesta === pregunta.correct) {
    sesion.correctas++;
  }
};

const get = (userId) => sesiones[userId];

const terminar = (userId) => delete sesiones[userId];

module.exports = {
  iniciar,
  responder,
  get,
  terminar
};