import { fireEvent, render, screen } from '@testing-library/react';
import Login from '../../assets/Components/Login/FormLogin';

describe('User Login', () => {
    it('renders login form and submits', () => {
        render(<Login />);
        expect(screen.getByLabelText(/Usuario/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
        fireEvent.change(screen.getByLabelText(/Usuario/i), { target: { value: 'user1' } });
        fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: 'password' } });
        fireEvent.click(screen.getByRole('button', { name: /Iniciar sesión/i }));
        // Add assertion for successful login (mocked)
    });
});
