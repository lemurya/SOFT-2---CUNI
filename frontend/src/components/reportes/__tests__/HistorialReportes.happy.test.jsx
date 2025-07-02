import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import HistorialReportes from '../HistorialReportes';

HTMLCanvasElement.prototype.getContext = () => {};

const mockGenerarPDF = jest.fn();
jest.mock('../../../utils/generarPDFReporte', () => ({
  generarPDFReporte: (...args) => mockGenerarPDF(...args)
}));

jest.mock('../useHistorialReportes', () => () => ({
  reportesFiltrados: [
    { tema: 'verbal', correctas: 8, total: 10, fecha: '2025-06-10T10:00:00' }
  ],
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

describe('HistorialReportes - Happy Path', () => {
  it('muestra botón de descarga y llama a generarPDFReporte al hacer click', () => {
    render(<HistorialReportes />);

    const botonPDF = screen.getByText(/descargar reporte pdf/i);
    expect(botonPDF).toBeInTheDocument();

    fireEvent.click(botonPDF);

    expect(mockGenerarPDF).toHaveBeenCalled();
  });
});
