import { fireEvent, render, screen } from '@testing-library/react';
import FormLogin from '../../assets/Components/Login/FormLogin';

describe('Admin Login', () => {
    it('renders admin login form and submits', () => {
        render(<FormLogin />);
        expect(screen.getByLabelText(/Email o Nombre de Usuario/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
        fireEvent.change(screen.getByLabelText(/Email o Nombre de Usuario/i), { target: { value: 'admin1' } });
        fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: 'adminpass' } });
        fireEvent.click(screen.getByRole('button', { name: /Iniciar Sesión/i }));
        // Add assertion for successful admin login (mocked)
    });
});
