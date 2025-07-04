import React from 'react';
import {
  Modal, Box, Typography
} from '@mui/material';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const ReporteModal = ({ open, onClose, tema, reportes }) => {
  const total = reportes.reduce((sum, r) => sum + r.total, 0);
  const correctas = reportes.reduce((sum, r) => sum + r.correctas, 0);
  const porcentaje = total > 0 ? (correctas / total) * 100 : 0;
  const promedio = reportes.length > 0 ? (correctas / reportes.length).toFixed(1) : 0;
  const datosGrafico = reportes.map((r, i) => ({
    intento: `#${i + 1}`,
    correctas: r.correctas
  }));

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '95%',
        maxWidth: 800,
        bgcolor: '#ffffff',
        boxShadow: 24,
        p: 4,
        borderRadius: 4
      }}>
        <Typography variant="h6" fontWeight="bold" align="center" gutterBottom>
          📘 Recomendación para: {tema?.toUpperCase()}
        </Typography>

        {reportes.length === 0 ? (
          <Typography align="center" color="text.secondary">
            No hay intentos registrados para este curso.
          </Typography>
        ) : (
          <>
            <Box sx={{ my: 3, px: 2 }}>
              <Box sx={{ px: 2, py: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                <Typography sx={{ mb: 1 }}>
                  <span style={{ fontWeight: 'bold', color: '#d32f2f' }}>🧠 Rendimiento general:</span>
                </Typography>
                <Typography variant="body1" sx={{ mb: 0.5 }}>
                  Has realizado <b>{reportes.length}</b> intento(s) en este curso.
                </Typography>
                <Typography variant="body1" sx={{ mb: 0.5 }}>
                  Total de preguntas respondidas: <b>{total}</b>
                </Typography>
                <Typography variant="body1" sx={{ mb: 0.5 }}>
                  Total de respuestas correctas: <b>{correctas}</b>
                </Typography>
                <Typography variant="body1" sx={{ mb: 0.5 }}>
                  Promedio de aciertos por intento: <b>{promedio}</b>
                </Typography>
                <Typography variant="body1">
                  Porcentaje de aciertos: <b>{porcentaje.toFixed(1)}%</b>
                </Typography>
              </Box>

              {datosGrafico.length > 0 && (
                <Box sx={{ height: 250, mt: 2 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={datosGrafico}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="intento" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Line type="monotone" dataKey="correctas" stroke="#1976d2" />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              )}
            </Box>

            <Box sx={{ my: 3, px: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                ✅ Recomendación específica:
              </Typography>
              <Typography>
                {(() => {
                  if (porcentaje >= 85) return `¡Excelente trabajo! Tu rendimiento en ${tema.toUpperCase()} es alto.`;
                  if (porcentaje >= 60) return `Tu desempeño en ${tema.toUpperCase()} es aceptable.`;
                  return `Te sugerimos reforzar tus conocimientos en ${tema.toUpperCase()}.`;
                })()}
              </Typography>
            </Box>
          </>
        )}

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <button onClick={onClose} style={{ padding: '8px 16px', border: '1px solid #ccc', borderRadius: '8px' }}>
            Cerrar
          </button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ReporteModal;
