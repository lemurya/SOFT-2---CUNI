import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Grid, Modal, Card, CardContent
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import CalculateIcon from '@mui/icons-material/Calculate';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ScienceIcon from '@mui/icons-material/Science';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';

const Reportes = () => {
  const [usuario, setUsuario] = useState(null);
  const [reportes, setReportes] = useState([]);
  const [temaSeleccionado, setTemaSeleccionado] = useState(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const temas = [
    { nombre: 'matematica', icono: <CalculateIcon fontSize="large" color="primary" /> },
    { nombre: 'verbal', icono: <MenuBookIcon fontSize="large" color="primary" /> },
    { nombre: 'ciencias', icono: <ScienceIcon fontSize="large" color="primary" /> },
    { nombre: 'historia', icono: <HistoryEduIcon fontSize="large" color="primary" /> },
  ];

  useEffect(() => {
    const datos = JSON.parse(localStorage.getItem('usuario'));
    setUsuario(datos);
  }, []);

  useEffect(() => {
    if (usuario?.id) {
      fetch(`http://localhost:3000/api/reportes/${usuario.id}`)
        .then(res => res.json())
        .then(data => setReportes(data.reportes || []))
        .catch(err => console.error('Error al cargar reportes:', err));
    }
  }, [usuario]);

  const handleOpen = (tema) => {
    setTemaSeleccionado(tema);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTemaSeleccionado(null);
  };

  const reportesDelTema = reportes.filter(r => r.tema === temaSeleccionado);
  const total = reportesDelTema.reduce((sum, r) => sum + r.total, 0);
  const correctas = reportesDelTema.reduce((sum, r) => sum + r.correctas, 0);
  const porcentaje = total > 0 ? (correctas / total) * 100 : 0;
  const promedio = reportesDelTema.length > 0 ? (correctas / reportesDelTema.length).toFixed(1) : 0;

  const datosGrafico = reportesDelTema.map((r, i) => ({
    intento: `#${i + 1}`,
    correctas: r.correctas
  }));

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F2F6FC', px: 4, py: 6 }}>
      <Typography variant="h4" align="center" gutterBottom fontWeight="bold">
        📊 Panel de Reportes por Curso
      </Typography>

      <Grid container spacing={4} justifyContent="center" sx={{ mt: 4, maxWidth: 500, mx: 'auto' }}>
        {temas.map((tema, index) => (
          <Grid item xs={6} key={index}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.3 }}>
              <Card
                elevation={3}
                sx={{
                  textAlign: 'center',
                  p: 3,
                  cursor: 'pointer',
                  borderRadius: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
                onClick={() => handleOpen(tema.nombre)}
              >
                {tema.icono}
                <Typography variant="h6" fontWeight="bold" sx={{ mt: 1 }}>
                  {tema.nombre.toUpperCase()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ver evolución y detalles
                </Typography>
              </Card>
            </motion.div>
          </Grid>
        ))}

        <Grid item xs={12}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.3 }}>
            <Card
              elevation={3}
              sx={{
                textAlign: 'center',
                p: 3,
                cursor: 'pointer',
                borderRadius: 3,
                maxWidth: 300,
                mx: 'auto',
                mt: 2
              }}
              onClick={() => navigate('/historial')}
            >
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                📋 HISTORIAL DE REPORTES
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ver el resumen completo de todos los cursos
              </Typography>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      <Modal open={open} onClose={handleClose}>
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
            📘 Recomendación para: {temaSeleccionado?.toUpperCase()}
          </Typography>

          {reportesDelTema.length === 0 ? (
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
                    Has realizado <b>{reportesDelTema.length}</b> intento(s) en este curso.
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
                    if (porcentaje >= 85) return `¡Excelente trabajo! Tu rendimiento en ${temaSeleccionado.toUpperCase()} es alto.`;
                    if (porcentaje >= 60) return `Tu desempeño en ${temaSeleccionado.toUpperCase()} es aceptable.`;
                    return `Te sugerimos reforzar tus conocimientos en ${temaSeleccionado.toUpperCase()}.`;
                  })()}
                </Typography>
              </Box>
            </>
          )}

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
            <button onClick={handleClose} style={{ padding: '8px 16px', border: '1px solid #ccc', borderRadius: '8px' }}>
              Cerrar
            </button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Reportes;
