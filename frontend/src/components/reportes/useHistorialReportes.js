import { useEffect, useState } from 'react';

const useHistorialReportes = (usuario) => {
  const [reportes, setReportes] = useState([]);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [temaSeleccionado, setTemaSeleccionado] = useState('matematica');

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

  const reportesDelTema = reportes.filter(r => r.tema === temaSeleccionado);
  const reportesFiltrados = filtrarPorFecha(reportesDelTema);

  return {
    reportesFiltrados,
    temaSeleccionado,
    setTemaSeleccionado,
    fechaInicio,
    fechaFin,
    setFechaInicio,
    setFechaFin
  };
};

export default useHistorialReportes;
