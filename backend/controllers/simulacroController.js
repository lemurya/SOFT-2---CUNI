const manager = require('../managers/simulacroManager');
const Reporte = require('../models/Reporte');
const db = require('../database/db');

const iniciarSimulacro = async (req, res) => {
  const { userId, tema } = req.body;
  const sesion = await manager.iniciar(userId, tema);
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
  const { respuesta, indice } = req.body;

  if (!respuesta || indice === undefined) {
    return res.status(400).json({ error: 'Datos incompletos' });
  }

  const sesion = manager.get(userId);
  if (!sesion) return res.status(404).json({ error: 'No hay simulacro activo' });

  manager.responder(userId, respuesta, indice);
  res.json({ mensaje: 'Respuesta registrada' });
};

const verResultados = async (req, res) => {
  const { userId } = req.params;
  const sesion = manager.get(userId);
  if (!sesion) return res.status(404).json({ error: 'No hay simulacro activo' });

  const resultado = {
    total: sesion.preguntas.length,
    correctas: sesion.correctas,
    incorrectas: sesion.preguntas.length - sesion.correctas
  };

  const experienciaGanada = resultado.correctas * 20;
  const monedasGanadas = resultado.correctas * 50;
  const reporte = new Reporte(userId, sesion.tema, resultado.correctas, resultado.total);

  try {
    await reporte.guardarEnDB(db);

    await new Promise((resolve, reject) => {
      db.run(
        `UPDATE usuarios SET experiencia = experiencia + ?, monedas = monedas + ? WHERE id = ?`,
        [experienciaGanada, monedasGanadas, userId],
        function (err) {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    res.json({
      mensaje: 'Simulacro finalizado',
      ...resultado,
      experienciaGanada,
      monedasGanadas
    });

    manager.terminar(userId); 
  } catch (error) {
    console.error('Error al guardar reporte o recompensas:', error);
    res.status(500).json({ mensaje: 'Error al guardar reporte o recompensas', error: error.message });
  }
};

module.exports = {
  iniciarSimulacro,
  obtenerTodas,
  responder,
  verResultados
};
