import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, TextField, Divider, MenuItem, Select, InputLabel, FormControl, Button
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const HistorialReportes = () => {
  const [usuario, setUsuario] = useState(null);
  const [reportes, setReportes] = useState([]);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [temaSeleccionado, setTemaSeleccionado] = useState('matematica');

  const temas = ['matematica', 'verbal', 'ciencias', 'historia'];

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

  const filtrarPorFecha = (lista) => {
    if (!fechaInicio && !fechaFin) return lista;
    return lista.filter(r => {
      const fecha = new Date(r.fecha);
      const inicio = fechaInicio ? new Date(fechaInicio) : null;
      const fin = fechaFin ? new Date(fechaFin) : null;
      return (!inicio || fecha >= inicio) && (!fin || fecha <= fin);
    });
  };

  const reportesFiltrados = filtrarPorFecha(reportes.filter(r => r.tema === temaSeleccionado));
  const dataGrafico = reportesFiltrados.map((r, index) => ({
    intento: `#${index + 1}`,
    correctas: r.correctas,
    incorrectas: r.total - r.correctas
  }));

  const generarPDF = async () => {
    const doc = new jsPDF();
    const curso = temaSeleccionado.toUpperCase();
    const logoUrl = "/img/cuni.png";

    // Convertir logo a base64
    const getImageBase64 = (url) =>
      fetch(url)
        .then(res => res.blob())
        .then(blob => new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        }));

    const logoBase64 = await getImageBase64(logoUrl);

    // Encabezado
    doc.addImage(logoBase64, 'PNG', 10, 10, 25, 25);
    doc.setFontSize(16);
    doc.text(`Reporte de Curso: ${curso}`, 40, 20);
    doc.setFontSize(10);
    doc.text(`Fecha de generación: ${new Date().toLocaleString()}`, 40, 32);

    // Información del usuario
    let y = 45;
    doc.setFontSize(12);
    doc.text(`Usuario: ${usuario?.nombre || '---'}`, 14, y); y += 8;
    
    // Tabla de resultados
    autoTable(doc, {
      startY: y + 4,
      head: [['Intento', 'Correctas', 'Incorrectas', 'Total', 'Fecha', 'Hora']],
      body: reportesFiltrados.map((r, i) => [
        `#${i + 1}`,
        r.correctas,
        r.total - r.correctas,
        r.total,
        new Date(r.fecha).toLocaleDateString(),
        new Date(r.fecha).toLocaleTimeString()
      ]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [33, 150, 243] }
    });

    // Recomendación automática
    const totalCorrectas = reportesFiltrados.reduce((sum, r) => sum + r.correctas, 0);
    const totalPreguntas = reportesFiltrados.reduce((sum, r) => sum + r.total, 0);
    const porcentaje = totalPreguntas > 0 ? ((totalCorrectas / totalPreguntas) * 100).toFixed(1) : 0;

    const recomendacion = porcentaje >= 85
      ? 'Excelente desempeño. Mantén tu nivel en este curso.'
      : porcentaje >= 60
        ? 'Desempeño aceptable. Puedes mejorar con más práctica.'
        : 'Se recomienda reforzar este curso con ejercicios adicionales.';

    let ry = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.text("Recomendación del sistema:", 14, ry); ry += 6;
    doc.setFontSize(10);
    doc.text(`- ${recomendacion}`, 18, ry);

    doc.save(`reporte_${curso}.pdf`);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F2F6FC', px: 4, py: 6 }}>
      <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
        📋 Historial de Reportes Detallado
      </Typography>

      <Box sx={{ maxWidth: 900, mx: 'auto', mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Curso</InputLabel>
              <Select
                value={temaSeleccionado}
                label="Curso"
                onChange={(e) => setTemaSeleccionado(e.target.value)}
              >
                {temas.map((tema, idx) => (
                  <MenuItem key={idx} value={tema}>{tema.toUpperCase()}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Desde"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Hasta"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
            />
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ mb: 4 }} />

      <Card elevation={3}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            📘 {temaSeleccionado.toUpperCase()}
          </Typography>

          {reportesFiltrados.length === 0 ? (
            <Typography color="text.secondary">
              No hay reportes disponibles para este curso en el rango seleccionado.
            </Typography>
          ) : (
            <>
              <Box sx={{ height: 350 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dataGrafico}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="intento" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="correctas" fill="#4caf50" name="Correctas" />
                    <Bar dataKey="incorrectas" fill="#f44336" name="Incorrectas" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>

              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Button variant="outlined" color="primary" onClick={generarPDF}>
                  Descargar Reporte PDF
                </Button>
              </Box>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default HistorialReportes;
