
const manager = require('../managers/simulacroManager');
const Reporte = require('../models/Reporte');
const db = require('../database/db');

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
  if (sesion.terminado()) return res.status(400).json({ error: 'El simulacro ya ha finalizado' });
  sesion.responder(respuesta);
  res.json({ mensaje: 'Respuesta registrada' });
};

const verResultados = async (req, res) => {
  const { userId } = req.params;
  const sesion = manager.get(userId);
  if (!sesion) return res.status(404).json({ error: 'No hay simulacro activo' });

  const resultado = sesion.resultados();
  const tema = sesion.tema || 'desconocido';

  const reporte = new Reporte(userId, tema, resultado.correctas, resultado.total);
  const experienciaGanada = resultado.correctas * 20;
  const monedasGanadas = resultado.correctas * 50;

  try {
    const guardado = await reporte.guardarEnDB(db);

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
      total: resultado.total,
      correctas: resultado.correctas,
      incorrectas: resultado.incorrectas,
      experienciaGanada,
      monedasGanadas,
      guardado
    });
    
  } catch (error) {
    console.error('Error al guardar reporte o recompensas:', error);
    res.status(500).json({ mensaje: 'Error al guardar reporte o recompensas', error: error.message });
  }
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
