import React from 'react';
import { render, screen } from '@testing-library/react';
import HistorialReportes from '../HistorialReportes';

HTMLCanvasElement.prototype.getContext = () => {};

jest.mock('../useHistorialReportes', () => () => ({
  reportesFiltrados: [],
  temaSeleccionado: 'verbal',
  setTemaSeleccionado: jest.fn(),
  fechaInicio: '2025-06-01',
  fechaFin: '2025-06-30',
  setFechaInicio: jest.fn(),
  setFechaFin: jest.fn()
}));

beforeEach(() => {
  Storage.prototype.getItem = jest.fn(() =>
    JSON.stringify({ id: 1, nombre: 'Usuario de Prueba' })
  );
});

describe('HistorialReportes - Unhappy Path', () => {
  it('muestra mensaje cuando no hay reportes disponibles para el filtro actual', () => {
    render(<HistorialReportes />);

    expect(
      screen.getByText(/no hay reportes disponibles para este curso en el rango seleccionado/i)
    ).toBeInTheDocument();

    expect(screen.queryByText(/descargar reporte pdf/i)).not.toBeInTheDocument();
  });
});
