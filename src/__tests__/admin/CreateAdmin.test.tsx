import { fireEvent, screen } from '@testing-library/react';
import RegisterForm from '../../assets/Components/Register/RegisterForm';
import { renderWithProviders } from '../test-utils';

describe('Create Admin', () => {
    it('renders admin creation form and submits', () => {
        renderWithProviders(<RegisterForm />);
        expect(screen.getByLabelText(/Nombre de Usuario/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Contraseña')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Confirmar Contraseña')).toBeInTheDocument();

        fireEvent.change(screen.getByLabelText(/Nombre de Usuario/i), { target: { value: 'Nuevo Admin' } });
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'admin@admin.com' } });
        fireEvent.change(screen.getByPlaceholderText('Contraseña'), { target: { value: 'adminpass' } });
        fireEvent.change(screen.getByPlaceholderText('Confirmar Contraseña'), { target: { value: 'adminpass' } });
        // Add assertion for successful admin creation (mocked)
    });
});
