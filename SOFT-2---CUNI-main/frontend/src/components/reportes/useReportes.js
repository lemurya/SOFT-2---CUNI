import { useEffect, useState } from 'react';

const useReportes = (usuarioId) => {
  const [reportes, setReportes] = useState([]);

  useEffect(() => {
    if (usuarioId) {
      fetch(`http://localhost:3000/api/reportes/${usuarioId}`)
        .then(res => res.json())
        .then(data => setReportes(data.reportes || []))
        .catch(err => console.error('Error al cargar reportes:', err));
    }
  }, [usuarioId]);

  return reportes;
};

export default useReportes;
