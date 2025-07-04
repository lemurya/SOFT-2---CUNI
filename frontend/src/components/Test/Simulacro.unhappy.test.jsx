import React from 'react';
import { render as renderUnhappy, screen as screenUnhappy, fireEvent as fireUnhappy } from '@testing-library/react';
import { MemoryRouter as MemoryRouterUnhappy } from 'react-router-dom';
import Simulacro from '../Simulacro';

beforeAll(() => {
  window.alert = jest.fn();
});

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.setItem('usuario', JSON.stringify({ id: 1, nombre: 'Test' }));
});

afterEach(() => {
  localStorage.clear();
});

describe('Simulacro - Unhappy Path', () => {
  it('muestra alerta si no se selecciona tema antes de iniciar', async () => {
    renderUnhappy(
      <MemoryRouterUnhappy>
        <Simulacro />
      </MemoryRouterUnhappy>
    );

    fireUnhappy.click(screenUnhappy.getByRole('button', { name: /iniciar simulacro/i }));
    expect(window.alert).toHaveBeenCalledWith("Por favor selecciona un tema");
  });

  it('permite avanzar aunque no se haya seleccionado respuesta', async () => {
    renderUnhappy(
      <MemoryRouterUnhappy>
        <Simulacro />
      </MemoryRouterUnhappy>
    );

    const combo = screenUnhappy.getByRole('combobox');
    fireUnhappy.mouseDown(combo);
    const opcion = await screenUnhappy.findByText(/matematica/i);
    fireUnhappy.click(opcion);

    fireUnhappy.click(screenUnhappy.getByRole('button', { name: /iniciar simulacro/i }));
    await screenUnhappy.findByText(/pregunta 1/i);

    fireUnhappy.click(screenUnhappy.getByRole('button', { name: /siguiente/i }));

    const pregunta2 = await screenUnhappy.findByText(/pregunta 2/i);
    expect(pregunta2).toBeInTheDocument();
    expect(window.alert).not.toHaveBeenCalled();
  });
});
