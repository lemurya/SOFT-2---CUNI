import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generarPDFReporte = async (tema, usuario, reportes) => {
  const doc = new jsPDF();
  const curso = tema.toUpperCase();
  const logoUrl = "/img/cuni.png";

  const getImageBase64 = (url) =>
    fetch(url)
      .then(res => res.blob())
      .then(blob => new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      }));

  const logoBase64 = await getImageBase64(logoUrl);

  doc.addImage(logoBase64, 'PNG', 10, 10, 25, 25);
  doc.setFontSize(16);
  doc.text(`Reporte de Curso: ${curso}`, 40, 20);
  doc.setFontSize(10);
  doc.text(`Fecha de generación: ${new Date().toLocaleString()}`, 40, 32);

  let y = 45;
  doc.setFontSize(12);
  doc.text(`Usuario: ${usuario?.nombre || '---'}`, 14, y); y += 8;

  autoTable(doc, {
    startY: y + 4,
    head: [['Intento', 'Correctas', 'Incorrectas', 'Total', 'Fecha', 'Hora']],
    body: reportes.map((r, i) => [
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

  const totalCorrectas = reportes.reduce((sum, r) => sum + r.correctas, 0);
  const totalPreguntas = reportes.reduce((sum, r) => sum + r.total, 0);
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
