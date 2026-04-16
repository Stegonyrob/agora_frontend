import { fireEvent, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import SocialLogin from '../../assets/Components/Login/SocialLogin';
import { mockGoogleAuth, resetGlobalMocks } from '../mocks/globalMocks';
import { render, resetAllMocks, vi } from '../test-utils';

describe('SocialLogin Component', () => {
    const mockProps = {
        onGoogleLogin: vi.fn(),
        isLoading: false,
    };

    beforeEach(() => {
        resetAllMocks();
        resetGlobalMocks();
        mockProps.onGoogleLogin.mockClear();
    });

    it('renders social login container with divider', () => {
        render(<SocialLogin {...mockProps} />);

        expect(screen.getByText(/o continúa con/i)).toBeInTheDocument();
    });

    it('renders Google login button', () => {
        render(<SocialLogin {...mockProps} />);

        const googleButton = screen.getByRole('button', { name: /continuar con google/i });
        expect(googleButton).toBeInTheDocument();
        expect(googleButton).not.toBeDisabled();
    });

    it('disables Google button when loading', () => {
        render(<SocialLogin {...mockProps} isLoading={true} />);

        const googleButton = screen.getByRole('button', { name: /conectando/i });
        expect(googleButton).toBeDisabled();
    });

    it('shows connecting text when loading', () => {
        render(<SocialLogin {...mockProps} isLoading={true} />);

        expect(screen.getByText(/conectando/i)).toBeInTheDocument();
    });

    it('handles Google login click', async () => {
        const mockRequestAccessToken = vi.fn();
        mockGoogleAuth.accounts.oauth2.initTokenClient.mockReturnValue({
            requestAccessToken: mockRequestAccessToken
        });

        render(<SocialLogin {...mockProps} />);

        const googleButton = screen.getByRole('button', { name: /continuar con google/i });
        fireEvent.click(googleButton);

        expect(mockGoogleAuth.accounts.oauth2.initTokenClient).toHaveBeenCalledWith({
            client_id: expect.any(String), // Less strict - accept any string
            scope: 'email profile',
            callback: expect.any(Function),
        });
        expect(mockRequestAccessToken).toHaveBeenCalled();
    });

    it('calls onGoogleLogin when Google auth succeeds', async () => {
        const mockCallback = vi.fn();
        mockGoogleAuth.accounts.oauth2.initTokenClient.mockImplementation((config) => {
            // Simulate successful auth response
            setTimeout(() => {
                config.callback({ access_token: 'mock-google-token' });
            }, 0);
            return { requestAccessToken: vi.fn() };
        });

        render(<SocialLogin {...mockProps} />);

        const googleButton = screen.getByRole('button', { name: /continuar con google/i });
        fireEvent.click(googleButton);

        await waitFor(() => {
            expect(mockProps.onGoogleLogin).toHaveBeenCalledWith('mock-google-token');
        });
    });

    it('shows alert when Google SDK is not loaded', () => {
        // Mock window.google as undefined
        Object.defineProperty(window, 'google', {
            value: undefined,
            writable: true
        });

        window.alert = vi.fn();

        render(<SocialLogin {...mockProps} />);

        const googleButton = screen.getByRole('button', { name: /continuar con google/i });
        fireEvent.click(googleButton);

        expect(window.alert).toHaveBeenCalledWith('Google SDK no está cargado. Por favor, recarga la página.');
    });

    it('does not render Facebook login button (commented out)', () => {
        render(<SocialLogin {...mockProps} />);

        // Facebook button should not be present since it's commented out for production
        expect(screen.queryByText(/continuar con facebook/i)).not.toBeInTheDocument();
    });

    it('has correct button styling classes', () => {
        render(<SocialLogin {...mockProps} />);

        const googleButton = screen.getByRole('button', { name: /continuar con google/i });
        expect(googleButton.className).toContain('socialButton');
        expect(googleButton.className).toContain('googleButton');
    });

    it('renders Google icon SVG', () => {
        render(<SocialLogin {...mockProps} />);

        const googleButton = screen.getByRole('button', { name: /continuar con google/i });
        const svg = googleButton.querySelector('svg');
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
        // Verify the SVG has the correct structure with Google's color paths
        const paths = svg?.querySelectorAll('path');
        expect(paths).toHaveLength(4); // Google icon has 4 colored paths
    });
});