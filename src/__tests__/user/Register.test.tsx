import { fireEvent, screen } from '@testing-library/react';
import RegisterForm from '../../assets/Components/Register/RegisterForm';
import { renderWithProviders } from '../test-utils';

describe('User Registration', () => {
    it('renders registration form and submits', () => {
        renderWithProviders(<RegisterForm />);
        expect(screen.getByLabelText(/Nombre de Usuario/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Contraseña')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Confirmar Contraseña')).toBeInTheDocument();

        fireEvent.change(screen.getByLabelText(/Nombre de Usuario/i), { target: { value: 'Nuevo Usuario' } });
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'nuevo@correo.com' } });
        fireEvent.change(screen.getByPlaceholderText('Contraseña'), { target: { value: 'password' } });
        fireEvent.change(screen.getByPlaceholderText('Confirmar Contraseña'), { target: { value: 'password' } });
        // Add assertion for successful registration (mocked)
    });
});
