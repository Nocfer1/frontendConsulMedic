import { render, screen } from '@testing-library/react';
import App from './App';

describe('Página principal de ConsulMedic', () => {
  test('muestra el título principal', () => {
    render(<App />);
    const titulo = screen.getByText(/Aplicación para transcribir consultas médicas/i);
    expect(titulo).toBeInTheDocument();
  });

  test('muestra el botón Comenzar ahora', () => {
    render(<App />);
    const boton = screen.getByRole('button', { name: /comenzar ahora/i });
    expect(boton).toBeInTheDocument();
  });

});
