class SimulacroSession {
  constructor(preguntas) {
    this.preguntas = preguntas;
    this.index = 0;
    this.correctas = 0;
    this.respuestas = [];
  }

  getActual() {
    return this.preguntas[this.index];
  }

  responder(respuesta) {
    const actual = this.getActual();
    const esCorrecta = respuesta === actual.correct;
    if (esCorrecta) this.correctas++;
    this.respuestas.push({ pregunta: actual.question, respuesta, esCorrecta });
    this.index++;
  }

  terminado() {
    return this.index >= this.preguntas.length;
  }

  resultados() {
    return {
      total: this.preguntas.length,
      correctas: this.correctas,
      incorrectas: this.preguntas.length - this.correctas,
      detalles: this.respuestas
    };
  }
}

export default SimulacroSession;