import { screen } from '@testing-library/react';
import NavigationMenu from '../../assets/Components/Blog/admin/dashboard/NavigationMenu';
import { renderWithProviders } from '../test-utils';

describe('NavigationMenu (Admin)', () => {
    it('renders admin and user menu grids', () => {
        const mockItems = [
            { key: 'admin-1', label: 'Posts', path: '/admin/posts', background: '/bg1.jpg', role: 'ROLE_ADMIN', viewAsUser: false },
            { key: 'admin-2', label: 'Events', path: '/admin/events', background: '/bg2.jpg', role: 'ROLE_ADMIN', viewAsUser: false },
            { key: 'user-1', label: 'Blog', path: '/blog', background: '/bg3.jpg', viewAsUser: true },
            { key: 'user-2', label: 'Eventos', path: '/events', background: '/bg4.jpg', viewAsUser: true }
        ];

        renderWithProviders(<NavigationMenu items={mockItems} />);

        // Check that the menu structure renders
        expect(screen.getByText(/Posts/i)).toBeInTheDocument();
        expect(screen.getByText(/Events/i)).toBeInTheDocument();
        expect(screen.getByText(/Blog/i)).toBeInTheDocument();
        expect(screen.getByText(/Eventos/i)).toBeInTheDocument();
    });
});
