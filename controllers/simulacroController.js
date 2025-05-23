const manager = require('../managers/simulacroManager');

const iniciarSimulacro = (req, res) => {
  const { userId, tema } = req.body;
  const sesion = manager.iniciar(userId, tema);
  if (!sesion) return res.status(404).json({ error: 'Tema no válido' });
  res.json({ mensaje: 'Simulacro iniciado', total: sesion.preguntas.length });
};

const obtenerTodas = (req, res) => {
  const { userId } = req.params;
  const sesion = manager.get(userId);
  if (!sesion) return res.status(404).json({ error: 'No hay simulacro activo' });
  res.json(sesion.preguntas);
};

const responder = (req, res) => {
  const { userId } = req.params;
  const { respuesta } = req.body;
  const sesion = manager.get(userId);
  if (!sesion) return res.status(404).json({ error: 'No hay simulacro activo' });
  sesion.responder(respuesta);
  res.json({ mensaje: 'Respuesta registrada' });
};

const verResultados = (req, res) => {
  const { userId } = req.params;
  const sesion = manager.get(userId);
  if (!sesion) return res.status(404).json({ error: 'No hay simulacro activo' });
  res.json(sesion.resultados());
};

const reiniciar = (req, res) => {
  const { userId } = req.params;
  manager.terminar(userId);
  res.json({ mensaje: 'Simulacro reiniciado' });
};

module.exports = {
  iniciarSimulacro,
  obtenerTodas,
  responder,
  verResultados,
  reiniciar
};


