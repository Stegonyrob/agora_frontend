import { fireEvent, render, screen } from '@testing-library/react';
import RegisterForm from '../../assets/Components/Register/RegisterForm';

describe('Create Admin', () => {
    it('renders admin creation form and submits', () => {
        render(<RegisterForm />);
        expect(screen.getByLabelText(/Nombre de Usuario/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
        fireEvent.change(screen.getByLabelText(/Nombre de Usuario/i), { target: { value: 'Nuevo Admin' } });
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'admin@correo.com' } });
        fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: 'adminpass' } });
        fireEvent.click(screen.getByRole('button', { name: /Registrarse/i }));
        // Add assertion for successful admin creation (mocked)
    });
});
