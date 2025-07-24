import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import App from '../../App';

describe('App (User)', () => {
    it('renders the main navigation', () => {
        render(<App />);
        expect(screen.getByText(/Inicio/i)).toBeInTheDocument();
        expect(screen.getByText(/Nosotros/i)).toBeInTheDocument();
        expect(screen.getByText(/Eventos/i)).toBeInTheDocument();
        expect(screen.getByText(/Neurodiversidad/i)).toBeInTheDocument();
        expect(screen.getByText(/Blog/i)).toBeInTheDocument();
    });
});
