import { screen } from '@testing-library/react';
import NavBar from '../../assets/Components/NavBar/NavBar';
import { renderWithProviders } from '../test-utils';

describe('NavBar (User)', () => {
    it('renders avatar and navigation links', () => {
        renderWithProviders(<NavBar />);
        expect(screen.getByRole('navigation')).toBeInTheDocument();

        // Hay múltiples elementos que contienen "Inicio" ("Inicio" y "Inicio de Sesión")
        const inicioElements = screen.getAllByText(/Inicio/i);
        expect(inicioElements.length).toBeGreaterThan(0);

        expect(screen.getByText(/Eventos/i)).toBeInTheDocument();
    });
});
