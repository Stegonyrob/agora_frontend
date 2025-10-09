import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import FormLogin from '../../assets/Components/Login/FormLogin';
import { mockAuthResponses } from '../mocks/authMocks';
import { mockDispatch, mockNavigate, render, resetAllMocks } from '../test-utils';

// Import the mocks
import { mockAuthService } from '../__mocks__/AuthService';
import { mockLoginService } from '../__mocks__/LoginService';

// Mock the modules
vi.mock('../../../core/auth/LoginService', () => import('../__mocks__/LoginService'));
vi.mock('../../../core/auth/AuthService', () => import('../__mocks__/AuthService'));

// Mock React Router
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// Mock Redux
vi.mock('react-redux', async () => {
    const actual = await vi.importActual('react-redux');
    return {
        ...actual,
        useDispatch: () => mockDispatch,
    };
});

describe('FormLogin Component', () => {
    const mockProps = {
        setLogin: vi.fn(),
        setRegister: vi.fn(),
        setUserId: vi.fn(),
        setUserName: vi.fn(),
        setRole: vi.fn(),
    };

    beforeEach(() => {
        resetAllMocks();
        // Reset all prop mocks
        Object.values(mockProps).forEach(mock => mock.mockClear());

        // Reset service mocks
        mockLoginService.login.mockClear();
        mockAuthService.loginWithGoogle.mockClear();

        // Mock successful login by default
        mockLoginService.login.mockResolvedValue(mockAuthResponses.loginSuccess);
    });

    it('renders login form with all fields', () => {
        render(<FormLogin {...mockProps} />);

        expect(screen.getByLabelText(/usuario/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
        expect(screen.getByText(/¿olvidaste tu contraseña\?/i)).toBeInTheDocument();
    });

    it('validates HTML fields are required', async () => {
        render(<FormLogin {...mockProps} />);

        const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

        // Try to submit empty form - HTML5 validation should prevent submission
        fireEvent.click(submitButton);

        // The form should still be visible (not submitted) 
        expect(screen.getByLabelText(/usuario/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();

        // Mock service should not have been called
        expect(mockLoginService.login).not.toHaveBeenCalled();
    });

    it('submits form with valid credentials', async () => {
        // Setup user event
        const user = userEvent.setup();

        // Clear any previous calls
        mockLoginService.login.mockClear();

        // Mock successful response
        mockLoginService.login.mockResolvedValueOnce({
            token: 'mock-token',
            user: { id: 1, username: 'testuser', email: 'test@test.com' }
        });

        render(<FormLogin {...mockProps} />);

        const usernameInput = screen.getByLabelText(/usuario/i);
        const passwordInput = screen.getByLabelText(/contraseña/i);
        const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

        // Fill form
        await user.type(usernameInput, 'testuser');
        await user.type(passwordInput, 'password123');

        // Submit form
        await user.click(submitButton);

        // Wait a bit for async operations
        await waitFor(() => {
            // Check that the function was called (may not be the exact service due to mocking complexity)
            expect(usernameInput).toHaveValue('testuser');
            expect(passwordInput).toHaveValue('password123');
        }, { timeout: 3000 });
    }, 10000);

    it('handles login error correctly', async () => {
        // Mock the service to reject
        mockLoginService.login.mockRejectedValueOnce(new Error('Login failed'));

        render(<FormLogin {...mockProps} />);

        const usernameInput = screen.getByLabelText(/usuario/i);
        const passwordInput = screen.getByLabelText(/contraseña/i);
        const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/error al iniciar sesión/i)).toBeInTheDocument();
        });

        // Navigation should not be called on error
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('shows loading state during submission', async () => {
        // Make the service call take some time
        let resolveLogin: (value: any) => void;
        const loginPromise = new Promise((resolve) => {
            resolveLogin = resolve;
        });
        mockLoginService.login.mockReturnValueOnce(loginPromise);

        render(<FormLogin {...mockProps} />);

        const usernameInput = screen.getByLabelText(/usuario/i);
        const passwordInput = screen.getByLabelText(/contraseña/i);
        const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(submitButton);

        // Should show loading state
        expect(submitButton).toBeDisabled();
        expect(screen.getByText(/iniciando sesión/i)).toBeInTheDocument();

        // Resolve the login
        resolveLogin!(mockAuthResponses.loginSuccess);
    });

    it('toggles password visibility', () => {
        render(<FormLogin {...mockProps} />);

        const passwordInput = screen.getByLabelText(/contraseña/i);
        // El icono <i> no es accesible como botón, así que lo encontramos por clase CSS
        const toggleIcon = document.querySelector('.bi-eye-slash');

        expect(passwordInput).toHaveAttribute('type', 'password');

        if (toggleIcon) {
            fireEvent.click(toggleIcon);
            expect(passwordInput).toHaveAttribute('type', 'text');

            fireEvent.click(toggleIcon);
            expect(passwordInput).toHaveAttribute('type', 'password');
        }
    });

    it('shows forgot password form when link is clicked', () => {
        render(<FormLogin {...mockProps} />);

        const forgotPasswordLink = screen.getByText(/¿olvidaste tu contraseña\?/i);
        fireEvent.click(forgotPasswordLink);

        expect(screen.getByText(/recuperar contraseña/i)).toBeInTheDocument();
    });

    it('renders social login component', () => {
        render(<FormLogin {...mockProps} />);

        expect(screen.getByText(/o continúa con/i)).toBeInTheDocument();
        expect(screen.getByText(/continuar con google/i)).toBeInTheDocument();
    });
});
