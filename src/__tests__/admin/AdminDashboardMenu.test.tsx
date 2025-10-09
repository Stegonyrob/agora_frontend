import { screen, waitFor } from '@testing-library/react';
import AdminDashboardMenu from '../../assets/Components/Blog/admin/dashboard/AdminDashboardMenu';
import { renderWithProviders } from '../test-utils';

describe('AdminDashboardMenu', () => {
    it('renders admin and user sections after loading', async () => {
        renderWithProviders(<AdminDashboardMenu />);

        // Wait for loading to complete (component has 60ms timer)
        await waitFor(() => {
            expect(screen.getByText(/Vistas Admin/i)).toBeInTheDocument();
        }, { timeout: 1000 });

        expect(screen.getByText(/Vistas Usuario/i)).toBeInTheDocument();
    });
});
