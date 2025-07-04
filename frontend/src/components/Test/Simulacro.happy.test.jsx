import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Simulacro from '../Simulacro';


beforeEach(() => {
  localStorage.setItem('usuario', JSON.stringify({ id: 1, nombre: 'Test' }));
  jest.useFakeTimers();
});

afterEach(() => {
  localStorage.clear();
  jest.clearAllTimers();
  jest.clearAllMocks();
});

describe('Simulacro - Happy Path', () => {
  it('selecciona una respuesta y permite avanzar a la siguiente pregunta', async () => {
    render(
      <MemoryRouter>
        <Simulacro />
      </MemoryRouter>
    );

    fireEvent.mouseDown(screen.getByRole('combobox'));
    fireEvent.click(await screen.findByText(/matematica/i));
    fireEvent.click(screen.getByRole('button', { name: /iniciar simulacro/i }));

    // Esperar que cargue la primera pregunta
    expect(await screen.findByText(/pregunta 1/i)).toBeInTheDocument();

    // Seleccionar una respuesta
    const opciones = await screen.findAllByRole('radio');
    fireEvent.click(opciones[0]);

    // Navegar a la siguiente pregunta
    fireEvent.click(screen.getByRole('button', { name: /siguiente/i }));

    // Verificar que muestra la segunda pregunta
    expect(await screen.findByText(/pregunta 2/i)).toBeInTheDocument();
  });

  it('el temporizador decrece correctamente con el tiempo', async () => {
    render(
      <MemoryRouter>
        <Simulacro />
      </MemoryRouter>
    );

    fireEvent.mouseDown(screen.getByRole('combobox'));
    fireEvent.click(await screen.findByText(/matematica/i));
    fireEvent.click(screen.getByRole('button', { name: /iniciar simulacro/i }));

    expect(await screen.findByText(/pregunta 1/i)).toBeInTheDocument();

    const tiempoAntes = await screen.findByTestId('temporizador');
    const valorInicial = tiempoAntes.textContent;

    await act(async () => {
      jest.advanceTimersByTime(3000);
    });

    const tiempoDespues = await screen.findByTestId('temporizador');
    expect(tiempoDespues.textContent).not.toEqual(valorInicial);
  });
});
