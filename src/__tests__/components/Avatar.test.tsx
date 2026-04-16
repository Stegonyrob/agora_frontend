import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Avatar from '../../assets/Components/Avatar/Avatar';

describe('Avatar Component', () => {
    const defaultProps = {
        userName: 'Juan Pérez',
        avatarUrl: '/images/test-avatar.jpg',
        onProfile: vi.fn(),
        onSettings: vi.fn(),
        onLogout: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Rendering', () => {
        it('should render avatar image with correct src and alt', () => {
            render(<Avatar {...defaultProps} />);

            const avatarImage = screen.getByAltText('Juan Pérez');
            expect(avatarImage).toBeInTheDocument();
            expect(avatarImage).toHaveAttribute('src', '/images/test-avatar.jpg');
        });

        it('should not show dropdown menu initially', () => {
            render(<Avatar {...defaultProps} />);

            expect(screen.queryByText('Perfil')).not.toBeInTheDocument();
            expect(screen.queryByText('Configuración')).not.toBeInTheDocument();
            expect(screen.queryByText('Cerrar sesión')).not.toBeInTheDocument();
        });
    });

    describe('Dropdown Menu Interaction', () => {
        it('should show dropdown menu when avatar is clicked', () => {
            render(<Avatar {...defaultProps} />);

            const avatarImage = screen.getByAltText('Juan Pérez');
            fireEvent.click(avatarImage);

            expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
            expect(screen.getByText('Perfil')).toBeInTheDocument();
            expect(screen.getByText('Configuración')).toBeInTheDocument();
            expect(screen.getByText('Cerrar sesión')).toBeInTheDocument();
        });

        it('should hide dropdown menu when avatar is clicked again', () => {
            render(<Avatar {...defaultProps} />);

            const avatarImage = screen.getByAltText('Juan Pérez');

            // Open menu
            fireEvent.click(avatarImage);
            expect(screen.getByText('Perfil')).toBeInTheDocument();

            // Close menu
            fireEvent.click(avatarImage);
            expect(screen.queryByText('Perfil')).not.toBeInTheDocument();
        });

        it('should close dropdown when clicking outside', () => {
            render(
                <div>
                    <Avatar {...defaultProps} />
                    <div data-testid="outside">Outside element</div>
                </div>
            );

            const avatarImage = screen.getByAltText('Juan Pérez');
            const outsideElement = screen.getByTestId('outside');

            // Open menu
            fireEvent.click(avatarImage);
            expect(screen.getByText('Perfil')).toBeInTheDocument();

            // Click outside
            fireEvent.mouseDown(outsideElement);
            expect(screen.queryByText('Perfil')).not.toBeInTheDocument();
        });
    });

    describe('Menu Actions', () => {
        it('should call onProfile when Perfil button is clicked', () => {
            render(<Avatar {...defaultProps} />);

            const avatarImage = screen.getByAltText('Juan Pérez');
            fireEvent.click(avatarImage);

            const profileButton = screen.getByText('Perfil');
            fireEvent.click(profileButton);

            expect(defaultProps.onProfile).toHaveBeenCalledTimes(1);
            expect(screen.queryByText('Perfil')).not.toBeInTheDocument(); // Menu should close
        });

        it('should call onSettings when Configuración button is clicked', () => {
            render(<Avatar {...defaultProps} />);

            const avatarImage = screen.getByAltText('Juan Pérez');
            fireEvent.click(avatarImage);

            const settingsButton = screen.getByText('Configuración');
            fireEvent.click(settingsButton);

            expect(defaultProps.onSettings).toHaveBeenCalledTimes(1);
            expect(screen.queryByText('Configuración')).not.toBeInTheDocument(); // Menu should close
        });

        it('should call onLogout when Cerrar sesión button is clicked', () => {
            render(<Avatar {...defaultProps} />);

            const avatarImage = screen.getByAltText('Juan Pérez');
            fireEvent.click(avatarImage);

            const logoutButton = screen.getByText('Cerrar sesión');
            fireEvent.click(logoutButton);

            expect(defaultProps.onLogout).toHaveBeenCalledTimes(1);
            expect(screen.queryByText('Cerrar sesión')).not.toBeInTheDocument(); // Menu should close
        });
    });

    describe('Accessibility', () => {
        it('should have proper cursor pointer style on avatar image', () => {
            render(<Avatar {...defaultProps} />);

            const avatarImage = screen.getByAltText('Juan Pérez');
            expect(avatarImage).toHaveStyle({ cursor: 'pointer' });
        });

        it('should display user name in dropdown header', () => {
            render(<Avatar {...defaultProps} />);

            const avatarImage = screen.getByAltText('Juan Pérez');
            fireEvent.click(avatarImage);

            const header = screen.getByText('Juan Pérez');
            expect(header).toBeInTheDocument();
        });
    });

    describe('Edge Cases', () => {
        it('should handle empty userName gracefully', () => {
            render(<Avatar {...defaultProps} userName="" />);

            const avatarImage = screen.getByAltText('');
            fireEvent.click(avatarImage);

            // Should still show empty string in header, not crash
            const headerElements = screen.getAllByText('', { selector: 'strong' });
            expect(headerElements.length).toBeGreaterThan(0);
        }); it('should handle missing avatarUrl', () => {
            render(<Avatar {...defaultProps} avatarUrl="" />);

            const avatarImage = screen.getByAltText('Juan Pérez');
            expect(avatarImage).toHaveAttribute('src', '');
        });

        it('should handle rapid clicks without errors', () => {
            render(<Avatar {...defaultProps} />);

            const avatarImage = screen.getByAltText('Juan Pérez');

            // Rapid clicks - open, close, open
            fireEvent.click(avatarImage); // open
            fireEvent.click(avatarImage); // close  
            fireEvent.click(avatarImage); // open again

            // Should not crash and final state should be open (3 clicks = open)
            expect(screen.getByText('Perfil')).toBeInTheDocument();
        });
    });

    describe('Responsive Behavior', () => {
        it('should maintain functionality regardless of container size', () => {
            const { container } = render(
                <div style={{ width: '200px' }}>
                    <Avatar {...defaultProps} />
                </div>
            );

            const avatarImage = screen.getByAltText('Juan Pérez');
            fireEvent.click(avatarImage);

            expect(screen.getByText('Perfil')).toBeInTheDocument();
            expect(container.querySelector('[style*="width: 200px"]')).toBeInTheDocument();
        });
    });
});