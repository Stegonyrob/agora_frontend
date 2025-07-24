import { fireEvent, render, screen } from '@testing-library/react';
import RegisterForm from '../../assets/Components/Register/RegisterForm';

describe('User Registration', () => {
    it('renders registration form and submits', () => {
        render(<RegisterForm />);
        expect(screen.getByLabelText(/Nombre/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
        fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: 'Nuevo Usuario' } });
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'nuevo@correo.com' } });
        fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: 'password' } });
        fireEvent.click(screen.getByRole('button', { name: /Registrarse/i }));
        // Add assertion for successful registration (mocked)
    });
});
