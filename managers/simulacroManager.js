
const preguntasPorTema = require('../data/preguntas.json');

const sesiones = {};

const iniciar = (userId, tema) => {
  if (!preguntasPorTema[tema]) return null;

  sesiones[userId] = {
    tema,
    preguntas: [...preguntasPorTema[tema]],
    indice: 0,
    correctas: 0,
    responder(respuesta) {
      const actual = this.preguntas[this.indice];
      if (!actual) return;
      if (respuesta === actual.correct) this.correctas++;
      this.indice++;
    },
    getActual() {
      return this.preguntas[this.indice];
    },
    terminado() {
      return this.indice >= this.preguntas.length;
    },
    resultados() {
      return {
        total: this.preguntas.length,
        correctas: this.correctas,
        incorrectas: this.preguntas.length - this.correctas
      };
    }
  };

  return sesiones[userId];
};

const get = (userId) => sesiones[userId];
const terminar = (userId) => delete sesiones[userId];

module.exports = {
  iniciar,
  get,
  terminar
};
