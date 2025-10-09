import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import App from '../../App';
import { renderWithProviders } from '../test-utils';

describe('App (User)', () => {
    it('renders the main navigation', () => {
        renderWithProviders(<App />);

        // Check that multiple navigation elements exist (expected behavior)
        const inicioElements = screen.getAllByText(/Inicio/i);
        expect(inicioElements.length).toBeGreaterThan(0);

        // Check for other navigation elements
        const equipoElements = screen.getAllByText(/Equipo/i);
        expect(equipoElements.length).toBeGreaterThan(0);

        const eventosElements = screen.getAllByText(/Eventos/i);
        expect(eventosElements.length).toBeGreaterThan(0);

        const blogElements = screen.getAllByText(/Blog/i);
        expect(blogElements.length).toBeGreaterThan(0);
    });
});
